import { useEffect, useMemo, useState } from 'react'
import { Switcher } from '@david-richard/notify-ds'
import { ContextBar } from '../components/ContextBar'
import { DataTable, type DataTableColumn } from '../components/DataTable'
import { MenuTargetPage } from '../components/MenuTargetPage'
import {
  addDays,
  resolveCompare,
  resolvePrimary,
  type DateFilter,
} from '../lib/dateFilter'
import {
  getStoreLeaderboard,
  trendPct,
  type LeaderboardMetric,
  type LeaderboardRow,
} from '../lib/data/selectors'

type Props = {
  onDashboard: () => void
  onInventory: () => void
  onMenu: () => void
  selectedStoreIds: Set<string>
  dateFilter: DateFilter
  today: Date
  storeLabel: string
  dateLabel: string
  onPickStores: () => void
  onPickDate: () => void
}

const METRIC_LABELS: Record<LeaderboardMetric, string> = {
  netSales: 'Net Sales',
  grossSales: 'Gross Sales',
  averageCheck: 'Avg Check',
}
const METRIC_SEGMENTS = Object.values(METRIC_LABELS)
const LABEL_TO_METRIC: Record<string, LeaderboardMetric> = {
  'Net Sales': 'netSales',
  'Gross Sales': 'grossSales',
  'Avg Check': 'averageCheck',
}

/** Compact dollars — keeps cells narrow enough that we can fit a 6-column
 *  compare table on a phone width without the store-name column collapsing
 *  to nothing. Drops cents at four figures, switches to thousands at five+. */
function fmtCompactMoney(n: number): string {
  if (n >= 100000) return `$${Math.round(n / 1000).toLocaleString('en-US')}k`
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`
  return `$${n.toFixed(2)}`
}

/** Format the trend-% number for the delta column. Returns null when there's
 *  no meaningful comparison (no prior, or prior was zero). */
function fmtPct(n: number | null): string {
  if (n === null) return '—'
  const sign = n > 0 ? '+' : ''
  return `${sign}${n.toFixed(1)}%`
}

export function Leaderboards({
  onDashboard,
  onInventory,
  onMenu,
  selectedStoreIds,
  dateFilter,
  today,
  storeLabel,
  dateLabel,
  onPickStores,
  onPickDate,
}: Props) {
  const [metric, setMetric] = useState<LeaderboardMetric>('netSales')
  const [rows, setRows] = useState<LeaderboardRow[]>([])

  // Two prior-range strategies depending on whether the user has Compare on.
  //
  //  - Compare ON  → prior comes from resolveCompare() against the user's
  //                  chosen compare option (Previous Week, Same Day Last
  //                  Year, etc.). The UI gains Prior / Now / Δ% columns.
  //  - Compare OFF → prior is the same range shifted back one day, so we
  //                  can still render a rank-movement arrow. No prior-value
  //                  column shown.
  const compareOn = dateFilter.compareOn && Boolean(dateFilter.compare)
  const { primaryRange, priorRange } = useMemo(() => {
    const primary = resolvePrimary(dateFilter, today)
    if (compareOn) {
      return { primaryRange: primary, priorRange: resolveCompare(dateFilter, primary) }
    }
    const priorEnd = addDays(primary.end, -1)
    const prior =
      priorEnd.getTime() >= primary.start.getTime()
        ? { start: primary.start, end: priorEnd }
        : null
    return { primaryRange: primary, priorRange: prior }
  }, [dateFilter, today, compareOn])

  useEffect(() => {
    let cancelled = false
    getStoreLeaderboard(metric, primaryRange, {
      storeIds: selectedStoreIds,
      priorRange: priorRange ?? undefined,
    }).then((r) => {
      if (!cancelled) setRows(r)
    })
    return () => {
      cancelled = true
    }
  }, [metric, primaryRange, priorRange, selectedStoreIds])

  const columns = compareOn
    ? buildCompareColumns()
    : buildSimpleColumns(metric)

  return (
    <MenuTargetPage
      title="Leaderboards"
      contextBar={
        <ContextBar
          storeLabel={storeLabel}
          dateLabel={dateLabel}
          onStoreClick={onPickStores}
          onDateClick={onPickDate}
        />
      }
      onDashboard={onDashboard}
      onInventory={onInventory}
      onMenu={onMenu}
    >
      <div style={{ marginBottom: 16 }}>
        <Switcher
          segments={METRIC_SEGMENTS}
          value={METRIC_LABELS[metric]}
          onValueChange={(v) => setMetric(LABEL_TO_METRIC[v] ?? 'netSales')}
          stretch
        />
      </div>
      {rows.length === 0 ? (
        <EmptyMessage />
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          getRowKey={(r) => r.storeId}
        />
      )}
    </MenuTargetPage>
  )
}

function buildSimpleColumns(metric: LeaderboardMetric): DataTableColumn<LeaderboardRow>[] {
  return [
    {
      key: 'rank',
      header: '#',
      width: '24px',
      render: (r) => (
        <span style={{ fontVariantNumeric: 'tabular-nums', color: '#6B7280' }}>
          {r.rank}
        </span>
      ),
    },
    {
      key: 'storeName',
      header: 'Store',
      ellipsize: true,
      render: (r) => r.storeName,
    },
    {
      key: 'value',
      header: METRIC_LABELS[metric],
      align: 'right',
      render: (r) => (
        <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
          {fmtCompactMoney(r.value)}
        </span>
      ),
    },
  ]
}

function buildCompareColumns(): DataTableColumn<LeaderboardRow>[] {
  return [
    {
      key: 'rank',
      header: '#',
      width: '20px',
      render: (r) => (
        <span style={{ fontVariantNumeric: 'tabular-nums', color: '#6B7280' }}>
          {r.rank}
        </span>
      ),
    },
    {
      key: 'storeName',
      header: 'Store',
      ellipsize: true,
      render: (r) => r.storeName,
    },
    {
      key: 'priorValue',
      header: 'Prior',
      align: 'right',
      render: (r) => (
        <span style={{ fontVariantNumeric: 'tabular-nums', color: '#6B7280' }}>
          {r.priorValue === null ? '—' : fmtCompactMoney(r.priorValue)}
        </span>
      ),
    },
    {
      key: 'value',
      header: 'Now',
      align: 'right',
      render: (r) => (
        <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
          {fmtCompactMoney(r.value)}
        </span>
      ),
    },
    {
      key: 'pctDelta',
      header: 'Δ%',
      align: 'right',
      render: (r) => <PctDelta value={r.value} prior={r.priorValue} />,
    },
  ]
}

function PctDelta({ value, prior }: { value: number; prior: number | null }) {
  const pct = trendPct(value, prior)
  if (pct === null) return <span style={{ color: '#9CA3AF' }}>—</span>
  const color = pct > 0 ? '#16A34A' : pct < 0 ? '#DC2626' : '#6B7280'
  return (
    <span style={{ color, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
      {fmtPct(pct)}
    </span>
  )
}

function EmptyMessage() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#9CA3AF',
        fontFamily: "'Inter', sans-serif",
        fontSize: 14,
      }}
    >
      No data for the selected range.
    </div>
  )
}
