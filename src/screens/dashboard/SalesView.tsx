import { useEffect, useState } from 'react'
import { MetricTile, MetricTileGrid, StatusTile } from '@david-richard/notify-ds'
import type { DashboardTile } from '../Dashboard'
import {
  defaultCompareFor,
  resolveCompare,
  resolvePrimary,
  toIsoDateString,
  type DateFilter,
} from '../../lib/dateFilter'
import {
  getSalesTiles,
  listTills,
  trendPct,
  type SalesTiles,
} from '../../lib/data/selectors'

type Props = {
  onTileClick?: (tile: DashboardTile) => void
  selectedStoreIds: Set<string>
  dateFilter: DateFilter
  today: Date
}

type TillCounts = { open: number; closed: number; reconciled: number }

const fmtMoney = (n: number) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
// Cents-precision for per-unit / smaller-magnitude tiles (matches prod).
const fmtMoneyPrecise = (n: number) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
const fmtInt = (n: number) => Math.round(n).toLocaleString('en-US')

type TileKey = keyof SalesTiles
type TileDef = {
  label: DashboardTile
  key: TileKey
  format: (n: number) => string
}

// Order matches the PM-walkthrough Sales frame. Tills occupies grid cell 8
// (between Cash and Voids) and is rendered out-of-band.
const TILE_DEFS_TOP: TileDef[] = [
  { label: 'Net Sales',     key: 'netSales',     format: fmtMoney },
  { label: 'Checks',        key: 'checks',       format: fmtInt   },
  { label: 'Payments',      key: 'payments',     format: fmtMoney },
  { label: 'Average Check', key: 'averageCheck', format: fmtMoneyPrecise },
  { label: 'Gross Sales',   key: 'grossSales',   format: fmtMoney },
  { label: 'Discounts',     key: 'discounts',    format: fmtMoney },
  { label: 'Cash',          key: 'cash',         format: fmtMoney },
]
const TILE_DEFS_BOTTOM: TileDef[] = [
  { label: 'Voids',           key: 'voids',          format: fmtMoneyPrecise },
  { label: 'Service Charges', key: 'serviceCharges', format: fmtMoneyPrecise },
]

export function SalesView({ onTileClick, selectedStoreIds, dateFilter, today }: Props) {
  const [tiles, setTiles] = useState<SalesTiles | null>(null)
  const [tillCounts, setTillCounts] = useState<TillCounts | null>(null)

  useEffect(() => {
    const primary = resolvePrimary(dateFilter, today)
    // Show trends regardless of the user's Compare toggle — the dashboard
    // always renders a delta. When Compare is off, fall back to the natural
    // prior for the current mode (prev-day / prev-week / prev-month).
    const compareId = dateFilter.compareOn
      ? dateFilter.compare
      : defaultCompareFor(dateFilter.mode)
    const prior =
      resolveCompare(
        { ...dateFilter, compareOn: true, compare: compareId },
        primary,
      ) ?? undefined

    let cancelled = false
    Promise.all([
      getSalesTiles(primary, { storeIds: selectedStoreIds, priorRange: prior }),
      listTills({
        storeIds: selectedStoreIds,
        from: `${toIsoDateString(primary.start)}T00:00:00Z`,
        to: `${toIsoDateString(primary.end)}T23:59:59Z`,
      }),
    ]).then(([t, tills]) => {
      if (cancelled) return
      setTiles(t)
      const counts: TillCounts = { open: 0, closed: 0, reconciled: 0 }
      for (const x of tills) counts[x.status]++
      setTillCounts(counts)
    })
    return () => {
      cancelled = true
    }
  }, [dateFilter, today, selectedStoreIds])

  const loading = tiles === null

  const renderTile = (def: TileDef) => {
    const pair = tiles?.[def.key]
    const value = pair ? def.format(pair.value) : ''
    const trend = pair ? trendPct(pair.value, pair.prior) ?? undefined : undefined
    const trendLabel =
      pair && pair.prior !== null ? def.format(pair.prior) : undefined
    return (
      <MetricTile
        key={def.label}
        label={def.label}
        value={loading ? '' : value}
        trend={loading ? undefined : trend}
        trendLabel={loading ? undefined : trendLabel}
        loading={loading}
        onClick={() => onTileClick?.(def.label)}
      />
    )
  }

  return (
    <MetricTileGrid cols={2}>
      {TILE_DEFS_TOP.map(renderTile)}
      <StatusTile
        label="Tills"
        items={
          tillCounts
            ? [
                { label: 'Open', value: tillCounts.open },
                { label: 'Closed', value: tillCounts.closed },
                { label: 'Reconciled', value: tillCounts.reconciled },
              ]
            : []
        }
        loading={loading || !tillCounts}
        onClick={() => onTileClick?.('Tills')}
      />
      {TILE_DEFS_BOTTOM.map(renderTile)}
    </MetricTileGrid>
  )
}
