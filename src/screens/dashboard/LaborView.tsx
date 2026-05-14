import { useEffect, useState } from 'react'
import { MetricTile, MetricTileGrid } from '@david-richard/notify-ds'
import {
  defaultCompareFor,
  resolveCompare,
  resolvePrimary,
  type DateFilter,
} from '../../lib/dateFilter'
import {
  getLaborTiles,
  getSalesTiles,
  trendPct,
  type LaborTiles,
  type SalesTiles,
} from '../../lib/data/selectors'

type Props = {
  selectedStoreIds: Set<string>
  dateFilter: DateFilter
  today: Date
}

const fmtMoney = (n: number) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
const fmtNumber2 = (n: number) =>
  n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
const fmtInt = (n: number) => Math.round(n).toLocaleString('en-US')

/** Net Sales per Labor Hour — guarded against zero hours. */
function netPerHour(net: number, hours: number): number {
  return hours > 0 ? net / hours : 0
}

export function LaborView({ selectedStoreIds, dateFilter, today }: Props) {
  const [labor, setLabor] = useState<LaborTiles | null>(null)
  const [sales, setSales] = useState<SalesTiles | null>(null)

  useEffect(() => {
    const primary = resolvePrimary(dateFilter, today)
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
      getLaborTiles(primary, { storeIds: selectedStoreIds, priorRange: prior }),
      getSalesTiles(primary, { storeIds: selectedStoreIds, priorRange: prior }),
    ]).then(([l, s]) => {
      if (cancelled) return
      setLabor(l)
      setSales(s)
    })
    return () => {
      cancelled = true
    }
  }, [dateFilter, today, selectedStoreIds])

  const loading = labor === null || sales === null

  // Derive the productivity ratio tile from both selectors. Prior is paired
  // so the trend % is meaningful even when one denominator was zero.
  const ratioCurrent =
    labor && sales ? netPerHour(sales.netSales.value, labor.laborHours.value) : 0
  const ratioPrior =
    labor && sales && labor.laborHours.prior !== null && sales.netSales.prior !== null
      ? netPerHour(sales.netSales.prior, labor.laborHours.prior)
      : null

  return (
    <MetricTileGrid cols={2}>
      <MetricTile
        label="Labor Hours"
        value={loading ? '' : fmtNumber2(labor!.laborHours.value)}
        trend={loading ? undefined : trendPct(labor!.laborHours.value, labor!.laborHours.prior) ?? undefined}
        trendLabel={
          loading || labor!.laborHours.prior === null
            ? undefined
            : fmtNumber2(labor!.laborHours.prior)
        }
        loading={loading}
      />
      <MetricTile
        label="Net Sales/Labor Hrs"
        value={loading ? '' : fmtMoney(ratioCurrent)}
        trend={loading ? undefined : trendPct(ratioCurrent, ratioPrior) ?? undefined}
        trendLabel={
          loading || ratioPrior === null ? undefined : fmtMoney(ratioPrior)
        }
        loading={loading}
      />
      <MetricTile
        label="Employee Tips"
        value={loading ? '' : fmtMoney(labor!.employeeTips.value)}
        trend={loading ? undefined : trendPct(labor!.employeeTips.value, labor!.employeeTips.prior) ?? undefined}
        trendLabel={
          loading || labor!.employeeTips.prior === null
            ? undefined
            : fmtMoney(labor!.employeeTips.prior)
        }
        loading={loading}
      />
      <MetricTile
        label="Clocked In #"
        value={loading ? '' : fmtInt(labor!.clockedInPeak.value)}
        trend={loading ? undefined : trendPct(labor!.clockedInPeak.value, labor!.clockedInPeak.prior) ?? undefined}
        trendLabel={
          loading || labor!.clockedInPeak.prior === null
            ? undefined
            : fmtInt(labor!.clockedInPeak.prior)
        }
        loading={loading}
      />
      <MetricTile
        label="Open Shifts"
        value={loading ? '' : fmtInt(labor!.openShifts.value)}
        trend={loading ? undefined : trendPct(labor!.openShifts.value, labor!.openShifts.prior) ?? undefined}
        trendLabel={
          loading || labor!.openShifts.prior === null
            ? undefined
            : fmtInt(labor!.openShifts.prior)
        }
        loading={loading}
      />
    </MetricTileGrid>
  )
}
