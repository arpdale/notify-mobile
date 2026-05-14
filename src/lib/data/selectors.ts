/**
 * Selector API — the only surface screens import.
 *
 * Each selector is async so a future fetch-backed implementation is a
 * mechanical swap. Today they read from the in-memory fixture; tomorrow
 * they can hit `/api/...` with the same signatures.
 *
 * Two rules:
 *   1. Selectors take a Range (start/end Dates from dateFilter.resolvePrimary),
 *      optionally a priorRange for compares. Screens never touch raw rows.
 *   2. Derived numbers (trend %, ranks) are computed here. Formatting
 *      (currency, percent) stays in the UI.
 */

import type { Range } from '../dateFilter'
import { toIsoDateString } from '../dateFilter'

import {
  CATEGORY_DAILY,
  CHECKS,
  LABOR_DAILY,
  SALES_HOURLY,
  STORE_OPS,
  STORES,
  TILLS,
} from './index'
import type {
  CategoryDayFact,
  Check,
  ISODate,
  LaborDayFact,
  SalesHourFact,
  Store,
  StoreId,
  StoreOpsFact,
  TillEvent,
} from './types'

// ── Public metric unions ───────────────────────────────────────────────────

export type SalesMetric =
  | 'netSales'
  | 'grossSales'
  | 'averageCheck'
  | 'checks'
  | 'discounts'
  | 'payments'
  | 'cash'
  | 'voids'
  | 'serviceCharges'

export type LaborMetric =
  | 'laborHours'
  | 'laborCost'
  | 'employeeTips'
  | 'clockedInPeak'
  | 'openShifts'

export type LeaderboardMetric = 'netSales' | 'grossSales' | 'averageCheck'

export type CategoryKind = CategoryDayFact['category']

// ── Public return shapes ───────────────────────────────────────────────────

export type CompareValue = {
  value: number
  prior: number | null
}

export type SalesTiles = Record<SalesMetric, CompareValue>
export type LaborTiles = Record<LaborMetric, CompareValue>

export type HourPoint = {
  hour: number
  primary: number
  comparison: number | null
}

export type CategorySlice = { item: string; amount: number; count: number }
export type CategoryBreakdownRow = {
  item: string
  primary: { amount: number; count: number }
  comparison: { amount: number; count: number } | null
}
export type CategoryBreakdown = {
  totalAmount: number
  totalCount: number
  slices: CategorySlice[]
  rows: CategoryBreakdownRow[]
}

export type LeaderboardRow = {
  storeId: StoreId
  storeName: string
  value: number
  rank: number
  priorRank: number | null
  rankDelta: number | null
}

// ── Helpers ────────────────────────────────────────────────────────────────

const optionalStoreFilter = (storeIds: Iterable<StoreId> | undefined): Set<StoreId> | null => {
  if (!storeIds) return null
  const s = new Set(storeIds)
  return s.size === 0 ? new Set() : s
}

const dateInRange = (iso: ISODate, range: Range): boolean => {
  const lo = toIsoDateString(range.start)
  const hi = toIsoDateString(range.end)
  return iso >= lo && iso <= hi
}

/** Centered percentage change. Returns null when prior is missing or zero
 *  (caller renders an em-dash). */
export function trendPct(value: number, prior: number | null): number | null {
  if (prior === null || prior === 0) return null
  return ((value - prior) / prior) * 100
}

const sum = (rows: SalesHourFact[], f: (r: SalesHourFact) => number): number =>
  rows.reduce((acc, r) => acc + f(r), 0)

// ── Sales tiles ────────────────────────────────────────────────────────────

type SalesAggregate = {
  netSales: number
  grossSales: number
  checks: number
  discounts: number
  payments: number
  cash: number
  voids: number
  serviceCharges: number
}

function aggregateSales(rows: SalesHourFact[]): SalesAggregate {
  return {
    netSales:       sum(rows, (r) => r.netSales),
    grossSales:     sum(rows, (r) => r.grossSales),
    checks:         sum(rows, (r) => r.checks),
    discounts:      sum(rows, (r) => r.discounts),
    payments:       sum(rows, (r) => r.payments),
    cash:           sum(rows, (r) => r.cash),
    voids:          sum(rows, (r) => r.voids),
    serviceCharges: sum(rows, (r) => r.serviceCharges),
  }
}

function avgCheck(agg: SalesAggregate): number {
  return agg.checks > 0 ? agg.netSales / agg.checks : 0
}

function salesRowsFor(range: Range, stores: Set<StoreId> | null): SalesHourFact[] {
  return SALES_HOURLY.filter((r) =>
    dateInRange(r.date, range) && (stores === null || stores.has(r.storeId)),
  )
}

export type StoreFilter = { storeIds?: Iterable<StoreId> }

export async function getSalesTiles(
  range: Range,
  opts: StoreFilter & { priorRange?: Range } = {},
): Promise<SalesTiles> {
  const stores = optionalStoreFilter(opts.storeIds)
  const primary = aggregateSales(salesRowsFor(range, stores))
  const prior = opts.priorRange ? aggregateSales(salesRowsFor(opts.priorRange, stores)) : null

  const pairs: SalesTiles = {
    netSales:       { value: primary.netSales,       prior: prior?.netSales       ?? null },
    grossSales:     { value: primary.grossSales,     prior: prior?.grossSales     ?? null },
    averageCheck:   { value: avgCheck(primary),      prior: prior ? avgCheck(prior) : null },
    checks:         { value: primary.checks,         prior: prior?.checks         ?? null },
    discounts:      { value: primary.discounts,      prior: prior?.discounts      ?? null },
    payments:       { value: primary.payments,       prior: prior?.payments       ?? null },
    cash:           { value: primary.cash,           prior: prior?.cash           ?? null },
    voids:          { value: primary.voids,          prior: prior?.voids          ?? null },
    serviceCharges: { value: primary.serviceCharges, prior: prior?.serviceCharges ?? null },
  }
  return pairs
}

// ── Labor tiles ────────────────────────────────────────────────────────────

function laborRowsFor(range: Range, stores: Set<StoreId> | null): LaborDayFact[] {
  return LABOR_DAILY.filter((r) =>
    dateInRange(r.date, range) && (stores === null || stores.has(r.storeId)),
  )
}

function aggregateLabor(rows: LaborDayFact[]): Record<LaborMetric, number> {
  return {
    laborHours:    rows.reduce((a, r) => a + r.laborHours, 0),
    laborCost:     rows.reduce((a, r) => a + r.laborCost, 0),
    employeeTips:  rows.reduce((a, r) => a + r.employeeTips, 0),
    // Peak is the max across days, not a sum.
    clockedInPeak: rows.reduce((a, r) => Math.max(a, r.clockedInPeak), 0),
    openShifts:    rows.reduce((a, r) => a + r.openShifts, 0),
  }
}

export async function getLaborTiles(
  range: Range,
  opts: StoreFilter & { priorRange?: Range } = {},
): Promise<LaborTiles> {
  const stores = optionalStoreFilter(opts.storeIds)
  const primary = aggregateLabor(laborRowsFor(range, stores))
  const prior = opts.priorRange ? aggregateLabor(laborRowsFor(opts.priorRange, stores)) : null

  return {
    laborHours:    { value: primary.laborHours,    prior: prior?.laborHours    ?? null },
    laborCost:     { value: primary.laborCost,     prior: prior?.laborCost     ?? null },
    employeeTips:  { value: primary.employeeTips,  prior: prior?.employeeTips  ?? null },
    clockedInPeak: { value: primary.clockedInPeak, prior: prior?.clockedInPeak ?? null },
    openShifts:    { value: primary.openShifts,    prior: prior?.openShifts    ?? null },
  }
}

// ── Hourly comparison ──────────────────────────────────────────────────────

/** Pick a numeric field off a SalesHourFact. averageCheck is derived per-hour
 *  as netSales / checks (zero-guarded). */
function hourlyValue(row: SalesHourFact, metric: SalesMetric): number {
  switch (metric) {
    case 'netSales':       return row.netSales
    case 'grossSales':     return row.grossSales
    case 'checks':         return row.checks
    case 'discounts':      return row.discounts
    case 'payments':       return row.payments
    case 'cash':           return row.cash
    case 'voids':          return row.voids
    case 'serviceCharges': return row.serviceCharges
    case 'averageCheck':   return row.checks > 0 ? row.netSales / row.checks : 0
  }
}

/** Sum a metric per hour-of-day for a specific date, optionally for a subset
 *  of stores. Missing (storeId, date, hour) tuples in the sparse fixture are
 *  treated as zeros — so the result always has 24 entries. */
function hourlySeries(
  metric: SalesMetric,
  date: ISODate,
  stores: Set<StoreId> | null,
): number[] {
  const out = new Array(24).fill(0)
  // For averageCheck we need to aggregate then divide — not sum per-hour
  // averages. Track running net and checks separately, derive at the end.
  if (metric === 'averageCheck') {
    const net = new Array(24).fill(0)
    const cnt = new Array(24).fill(0)
    for (const r of SALES_HOURLY) {
      if (r.date !== date) continue
      if (stores !== null && !stores.has(r.storeId)) continue
      net[r.hour] += r.netSales
      cnt[r.hour] += r.checks
    }
    for (let h = 0; h < 24; h++) out[h] = cnt[h] > 0 ? net[h] / cnt[h] : 0
    return out
  }
  for (const r of SALES_HOURLY) {
    if (r.date !== date) continue
    if (stores !== null && !stores.has(r.storeId)) continue
    out[r.hour] += hourlyValue(r, metric)
  }
  return out
}

export async function getHourlyComparison(
  metric: SalesMetric,
  date: ISODate,
  comparisonDate: ISODate | null,
  opts: StoreFilter = {},
): Promise<HourPoint[]> {
  const stores = optionalStoreFilter(opts.storeIds)
  const primary = hourlySeries(metric, date, stores)
  const comparison = comparisonDate ? hourlySeries(metric, comparisonDate, stores) : null

  return primary.map((p, h) => ({
    hour: h,
    primary: p,
    comparison: comparison ? comparison[h] : null,
  }))
}

// ── Category breakdown (Payments / Taxes / Discounts / Service Charges) ────

function categoryRowsFor(
  category: CategoryKind,
  range: Range,
  stores: Set<StoreId> | null,
): CategoryDayFact[] {
  return CATEGORY_DAILY.filter((r) =>
    r.category === category &&
    dateInRange(r.date, range) &&
    (stores === null || stores.has(r.storeId)),
  )
}

function rollupCategory(rows: CategoryDayFact[]): Map<string, { amount: number; count: number }> {
  const acc = new Map<string, { amount: number; count: number }>()
  for (const r of rows) {
    const cur = acc.get(r.item) ?? { amount: 0, count: 0 }
    cur.amount += r.amount
    cur.count += r.count
    acc.set(r.item, cur)
  }
  return acc
}

export async function getCategoryBreakdown(
  category: CategoryKind,
  range: Range,
  opts: StoreFilter & { priorRange?: Range } = {},
): Promise<CategoryBreakdown> {
  const stores = optionalStoreFilter(opts.storeIds)
  const primary = rollupCategory(categoryRowsFor(category, range, stores))
  const prior = opts.priorRange
    ? rollupCategory(categoryRowsFor(category, opts.priorRange, stores))
    : null

  const items = new Set<string>([...primary.keys(), ...(prior?.keys() ?? [])])

  let totalAmount = 0
  let totalCount = 0
  for (const v of primary.values()) {
    totalAmount += v.amount
    totalCount += v.count
  }

  const rows: CategoryBreakdownRow[] = [...items].map((item) => ({
    item,
    primary: primary.get(item) ?? { amount: 0, count: 0 },
    comparison: prior ? (prior.get(item) ?? { amount: 0, count: 0 }) : null,
  }))
  // Stable order: by primary amount desc, then label.
  rows.sort((a, b) => b.primary.amount - a.primary.amount || a.item.localeCompare(b.item))

  const slices: CategorySlice[] = rows
    .filter((r) => r.primary.amount > 0)
    .map((r) => ({ item: r.item, amount: r.primary.amount, count: r.primary.count }))

  return { totalAmount, totalCount, slices, rows }
}

// ── Store leaderboard (also powers StoreView Productivity) ─────────────────

function leaderboardMetricValue(rows: SalesHourFact[], metric: LeaderboardMetric): number {
  if (rows.length === 0) return 0
  const net = sum(rows, (r) => r.netSales)
  if (metric === 'netSales') return net
  if (metric === 'grossSales') return sum(rows, (r) => r.grossSales)
  const checks = sum(rows, (r) => r.checks)
  return checks > 0 ? net / checks : 0
}

function rankStores(
  metric: LeaderboardMetric,
  range: Range,
  stores: Set<StoreId> | null,
): Map<StoreId, { value: number; rank: number }> {
  // Group sales rows by store within the range.
  const byStore = new Map<StoreId, SalesHourFact[]>()
  for (const r of SALES_HOURLY) {
    if (!dateInRange(r.date, range)) continue
    if (stores !== null && !stores.has(r.storeId)) continue
    const arr = byStore.get(r.storeId)
    if (arr) arr.push(r)
    else byStore.set(r.storeId, [r])
  }
  // Ensure every store in scope shows up, even with zero data.
  const scope = stores ?? new Set(STORES.map((s) => s.id))
  for (const id of scope) if (!byStore.has(id)) byStore.set(id, [])

  const valued = [...byStore.entries()].map(([storeId, rows]) => ({
    storeId,
    value: leaderboardMetricValue(rows, metric),
  }))
  valued.sort((a, b) => b.value - a.value || a.storeId.localeCompare(b.storeId))

  const out = new Map<StoreId, { value: number; rank: number }>()
  valued.forEach((v, i) => out.set(v.storeId, { value: v.value, rank: i + 1 }))
  return out
}

export async function getStoreLeaderboard(
  metric: LeaderboardMetric,
  range: Range,
  opts: StoreFilter & { priorRange?: Range } = {},
): Promise<LeaderboardRow[]> {
  const stores = optionalStoreFilter(opts.storeIds)
  const primary = rankStores(metric, range, stores)
  const prior = opts.priorRange ? rankStores(metric, opts.priorRange, stores) : null
  const storesById = new Map(STORES.map((s) => [s.id, s] as const))

  const rows: LeaderboardRow[] = [...primary.entries()].map(([storeId, p]) => {
    const priorRank = prior?.get(storeId)?.rank ?? null
    return {
      storeId,
      storeName: storesById.get(storeId)?.name ?? storeId,
      value: p.value,
      rank: p.rank,
      priorRank,
      // Positive delta = moved up (smaller rank number). Null when no prior.
      rankDelta: priorRank === null ? null : priorRank - p.rank,
    }
  })
  rows.sort((a, b) => a.rank - b.rank)
  return rows
}

// ── Store ops (for StoreView Network / Kitchen) ────────────────────────────

export async function getStoreOpsByDate(
  date: ISODate,
  opts: StoreFilter = {},
): Promise<StoreOpsFact[]> {
  const stores = optionalStoreFilter(opts.storeIds)
  return STORE_OPS.filter((r) =>
    r.date === date && (stores === null || stores.has(r.storeId)),
  )
}

// ── Stores ────────────────────────────────────────────────────────────────

export async function getStores(): Promise<Store[]> {
  return STORES
}

// ── Events: tills ──────────────────────────────────────────────────────────

export type TillFilter = StoreFilter & {
  status?: TillEvent['status']
  /** ISO datetime lo/hi (inclusive). */
  from?: string
  to?: string
}

export async function listTills(opts: TillFilter = {}): Promise<TillEvent[]> {
  const stores = optionalStoreFilter(opts.storeIds)
  return TILLS.filter((t) => {
    if (stores !== null && !stores.has(t.storeId)) return false
    if (opts.status && t.status !== opts.status) return false
    if (opts.from && t.claimedAt < opts.from) return false
    if (opts.to && t.claimedAt > opts.to) return false
    return true
  })
}

// ── Events: checks ─────────────────────────────────────────────────────────

export type CheckFilter = StoreFilter & {
  /** ISO datetime lo/hi (inclusive). */
  from?: string
  to?: string
  /** Substring match against check id or employee name. */
  query?: string
}

export type CheckSearchResult = {
  totals: { count: number; netSales: number }
  checks: Check[]
}

export async function searchChecks(opts: CheckFilter = {}): Promise<CheckSearchResult> {
  const stores = optionalStoreFilter(opts.storeIds)
  const q = opts.query?.trim().toLowerCase() ?? ''
  const filtered = CHECKS.filter((c) => {
    if (stores !== null && !stores.has(c.storeId)) return false
    if (opts.from && c.occurredAt < opts.from) return false
    if (opts.to && c.occurredAt > opts.to) return false
    if (q && !c.id.toLowerCase().includes(q) && !c.employeeName.toLowerCase().includes(q)) {
      return false
    }
    return true
  })
  return {
    totals: {
      count: filtered.length,
      netSales: filtered.reduce((a, c) => a + c.netSales, 0),
    },
    checks: filtered,
  }
}
