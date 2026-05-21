import { useMemo } from 'react'
import { TabBar } from '@david-richard/notify-ds'
import { DataTable, type DataTableColumn } from '../../components/DataTable'
import { STORES, type Store } from '../../lib/stores'
import type { DateFilter } from '../../lib/dateFilter'

const SUB_TABS = ['Productivity', 'Network', 'Kitchen']

type StoreRow = {
  id: string
  name: string
  netSales: string
  laborPct: string
  online: number
  onlineFraction: string
  avgTime: string
  orders: number
}

/** FNV-1a-ish 32-bit hash. Enough entropy for deterministic prototype seeds. */
function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Mulberry32 PRNG — repeatable, well-distributed from a 32-bit seed. */
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function formatMoney(n: number): string {
  return `$${n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

function buildRow(store: Store, periodKey: string): StoreRow {
  const r = rng(hash(`${store.id}|${periodKey}`))
  const netSales = r() * 4800 + 200
  const labor = r() * 27 + 8
  const totalRegisters = Math.floor(r() * 8) + 6
  const downRegisters = r() < 0.55 ? 0 : Math.floor(r() * 2) + 1
  const onlineRegisters = Math.max(1, totalRegisters - downRegisters)
  const online = onlineRegisters / totalRegisters
  const avgSecs = Math.floor(r() * 240) + 25
  const m = Math.floor(avgSecs / 60)
  const s = avgSecs - m * 60
  return {
    id: store.id,
    name: store.name,
    netSales: formatMoney(netSales),
    laborPct: `${labor.toFixed(1)}%`,
    online,
    onlineFraction: `${Math.round(online * 100)}% (${onlineRegisters}/${totalRegisters})`,
    avgTime: `00:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
    orders: Math.floor(r() * 220),
  }
}

type SubTab = 'Productivity' | 'Network' | 'Kitchen'

type Props = {
  /** Controlled L2 tab — App.tsx owns this for persistence + Saved Views. */
  subTab?: SubTab
  onSubTabChange?: (next: SubTab) => void
  selectedStoreIds: Set<string>
  dateFilter: DateFilter
  onRowClick?: (row: StoreRow) => void
}

export function StoreView({
  subTab = 'Productivity',
  onSubTabChange,
  selectedStoreIds,
  dateFilter,
  onRowClick,
}: Props) {
  const setSubTab = (next: string) => onSubTabChange?.(next as SubTab)

  // Rows are derived from the real STORES fixture, filtered to the user's
  // current selection. Values are deterministic per (store, period) so the
  // same view reloads identically and switching dates feels like fresh data.
  const rows = useMemo(() => {
    const periodKey = `${dateFilter.mode}|${dateFilter.period}|${dateFilter.customDate ?? ''}`
    return STORES.filter((s) => selectedStoreIds.has(s.id)).map((s) =>
      buildRow(s, periodKey),
    )
  }, [selectedStoreIds, dateFilter])

  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <TabBar tabs={SUB_TABS} value={subTab} onValueChange={setSubTab} stretch />
      </div>

      {subTab === 'Productivity' && (
        <ProductivityView rows={rows} onRowClick={onRowClick} />
      )}
      {subTab === 'Network' && <NetworkView rows={rows} onRowClick={onRowClick} />}
      {subTab === 'Kitchen' && <KitchenView rows={rows} onRowClick={onRowClick} />}
    </>
  )
}

function RightLink({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        textAlign: 'right',
        margin: '0 0 8px',
        fontFamily: "'Inter', sans-serif",
        fontSize: 14,
        fontWeight: 500,
        color: 'var(--color-interactive-secondary,#339FB8)',
      }}
    >
      {children}
    </div>
  )
}

function StoreNameCell({ name }: { name: string }) {
  return <span style={{ fontWeight: 500 }}>{name}</span>
}

function ValueWithChevron({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      {children}
      <span aria-hidden style={{ color: '#6B7280' }}>
        ›
      </span>
    </span>
  )
}

type ViewProps = { rows: StoreRow[]; onRowClick?: (row: StoreRow) => void }

function ProductivityView({ rows, onRowClick }: ViewProps) {
  const columns: DataTableColumn<StoreRow>[] = [
    {
      key: 'name',
      header: 'Store',
      render: (row) => <StoreNameCell name={row.name} />,
    },
    {
      key: 'netSales',
      header: 'Net Sales',
      align: 'right',
      sortDirection: 'asc',
      render: (row) => <ValueWithChevron>{row.netSales}</ValueWithChevron>,
    },
    {
      key: 'laborPct',
      header: 'Labor / Net',
      align: 'right',
      render: (row) => <ValueWithChevron>{row.laborPct}</ValueWithChevron>,
    },
  ]
  return (
    <>
      <RightLink>≡ Customize</RightLink>
      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(r) => r.id}
        onRowClick={onRowClick}
      />
    </>
  )
}

function NetworkView({ rows, onRowClick }: ViewProps) {
  const columns: DataTableColumn<StoreRow>[] = [
    {
      key: 'name',
      header: 'Store',
      render: (row) => <StoreNameCell name={row.name} />,
    },
    {
      key: 'onlineFraction',
      header: 'Online',
      align: 'right',
      render: (row) => {
        const allOnline = row.online >= 1
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span
              aria-hidden
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: allOnline ? 'var(--color-success,#16A34A)' : 'var(--color-destructive,#EF2149)',
              }}
            />
            <span>{row.onlineFraction}</span>
            <span aria-hidden style={{ color: '#6B7280' }}>
              ›
            </span>
          </span>
        )
      },
    },
  ]
  return (
    <DataTable
      columns={columns}
      rows={rows}
      getRowKey={(r) => r.id}
      onRowClick={onRowClick}
    />
  )
}

function KitchenView({ rows, onRowClick }: ViewProps) {
  const columns: DataTableColumn<StoreRow>[] = [
    {
      key: 'name',
      header: 'Store',
      sortDirection: 'desc',
      render: (row) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontWeight: 500 }}>{row.name}</span>
          <span aria-hidden style={{ color: '#6B7280' }}>
            ›
          </span>
        </span>
      ),
    },
    {
      key: 'avgTime',
      header: 'Avg Time',
      align: 'right',
      render: (row) => <span>{row.avgTime}</span>,
    },
    {
      key: 'orders',
      header: 'Orders',
      align: 'right',
      render: (row) => <span>{row.orders}</span>,
    },
  ]
  return (
    <>
      <RightLink>Fulfilment</RightLink>
      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(r) => r.id}
        onRowClick={onRowClick}
      />
    </>
  )
}
