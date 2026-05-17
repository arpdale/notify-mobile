/** Loads the on-disk fixture and re-exports it as typed arrays.
 *
 *  The JSON file is the only data source today. When a real backend lands,
 *  swap this module's body for a fetch + cache layer — the selectors don't
 *  need to know.
 *
 *  Date shift: the fixture is anchored to a fixed date (anchorDate) baked in
 *  at generation time. At load, we shift every date forward (or backward) by
 *  the smallest whole number of weeks needed to put today inside the window.
 *  Whole-week granularity preserves day-of-week — the hourly traffic curve
 *  stays restaurant-shaped on the correct weekdays (weekend ≠ weekday). */

import fixtureJson from './fixture.json'
import type {
  CategoryDayFact,
  Check,
  Fixture,
  LaborDayFact,
  SalesHourFact,
  Store,
  StoreOpsFact,
  TillEvent,
} from './types'

const fixture = fixtureJson as unknown as Fixture

const MS_PER_DAY = 86_400_000

function parseIsoDateUtc(iso: string): number {
  // Accepts YYYY-MM-DD or full ISO datetime; YYYY-MM-DD is interpreted as UTC midnight.
  return Date.parse(iso.length === 10 ? `${iso}T00:00:00Z` : iso)
}

function formatIsoDateUtc(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10)
}

function todayLocalIso(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const anchorMs = parseIsoDateUtc(fixture.anchorDate)
const todayMs = parseIsoDateUtc(todayLocalIso())
const diffDays = Math.round((todayMs - anchorMs) / MS_PER_DAY)
// Smallest whole-week shift that places today on or before the new anchor.
// ceil(x/7)*7: when today ≤ anchor, shift ≤ 0; when today > anchor, shift > 0.
const SHIFT_DAYS = Math.ceil(diffDays / 7) * 7
const SHIFT_MS = SHIFT_DAYS * MS_PER_DAY

function shiftDate(iso: string): string {
  return formatIsoDateUtc(parseIsoDateUtc(iso) + SHIFT_MS)
}

// Datetime strings are "YYYY-MM-DDTHH:MM:SSZ"; replace the date prefix so the
// time-of-day and tz suffix survive intact.
function shiftDatetime(iso: string): string {
  return shiftDate(iso.slice(0, 10)) + iso.slice(10)
}

if (SHIFT_DAYS !== 0) {
  for (const r of fixture.salesHourly) r.date = shiftDate(r.date)
  for (const r of fixture.laborDaily) r.date = shiftDate(r.date)
  for (const r of fixture.categoryDaily) r.date = shiftDate(r.date)
  for (const r of fixture.storeOps) r.date = shiftDate(r.date)
  for (const t of fixture.tills) {
    t.claimedAt = shiftDatetime(t.claimedAt)
    if (t.closedAt) t.closedAt = shiftDatetime(t.closedAt)
    if (t.reconciledAt) t.reconciledAt = shiftDatetime(t.reconciledAt)
  }
  for (const c of fixture.checks) c.occurredAt = shiftDatetime(c.occurredAt)
}

export const FIXTURE_ANCHOR_DATE =
  SHIFT_DAYS === 0 ? fixture.anchorDate : formatIsoDateUtc(anchorMs + SHIFT_MS)
export const FIXTURE_GENERATED_AT = fixture.generatedAt

export const STORES: Store[] = fixture.stores
export const SALES_HOURLY: SalesHourFact[] = fixture.salesHourly
export const LABOR_DAILY: LaborDayFact[] = fixture.laborDaily
export const CATEGORY_DAILY: CategoryDayFact[] = fixture.categoryDaily
export const STORE_OPS: StoreOpsFact[] = fixture.storeOps
export const TILLS: TillEvent[] = fixture.tills
export const CHECKS: Check[] = fixture.checks
