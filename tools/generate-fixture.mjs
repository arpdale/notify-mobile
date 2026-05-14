#!/usr/bin/env node
/**
 * Generates src/lib/data/fixture.json — the deterministic seed data that
 * every screen reads from.
 *
 * Run:  node tools/generate-fixture.mjs
 *
 * Determinism: every random draw goes through a single seeded mulberry32
 * stream. Same seed → byte-identical output. Bump SEED only when you want
 * the canonical fixture to change.
 *
 * Tunables: anchor date, window length, store list, and the shape of the
 * hourly curve all live near the top.
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// ── Config ────────────────────────────────────────────────────────────────

const SEED = 0xc0ffee
/** "Today" the fixture is anchored on. Screens that use system today will
 *  match this if local clock agrees. */
const ANCHOR = '2026-05-14'
/** How many days of history to emit, ending on ANCHOR inclusive. */
const WINDOW_DAYS = 120
/** Narrower window for the categorical rollups (Payments/Taxes/Discounts).
 *  These screens are usually viewed for recent ranges; older history just
 *  bloats the fixture. Out-of-window queries return empty slices. */
const CATEGORY_WINDOW_DAYS = 60

// Sizes are intentionally clustered so adjacent stores swap ranks under
// daily noise (±25%) and slow drift. Spread-out sizes produce a frozen
// leaderboard — the whole point of the feature is rank motion.
const STORES = [
  { id: 'smashburger-corp', name: 'Smashburger Corporate Lab',      brand: 'Smashburger', size: 1.85, drift:  0.005 },
  { id: 'smashburger-qu',   name: 'Smashburger Qu HQ',              brand: 'Smashburger', size: 1.80, drift: -0.004 },
  { id: 'great-mall',       name: 'Milksha - Great Mall CA',        brand: 'Milksha',     size: 1.20, drift:  0.004 },
  { id: 'westwood',         name: 'Milksha - Westwood CA',          brand: 'Milksha',     size: 1.15, drift: -0.002 },
  { id: 'ontario-mills',    name: 'Milksha - Ontario Mills, CA',    brand: 'Milksha',     size: 1.10, drift:  0.001 },
  { id: 'qu-hq',            name: 'Milksha Qu HQ',                  brand: 'Milksha',     size: 0.70, drift: -0.003 },
  { id: 'admin-team',       name: 'Milksha - Admin Team',           brand: 'Milksha',     size: 0.65, drift:  0.002 },
  { id: 'west-covina',      name: 'Milksha HQ Lab (West Covina)',   brand: 'Milksha',     size: 0.55, drift:  0.003 },
  { id: 'denver-lab',       name: 'Milksha - Denver Lab',           brand: 'Milksha',     size: 0.50, drift: -0.001 },
  { id: 'qu-hq-dev',        name: 'Milksha - QU HQ Dev Lab Test',   brand: 'Milksha',     size: 0.45, drift:  0.000 },
]

// Restaurant-shaped hourly curve. Index = hour 0..23. Sums to ~10.
// Zero overnight, breakfast bump, lunch peak, afternoon dip, dinner peak.
const HOUR_CURVE = [
  0.00, 0.00, 0.00, 0.00, 0.00, 0.02,
  0.08, 0.20, 0.40, 0.55, 0.70, 1.20,
  1.40, 1.10, 0.70, 0.55, 0.65, 1.00,
  1.20, 0.90, 0.55, 0.30, 0.10, 0.00,
]

const PAYMENT_METHODS = [
  { item: 'Credit',         share: 0.62 },
  { item: 'Cash2',          share: 0.10 },
  { item: 'EZCater',        share: 0.12 },
  { item: 'UberEats',       share: 0.08 },
  { item: 'Doordash',       share: 0.06 },
  { item: 'Offline Credit', share: 0.02 },
]

const TAX_TYPES = [
  { item: 'Anit Tax',     rate: 0.085, share: 0.70 },
  { item: 'DT Miami Tax', rate: 0.070, share: 0.20 },
  { item: 'DT Burger Tax',rate: 0.065, share: 0.10 },
]

const DISCOUNT_TYPES = [
  { item: 'Anit Auto %',         share: 0.45 },
  { item: 'Anit Auto $',         share: 0.30 },
  { item: 'EZC Open $ Discount', share: 0.15 },
  { item: 'EZC Open % Discount', share: 0.07 },
  { item: 'DT 1$ Discount',      share: 0.02 },
  { item: 'DT 50% Discount',     share: 0.01 },
]

const SERVICE_CHARGE_TYPES = [
  { item: 'EZC Open $ Service Charge', share: 1.00 },
]

const EMPLOYEE_POOL = [
  'Castaneda Alexis', 'Gaytan Devan', 'Data Leo', 'Nguyen Phong',
  'Patel Riya', 'Okafor Chidi', 'Lee Sungwoo', 'Hernandez Maya',
  'Brooks Jordan', 'Yamamoto Ren',
]

// ── Seeded RNG ────────────────────────────────────────────────────────────

function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(SEED)
/** Centered jitter in [-amount, +amount]. */
const jitter = (amount) => (rand() * 2 - 1) * amount
/** Uniform int in [lo, hi]. */
const randInt = (lo, hi) => Math.floor(rand() * (hi - lo + 1)) + lo
const round2 = (n) => Math.round(n * 100) / 100

// ── Date helpers ──────────────────────────────────────────────────────────

function parseISO(s) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}
function toISO(d) {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
function addDays(iso, n) {
  const d = parseISO(iso)
  d.setUTCDate(d.getUTCDate() + n)
  return toISO(d)
}
function dowOf(iso) {
  return parseISO(iso).getUTCDay() // 0 = Sun
}

// ── Day-shape multipliers ─────────────────────────────────────────────────

/** Day-of-week multiplier. Fast-casual: weekends busier than weekdays. */
function dowMultiplier(iso) {
  const d = dowOf(iso)
  switch (d) {
    case 0: return 1.10 // Sun
    case 5: return 1.30 // Fri
    case 6: return 1.35 // Sat
    default: return 1.00
  }
}

/** Slow store-specific drift over the window — what makes leaderboard ranks
 *  shift over time. dayIndex is 0..WINDOW_DAYS-1. */
function driftMultiplier(store, dayIndex) {
  return 1 + store.drift * dayIndex
}

// ── Generators ────────────────────────────────────────────────────────────

function* dateRange(startIso, count) {
  for (let i = 0; i < count; i++) yield addDays(startIso, i)
}

function buildSalesHourly() {
  const out = []
  const start = addDays(ANCHOR, -(WINDOW_DAYS - 1))
  let dayIndex = 0
  for (const date of dateRange(start, WINDOW_DAYS)) {
    const dowMult = dowMultiplier(date)
    for (const store of STORES) {
      const drift = driftMultiplier(store, dayIndex)
      // Per-day intensity per store: base × size × dow × drift × noise.
      const intensity = 220 * store.size * dowMult * drift * (1 + jitter(0.15))
      for (let h = 0; h < 24; h++) {
        const slot = HOUR_CURVE[h]
        // Sparse storage: skip the dead overnight hours entirely. Selectors
        // backfill missing (store,date,hour) tuples with zeros so consumers
        // still see a full 24-hour series.
        if (slot === 0) continue
        const noise = 1 + jitter(0.25)
        const net = round2(intensity * slot * noise)
        const discounts = round2(net * (0.02 + rand() * 0.04))
        const gross = round2(net + discounts)
        const cashShare = 0.08 + rand() * 0.06
        const cash = round2(net * cashShare)
        const voids = round2(net * (rand() < 0.1 ? rand() * 0.02 : 0))
        const svc = round2(net * (rand() < 0.3 ? rand() * 0.03 : 0))
        const payments = round2(net + svc - voids)
        const checks = Math.max(1, Math.round(net / (12 + jitter(4))))
        out.push({
          storeId: store.id, date, hour: h,
          netSales: net, grossSales: gross, discounts,
          payments, cash, voids, serviceCharges: svc, checks,
        })
      }
    }
    dayIndex++
  }
  return out
}

function buildLaborDaily(salesHourly) {
  // Index sales by (store,date) for quick daily roll-up.
  const dailyNet = new Map()
  for (const r of salesHourly) {
    const k = `${r.storeId}|${r.date}`
    dailyNet.set(k, (dailyNet.get(k) ?? 0) + r.netSales)
  }
  const out = []
  for (const [k, net] of dailyNet) {
    const [storeId, date] = k.split('|')
    const targetRatio = 0.20 + jitter(0.04) // ~20% labor cost ratio
    const laborCost = round2(net * targetRatio)
    const hourlyRate = 17 + jitter(2)
    const laborHours = round2(laborCost / hourlyRate)
    const tipsRate = 0.01 + rand() * 0.02
    out.push({
      storeId, date,
      laborHours,
      laborCost,
      employeeTips: round2(net * tipsRate),
      clockedInPeak: randInt(3, 8),
      openShifts: rand() < 0.15 ? randInt(1, 2) : 0,
    })
  }
  return out
}

function buildCategoryDaily(salesHourly) {
  // Narrower window than the sales table — older categorical history isn't
  // worth the bytes. Selectors will treat older dates as empty slices.
  const categoryCutoff = addDays(ANCHOR, -(CATEGORY_WINDOW_DAYS - 1))
  const dailyNet = new Map()
  const dailyChecks = new Map()
  const dailyGross = new Map()
  for (const r of salesHourly) {
    if (r.date < categoryCutoff) continue
    const k = `${r.storeId}|${r.date}`
    dailyNet.set(k, (dailyNet.get(k) ?? 0) + r.netSales)
    dailyGross.set(k, (dailyGross.get(k) ?? 0) + r.grossSales)
    dailyChecks.set(k, (dailyChecks.get(k) ?? 0) + r.checks)
  }
  const out = []
  for (const [k, net] of dailyNet) {
    const [storeId, date] = k.split('|')
    const gross = dailyGross.get(k) ?? 0
    const checks = dailyChecks.get(k) ?? 0
    if (net === 0) continue

    // Payment methods — split the day's payments by share with noise.
    for (const pm of PAYMENT_METHODS) {
      const share = pm.share * (1 + jitter(0.20))
      const amt = round2(net * share)
      if (amt <= 0) continue
      out.push({
        storeId, date, category: 'payment_method', item: pm.item,
        amount: amt, count: Math.round(checks * share),
      })
    }

    // Taxes — gross × rate × share.
    for (const tx of TAX_TYPES) {
      const amt = round2(gross * tx.rate * tx.share * (1 + jitter(0.15)))
      if (amt <= 0) continue
      out.push({
        storeId, date, category: 'tax', item: tx.item,
        amount: amt, count: Math.round(checks * tx.share),
      })
    }

    // Discounts — small portion of net, distributed.
    const totalDiscount = net * (0.04 + rand() * 0.03)
    for (const dt of DISCOUNT_TYPES) {
      const amt = round2(totalDiscount * dt.share * (1 + jitter(0.25)))
      if (amt <= 0) continue
      out.push({
        storeId, date, category: 'discount', item: dt.item,
        amount: amt, count: Math.max(1, Math.round(checks * dt.share * 0.3)),
      })
    }

    // Service charges — only kick in some days.
    if (rand() < 0.6) {
      for (const sc of SERVICE_CHARGE_TYPES) {
        const amt = round2(net * 0.012 * sc.share * (1 + jitter(0.3)))
        if (amt <= 0) continue
        out.push({
          storeId, date, category: 'service_charge', item: sc.item,
          amount: amt, count: Math.max(1, Math.round(checks * 0.05)),
        })
      }
    }
  }
  return out
}

function buildStoreOps(salesHourly) {
  const dailyChecks = new Map()
  for (const r of salesHourly) {
    const k = `${r.storeId}|${r.date}`
    dailyChecks.set(k, (dailyChecks.get(k) ?? 0) + r.checks)
  }
  const out = []
  for (const [k, checks] of dailyChecks) {
    const [storeId, date] = k.split('|')
    const totalDevices = randInt(6, 16)
    const offlineToday = rand() < 0.08
    const upDevices = offlineToday
      ? randInt(0, totalDevices - 2)
      : randInt(Math.max(1, totalDevices - 2), totalDevices)
    out.push({
      storeId, date,
      onlineFraction: offlineToday ? null : round2(upDevices / totalDevices),
      onlineDevices: { up: upDevices, total: totalDevices },
      avgOrderSeconds: checks > 0 ? randInt(60, 220) : null,
      orders: checks > 0 ? Math.round(checks * (0.9 + rand() * 0.3)) : 0,
    })
  }
  return out
}

function buildTills() {
  // 1–3 till events per store for the most recent 14 days.
  const out = []
  const tillStart = addDays(ANCHOR, -13)
  let n = 1
  for (const date of dateRange(tillStart, 14)) {
    for (const store of STORES) {
      const count = randInt(1, 3)
      for (let i = 0; i < count; i++) {
        const claimHour = randInt(6, 10)
        const closeHour = randInt(19, 23)
        const claimedAt = `${date}T${String(claimHour).padStart(2, '0')}:${String(randInt(0, 59)).padStart(2, '0')}:00Z`
        const closedAt = `${date}T${String(closeHour).padStart(2, '0')}:${String(randInt(0, 59)).padStart(2, '0')}:00Z`
        const reconciled = rand() < 0.7
        out.push({
          id: `till-${String(n++).padStart(5, '0')}`,
          storeId: store.id,
          employeeName: EMPLOYEE_POOL[randInt(0, EMPLOYEE_POOL.length - 1)],
          claimedAt,
          closedAt,
          reconciledAt: reconciled ? closedAt : null,
          expectedCash: round2(200 + rand() * 600),
          status: reconciled ? 'reconciled' : 'closed',
        })
      }
    }
  }
  return out
}

function buildChecks() {
  // Sparse — a few hundred recent checks across stores. CheckSearch is a
  // search UI, not a feed of every transaction.
  const out = []
  let n = 20000
  const checkStart = addDays(ANCHOR, -6)
  for (const date of dateRange(checkStart, 7)) {
    for (const store of STORES) {
      const count = randInt(2, 5)
      for (let i = 0; i < count; i++) {
        const h = randInt(9, 21)
        const min = randInt(0, 59)
        const occurredAt = `${date}T${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}:00Z`
        const net = round2(5 + rand() * 30)
        const hasRefund = rand() < 0.05
        const hasVoids = rand() < 0.20
        out.push({
          id: String(n++),
          storeId: store.id,
          employeeName: EMPLOYEE_POOL[randInt(0, EMPLOYEE_POOL.length - 1)],
          occurredAt,
          channelLeft: rand() < 0.5 ? 'In Store' : 'Drive Thru',
          channelRight: rand() < 0.5 ? 'In Store' : 'Drive Thru',
          netSales: net,
          discounts: round2(rand() < 0.3 ? rand() * 2 : 0),
          refunds: hasRefund ? round2(rand() * net) : 0,
          voids: hasVoids ? randInt(1, 5) : 0,
          removedItems: rand() < 0.2 ? randInt(1, 3) : null,
          returnedItems: rand() < 0.1 ? randInt(1, 2) : 0,
        })
      }
    }
  }
  return out
}

// ── Emit ──────────────────────────────────────────────────────────────────

const salesHourly = buildSalesHourly()
const laborDaily = buildLaborDaily(salesHourly)
const categoryDaily = buildCategoryDaily(salesHourly)
const storeOps = buildStoreOps(salesHourly)
const tills = buildTills()
const checks = buildChecks()

const fixture = {
  generatedAt: new Date().toISOString(),
  anchorDate: ANCHOR,
  stores: STORES.map(({ size: _s, drift: _d, ...rest }) => ({
    ...rest,
    preferred: ['admin-team','ontario-mills','qu-hq-dev','westwood','west-covina','qu-hq','smashburger-corp','smashburger-qu'].includes(rest.id) || undefined,
  })),
  salesHourly,
  laborDaily,
  categoryDaily,
  storeOps,
  tills,
  checks,
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = resolve(__dirname, '..', 'src', 'lib', 'data', 'fixture.json')
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify(fixture) + '\n', 'utf8')

const sizeKb = (JSON.stringify(fixture).length / 1024).toFixed(1)
console.log(
  `Wrote ${outPath}\n` +
  `  anchor:        ${ANCHOR}\n` +
  `  window:        ${WINDOW_DAYS} days\n` +
  `  stores:        ${STORES.length}\n` +
  `  salesHourly:   ${salesHourly.length}\n` +
  `  laborDaily:    ${laborDaily.length}\n` +
  `  categoryDaily: ${categoryDaily.length}\n` +
  `  storeOps:      ${storeOps.length}\n` +
  `  tills:         ${tills.length}\n` +
  `  checks:        ${checks.length}\n` +
  `  size:          ${sizeKb} KB`,
)
