/**
 * Date-filter logic for the Notify proto.
 *
 * Replaces the Tier-7 placeholder where every date was a hardcoded string.
 * Everything here computes from a `today` reference (passed in by callers so
 * the helpers are pure + testable). The shape covers:
 *
 *   - DateFilter: state stored in App (also persisted to localStorage)
 *   - resolvePrimary / resolveCompare: filter -> concrete Range
 *   - primaryOptions / compareOptions: per-mode option lists for the picker UI
 *   - formatDate / formatDateRange / formatPillLabel: display strings for the
 *     context-bar pill and the radio sub-labels
 */

export type DateMode = 'Day' | 'Week' | 'Month' | 'Custom'

/** mode-dependent ids:
 *   Day:    'today' | 'yesterday'
 *   Week:   'this-week' | 'last-week'
 *   Month:  'this-month' | 'last-month'
 *   Custom: 'custom'
 *
 *  Stored as a string union (rather than a discriminated union on `mode`) so
 *  the persisted shape stays simple. invalidPeriodForMode() validates on
 *  read; callers normalize via defaultPeriodFor(mode) when needed.
 */
export type DateFilter = {
  mode: DateMode
  period: string
  /** ISO date (YYYY-MM-DD) — only meaningful when mode === 'Custom' */
  customDate: string | null
  compareOn: boolean
  /** Compare-option id, or null when nothing is selected even though
   *  compareOn is true (rare; usually we keep a default selected). */
  compare: string | null
}

export type Range = { start: Date; end: Date }

// ── Date math ─────────────────────────────────────────────────────────────

const MS_PER_DAY = 86400000

export function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export function addDays(d: Date, n: number): Date {
  const x = startOfDay(d)
  x.setDate(x.getDate() + n)
  return x
}

/** Monday-anchored week start. Restaurant analytics convention. */
export function startOfWeek(d: Date): Date {
  const x = startOfDay(d)
  const dow = (x.getDay() + 6) % 7 // 0 = Monday
  return addDays(x, -dow)
}
export function endOfWeek(d: Date): Date {
  return addDays(startOfWeek(d), 6)
}

export function startOfMonth(d: Date): Date {
  const x = startOfDay(d)
  x.setDate(1)
  return x
}
export function endOfMonth(d: Date): Date {
  const x = startOfMonth(d)
  x.setMonth(x.getMonth() + 1)
  x.setDate(0)
  return x
}

/** Calendar-shift a date by N years (May 12 2026 → May 12 2025 for -1). */
function shiftYears(d: Date, years: number): Date {
  const x = new Date(d)
  x.setFullYear(x.getFullYear() + years)
  return startOfDay(x)
}

function differenceInDays(a: Date, b: Date): number {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / MS_PER_DAY)
}

// ── Formatting ────────────────────────────────────────────────────────────

export function formatDate(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const yy = String(d.getFullYear()).slice(-2)
  return `${mm}/${dd}/${yy}`
}

export function formatDateRange(start: Date, end: Date): string {
  return `${formatDate(start)} – ${formatDate(end)}`
}

/** ISO date string (YYYY-MM-DD) — useful for <input type="date"> binding. */
export function toIsoDateString(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// ── Resolving filter → concrete ranges ────────────────────────────────────

export function resolvePrimary(filter: DateFilter, today: Date): Range {
  const t = startOfDay(today)
  switch (filter.mode) {
    case 'Day':
      if (filter.period === 'yesterday') {
        const y = addDays(t, -1)
        return { start: y, end: y }
      }
      return { start: t, end: t }
    case 'Week':
      if (filter.period === 'last-week') {
        const lws = addDays(startOfWeek(t), -7)
        return { start: lws, end: addDays(lws, 6) }
      }
      return { start: startOfWeek(t), end: endOfWeek(t) }
    case 'Month':
      if (filter.period === 'last-month') {
        const lms = new Date(t.getFullYear(), t.getMonth() - 1, 1)
        const lme = new Date(t.getFullYear(), t.getMonth(), 0)
        return { start: lms, end: lme }
      }
      return { start: startOfMonth(t), end: endOfMonth(t) }
    case 'Custom':
      if (filter.customDate) {
        const c = startOfDay(new Date(`${filter.customDate}T00:00:00`))
        return { start: c, end: c }
      }
      return { start: t, end: t }
  }
}

export function resolveCompare(
  filter: DateFilter,
  primary: Range,
): Range | null {
  if (!filter.compareOn || !filter.compare) return null
  const len = differenceInDays(primary.start, primary.end)
  switch (filter.compare) {
    case 'previous-day': {
      const d = addDays(primary.start, -1)
      return { start: d, end: d }
    }
    case 'same-day-last-week': {
      const s = addDays(primary.start, -7)
      return { start: s, end: addDays(s, len) }
    }
    case 'same-date-last-year': {
      const s = shiftYears(primary.start, -1)
      const e = shiftYears(primary.end, -1)
      return { start: s, end: e }
    }
    case 'same-day-last-year': {
      // Same weekday in the same calendar week-of-year, last year — find the
      // closest weekday match to the original day-of-week.
      const s = shiftYears(primary.start, -1)
      const targetDow = primary.start.getDay()
      let diff = (targetDow - s.getDay() + 7) % 7
      if (diff > 3) diff -= 7 // pick the closer side
      const adjusted = addDays(s, diff)
      return { start: adjusted, end: addDays(adjusted, len) }
    }
    case 'previous-week': {
      const s = addDays(primary.start, -7)
      return { start: s, end: addDays(primary.end, -7) }
    }
    case 'same-week-last-year': {
      const ws = startOfWeek(shiftYears(primary.start, -1))
      return { start: ws, end: addDays(ws, 6) }
    }
    case 'previous-month': {
      const s = new Date(primary.start.getFullYear(), primary.start.getMonth() - 1, 1)
      const e = new Date(primary.start.getFullYear(), primary.start.getMonth(), 0)
      return { start: s, end: e }
    }
    case 'same-month-last-year': {
      const s = shiftYears(primary.start, -1)
      return { start: startOfMonth(s), end: endOfMonth(s) }
    }
    default:
      return null
  }
}

// ── Per-mode option lists ─────────────────────────────────────────────────

export type PeriodOption = {
  id: string
  label: string
  sub?: string
}

export function primaryOptions(mode: DateMode, today: Date): PeriodOption[] {
  const t = startOfDay(today)
  switch (mode) {
    case 'Day':
      return [
        { id: 'today', label: 'Today', sub: `(${formatDate(t)})` },
        { id: 'yesterday', label: 'Yesterday', sub: `(${formatDate(addDays(t, -1))})` },
      ]
    case 'Week': {
      const tws = startOfWeek(t)
      const lws = addDays(tws, -7)
      return [
        {
          id: 'this-week',
          label: 'This Week',
          sub: `(${formatDateRange(tws, addDays(tws, 6))})`,
        },
        {
          id: 'last-week',
          label: 'Last Week',
          sub: `(${formatDateRange(lws, addDays(lws, 6))})`,
        },
      ]
    }
    case 'Month': {
      const tms = startOfMonth(t)
      const tme = endOfMonth(t)
      const lms = new Date(tms.getFullYear(), tms.getMonth() - 1, 1)
      const lme = new Date(tms.getFullYear(), tms.getMonth(), 0)
      return [
        {
          id: 'this-month',
          label: 'This Month',
          sub: `(${formatDateRange(tms, tme)})`,
        },
        {
          id: 'last-month',
          label: 'Last Month',
          sub: `(${formatDateRange(lms, lme)})`,
        },
      ]
    }
    case 'Custom':
      return []
  }
}

export function compareOptions(mode: DateMode, primary: Range): PeriodOption[] {
  switch (mode) {
    case 'Day':
    case 'Custom': {
      const prevDay = addDays(primary.start, -1)
      const sdLW = addDays(primary.start, -7)
      const sdtLY = shiftYears(primary.start, -1)
      const sdLY = (() => {
        const s = shiftYears(primary.start, -1)
        const targetDow = primary.start.getDay()
        let diff = (targetDow - s.getDay() + 7) % 7
        if (diff > 3) diff -= 7
        return addDays(s, diff)
      })()
      return [
        { id: 'previous-day', label: 'Previous Day', sub: `(${formatDate(prevDay)})` },
        {
          id: 'same-day-last-week',
          label: 'Same Day Last Week',
          sub: `(${formatDate(sdLW)})`,
        },
        {
          id: 'same-date-last-year',
          label: 'Same Date Last Year',
          sub: `(${formatDate(sdtLY)})`,
        },
        {
          id: 'same-day-last-year',
          label: 'Same Day Last Year',
          sub: `(${formatDate(sdLY)})`,
        },
      ]
    }
    case 'Week': {
      const prevStart = addDays(primary.start, -7)
      const prevEnd = addDays(primary.end, -7)
      const lyAnchor = shiftYears(primary.start, -1)
      const lyws = startOfWeek(lyAnchor)
      return [
        {
          id: 'previous-week',
          label: 'Previous Week',
          sub: `(${formatDateRange(prevStart, prevEnd)})`,
        },
        {
          id: 'same-week-last-year',
          label: 'Same Week Last Year',
          sub: `(${formatDateRange(lyws, addDays(lyws, 6))})`,
        },
      ]
    }
    case 'Month': {
      const pms = new Date(primary.start.getFullYear(), primary.start.getMonth() - 1, 1)
      const pme = new Date(primary.start.getFullYear(), primary.start.getMonth(), 0)
      const lyAnchor = shiftYears(primary.start, -1)
      return [
        {
          id: 'previous-month',
          label: 'Previous Month',
          sub: `(${formatDateRange(pms, pme)})`,
        },
        {
          id: 'same-month-last-year',
          label: 'Same Month Last Year',
          sub: `(${formatDateRange(startOfMonth(lyAnchor), endOfMonth(lyAnchor))})`,
        },
      ]
    }
  }
}

// ── Defaults per mode ─────────────────────────────────────────────────────

export function defaultPeriodFor(mode: DateMode): string {
  switch (mode) {
    case 'Day':
      return 'today'
    case 'Week':
      return 'this-week'
    case 'Month':
      return 'this-month'
    case 'Custom':
      return 'custom'
  }
}

export function defaultCompareFor(mode: DateMode): string {
  switch (mode) {
    case 'Day':
    case 'Custom':
      return 'previous-day'
    case 'Week':
      return 'previous-week'
    case 'Month':
      return 'previous-month'
  }
}

/** Initial state — Day / Today / no compare. */
export const DEFAULT_FILTER: DateFilter = {
  mode: 'Day',
  period: 'today',
  customDate: null,
  compareOn: false,
  compare: null,
}

// ── Context-bar pill label ────────────────────────────────────────────────

/** Compact label for the context-bar pill — fits inside the DS Selector pill
 *  on a phone width.
 *
 *  - Day / Custom, no compare:  "05/12/26"
 *  - Day / Custom, comparing:   "05/12/26 ⇄ 05/11/26"
 *  - Week / Month, no compare:  "05/11/26 – 05/17/26"
 *  - Week / Month, comparing:   "05/11/26 ⇄ 05/04/26"   (range start only;
 *                                full ranges live in the picker sheet) */
export function formatPillLabel(filter: DateFilter, today: Date): string {
  const primaryRange = resolvePrimary(filter, today)
  const compareRange = resolveCompare(filter, primaryRange)
  const isSingleDay = filter.mode === 'Day' || filter.mode === 'Custom'

  if (compareRange) {
    // Compact form when comparing — just the anchor dates of each range so
    // the pill stays narrow on phone widths.
    return `${formatDate(primaryRange.start)} ⇄ ${formatDate(compareRange.start)}`
  }
  return isSingleDay
    ? formatDate(primaryRange.start)
    : formatDateRange(primaryRange.start, primaryRange.end)
}

// ── localStorage shape ────────────────────────────────────────────────────

export function serializeFilter(f: DateFilter): string {
  return JSON.stringify(f)
}

export function deserializeFilter(raw: string): DateFilter | null {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof (parsed as Record<string, unknown>).mode === 'string' &&
      typeof (parsed as Record<string, unknown>).period === 'string'
    ) {
      return parsed as DateFilter
    }
  } catch {
    // fall through to null
  }
  return null
}
