import { useEffect, useMemo, useState } from 'react'
import { DetailCard, DetailShell } from '../components/DetailShell'
import { CompareLineChart } from '../components/charts/CompareLineChart'
import { CHART_COLORS } from '../components/charts/colors'
import {
  addDays,
  defaultCompareFor,
  resolveCompare,
  resolvePrimary,
  toIsoDateString,
  type DateFilter,
} from '../lib/dateFilter'
import {
  getHourlyComparison,
  trendPct,
  type HourPoint,
} from '../lib/data/selectors'

type HourRow = {
  hour: string
  today: number
  previous: number
  /** % change today vs previous; null when no comparison */
  pct: number | null
}

type Props = {
  onBack: () => void
  onPickStores?: () => void
  onPickDate?: () => void
  storeLabel?: string
  dateLabel?: string
  selectedStoreIds: Set<string>
  dateFilter: DateFilter
  today: Date
}

export function NetSales({
  onBack,
  onPickStores,
  onPickDate,
  storeLabel,
  dateLabel,
  selectedStoreIds,
  dateFilter,
  today,
}: Props) {
  const [rows, setRows] = useState<HourRow[]>([])

  // The chart is fundamentally a "one day, by hour" view. For Day mode we
  // use that day; for Week/Month/Custom we anchor on the last (most recent)
  // day of the user's selected range. The "previous" line uses the user's
  // explicit compare option when Compare is on, and falls back to the
  // mode's natural prior (prev-day / prev-week / prev-month) otherwise so
  // we always draw two lines.
  const { primaryDate, comparisonDate } = useMemo(() => {
    const primary = resolvePrimary(dateFilter, today)
    const compareFilter =
      dateFilter.compareOn && dateFilter.compare
        ? dateFilter
        : {
            ...dateFilter,
            compareOn: true,
            compare: defaultCompareFor(dateFilter.mode),
          }
    const compareRange = resolveCompare(compareFilter, primary)
    return {
      primaryDate: toIsoDateString(primary.end),
      comparisonDate: toIsoDateString(
        compareRange ? compareRange.end : addDays(primary.end, -1),
      ),
    }
  }, [dateFilter, today])

  useEffect(() => {
    let cancelled = false
    getHourlyComparison('netSales', primaryDate, comparisonDate, {
      storeIds: selectedStoreIds,
    }).then((points) => {
      if (!cancelled) setRows(points.map(toHourRow))
    })
    return () => {
      cancelled = true
    }
  }, [primaryDate, comparisonDate, selectedStoreIds])

  return (
    <DetailShell
      title="Net Sales"
      onBack={onBack}
      onPickStores={onPickStores}
      onPickDate={onPickDate}
      storeLabel={storeLabel}
      dateLabel={dateLabel}
    >
      <DetailCard title="Net Sales by hour" onExpand={() => undefined}>
        <Legend />
        <CompareLineChart
          data={rows}
          xKey="hour"
          primaryKey="today"
          comparisonKey="previous"
          primaryLabel="Today"
          comparisonLabel="Previous Day"
        />
      </DetailCard>
      <HourTable rows={rows} />
    </DetailShell>
  )
}

function toHourRow(p: HourPoint): HourRow {
  return {
    hour: HOURS_24[p.hour],
    today: p.primary,
    previous: p.comparison ?? 0,
    pct: trendPct(p.primary, p.comparison),
  }
}

function Legend() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 24,
        marginBottom: 12,
        fontFamily: "'Inter', sans-serif",
        fontSize: 14,
        color: '#000',
      }}
    >
      <LegendItem color={CHART_COLORS.today} label="Today" />
      <LegendItem color={CHART_COLORS.previous} label="Previous Day" />
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span
        aria-hidden
        style={{ width: 10, height: 10, borderRadius: '50%', background: color }}
      />
      {label}
    </span>
  )
}

function HourTable({
  rows,
  highlightIndex,
}: {
  rows: HourRow[]
  highlightIndex?: number
}) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        fontFamily: "'Inter', sans-serif",
        fontSize: 14,
      }}
    >
      <div
        role="row"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1.2fr 0.6fr',
          padding: '14px 16px',
          fontWeight: 700,
          color: '#000',
          borderBottom: '1px solid #EAEAEA',
        }}
      >
        <span>Hour</span>
        <span>Today</span>
        <span>Previous Day</span>
        <span style={{ textAlign: 'right' }}>%</span>
      </div>
      {rows.map((r, i) => {
        const isHighlight = i === highlightIndex
        return (
          <div
            key={r.hour}
            role="row"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr 1.2fr 0.6fr',
              padding: '14px 16px',
              color: isHighlight ? '#000' : '#000',
              background: isHighlight ? CHART_COLORS.today : '#FFFFFF',
              borderTop: i === 0 ? 'none' : '1px solid #EAEAEA',
              alignItems: 'center',
              fontWeight: isHighlight ? 600 : 400,
            }}
          >
            <span>{formatHourRange(r.hour)}</span>
            <span>{formatDollars(r.today)}</span>
            <span>{formatDollars(r.previous)}</span>
            <span style={{ textAlign: 'right' }}>
              {r.pct === null ? '-' : r.pct.toFixed(1)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function formatDollars(n: number) {
  return `$${n.toFixed(2)}`
}

const HOURS_24 = [
  '12 AM',
  '1 AM',
  '2 AM',
  '3 AM',
  '4 AM',
  '5 AM',
  '6 AM',
  '7 AM',
  '8 AM',
  '9 AM',
  '10 AM',
  '11 AM',
  '12 PM',
  '1 PM',
  '2 PM',
  '3 PM',
  '4 PM',
  '5 PM',
  '6 PM',
  '7 PM',
  '8 PM',
  '9 PM',
  '10 PM',
  '11 PM',
]

function formatHourRange(hour: string) {
  const idx = HOURS_24.indexOf(hour)
  if (idx < 0) return hour
  const next = HOURS_24[(idx + 1) % HOURS_24.length]
  return `${hour.toLowerCase()} - ${next.toLowerCase()}`
}
