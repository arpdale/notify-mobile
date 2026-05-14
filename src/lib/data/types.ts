/**
 * Shape of the local data fixture that backs every screen.
 *
 * Three rules:
 *   1. Store raw — never persist trends, prior values, ranks. Selectors derive
 *      them on demand so adding a new compare period later is free.
 *   2. Hourly is the finest grain we need (Net Sales hourly chart). Daily and
 *      weekly aggregates fall out by summing.
 *   3. Per-store always. The single-store dashboard and the multi-store
 *      leaderboard read from the same fact tables.
 *
 * Numbers are decimal dollars (e.g. 345.58). Counts are integers. Dates are
 * ISO YYYY-MM-DD strings; datetimes are ISO 8601 with offset. When the schema
 * moves to a real backend, the wire format may differ (likely cents-as-int);
 * the selector layer will absorb that conversion.
 */

export type StoreId = string
/** ISO YYYY-MM-DD */
export type ISODate = string
/** 0..23 */
export type Hour = number

// ── Dimensions ─────────────────────────────────────────────────────────────

export type Store = {
  id: StoreId
  name: string
  /** Inferred from the name today; useful for grouping later. */
  brand?: string
  preferred?: boolean
  /** IANA tz, reserved for future. */
  timezone?: string
}

// ── Core hourly fact ───────────────────────────────────────────────────────

/** One row per (store, date, hour). Foundation for sales tiles, hourly chart,
 *  and the leaderboard. */
export type SalesHourFact = {
  storeId: StoreId
  date: ISODate
  hour: Hour
  netSales: number
  grossSales: number
  discounts: number
  payments: number
  cash: number
  voids: number
  serviceCharges: number
  checks: number
}

// ── Daily facts that don't make sense hourly ───────────────────────────────

export type LaborDayFact = {
  storeId: StoreId
  date: ISODate
  laborHours: number
  laborCost: number
  employeeTips: number
  /** Peak concurrent clocked-in employees during the day. */
  clockedInPeak: number
  openShifts: number
}

/** Per-store daily rollup of a categorical breakdown.
 *  category encodes which subsystem (payment method, tax, discount, service
 *  charge); `item` is the human-readable label rendered on the screen. */
export type CategoryDayFact = {
  storeId: StoreId
  date: ISODate
  category: 'payment_method' | 'tax' | 'discount' | 'service_charge'
  item: string
  amount: number
  count: number
}

/** Operational state captured once per store-day. Powers the StoreView
 *  Network and Kitchen tabs. */
export type StoreOpsFact = {
  storeId: StoreId
  date: ISODate
  /** 0..1, or null when offline / unknown. */
  onlineFraction: number | null
  onlineDevices: { up: number; total: number }
  /** Avg time from order placed to served, in seconds. Null when no orders. */
  avgOrderSeconds: number | null
  orders: number
}

// ── Event tables (sparse) ──────────────────────────────────────────────────

export type TillEvent = {
  id: string
  storeId: StoreId
  employeeName: string
  claimedAt: string
  closedAt: string | null
  reconciledAt: string | null
  expectedCash: number
  status: 'open' | 'closed' | 'reconciled'
}

export type Check = {
  id: string
  storeId: StoreId
  employeeName: string
  occurredAt: string
  channelLeft: string
  channelRight: string
  netSales: number
  discounts: number
  refunds: number
  voids: number
  removedItems: number | null
  returnedItems: number
}

// ── Fixture envelope ───────────────────────────────────────────────────────

export type Fixture = {
  /** When the generator was run. Useful for debugging stale data. */
  generatedAt: string
  /** Date the fixture is centered on — the "today" used to anchor windows. */
  anchorDate: ISODate
  stores: Store[]
  salesHourly: SalesHourFact[]
  laborDaily: LaborDayFact[]
  categoryDaily: CategoryDayFact[]
  storeOps: StoreOpsFact[]
  tills: TillEvent[]
  checks: Check[]
}
