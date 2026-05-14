import { useEffect, useMemo, useState } from 'react'
import { Switcher } from '@david-richard/notify-ds'
import { ContextBar } from '../components/ContextBar'
import { DataTable, type DataTableColumn } from '../components/DataTable'
import { MenuTargetPage } from '../components/MenuTargetPage'
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from '../icons'
import {
  addDays,
  resolvePrimary,
  type DateFilter,
} from '../lib/dateFilter'
import {
  getStoreLeaderboard,
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

function formatMoney(n: number): string {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
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

  // Primary range = whatever the user selected in the global date pill.
  // Prior range = same shape shifted back by one day so we can show
  // "rank vs yesterday" movement regardless of mode (Day/Week/Month).
  // When the shift collapses the range, fall back to no prior.
  const { primaryRange, priorRange } = useMemo(() => {
    const primary = resolvePrimary(dateFilter, today)
    const priorEnd = addDays(primary.end, -1)
    const prior =
      priorEnd.getTime() >= primary.start.getTime()
        ? { start: primary.start, end: priorEnd }
        : null
    return { primaryRange: primary, priorRange: prior }
  }, [dateFilter, today])

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

  const columns: DataTableColumn<LeaderboardRow>[] = [
    {
      key: 'rank',
      header: '#',
      width: '32px',
      render: (r) => (
        <span style={{ fontVariantNumeric: 'tabular-nums', color: '#6B7280' }}>
          {r.rank}
        </span>
      ),
    },
    { key: 'storeName', header: 'Store', render: (r) => r.storeName },
    {
      key: 'value',
      header: METRIC_LABELS[metric],
      align: 'right',
      render: (r) => (
        <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
          {formatMoney(r.value)}
        </span>
      ),
    },
    {
      key: 'delta',
      header: 'Δ',
      align: 'right',
      width: '64px',
      render: (r) => <RankDelta delta={r.rankDelta} />,
    },
  ]

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

function RankDelta({ delta }: { delta: number | null }) {
  if (delta === null) {
    return <span style={{ color: '#9CA3AF' }}>—</span>
  }
  if (delta === 0) {
    return (
      <span style={{ color: '#9CA3AF', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
        <MinusIcon size={14} />
      </span>
    )
  }
  const up = delta > 0
  const color = up ? '#16A34A' : '#DC2626'
  return (
    <span style={{ color, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {up ? <ArrowUpIcon size={14} /> : <ArrowDownIcon size={14} />}
      <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
        {Math.abs(delta)}
      </span>
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
