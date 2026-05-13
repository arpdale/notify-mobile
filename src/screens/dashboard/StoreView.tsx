import { useState } from 'react'
import { TabBar } from '@david-richard/notify-ds'
import { DataTable, type DataTableColumn } from '../../components/DataTable'

const SUB_TABS = ['Productivity', 'Network', 'Kitchen']

type StoreRow = {
  id: string
  name: string
  netSales: string
  laborPct: string
  /** 0..1 — null when offline */
  online: number | null
  /** N out of M registers online */
  onlineFraction: string
  avgTime: string
  orders: number
}

const DEMO_ROWS: StoreRow[] = [
  {
    id: 'r1',
    name: 'Anit Store Bethesda Lab',
    netSales: '$1,595.80',
    laborPct: '$0.00',
    online: 0.88,
    onlineFraction: '88% (7/8)',
    avgTime: '00:00:00',
    orders: 0,
  },
  {
    id: 'r2',
    name: "Nataliia's Bakery",
    netSales: '$144.00',
    laborPct: '$0.00',
    online: 0.91,
    onlineFraction: '91% (10/11)',
    avgTime: '00:00:00',
    orders: 0,
  },
  {
    id: 'r3',
    name: 'MWO PLEASE DO NOT TOUCH',
    netSales: '$50.00',
    laborPct: '$0.00',
    online: 0.91,
    onlineFraction: '91% (10/11)',
    avgTime: '00:02:29',
    orders: 16,
  },
  {
    id: 'r4',
    name: 'Fede Store',
    netSales: '$12.00',
    laborPct: '$0.00',
    online: 0.93,
    onlineFraction: '93% (10/11)',
    avgTime: '00:00:58',
    orders: 167,
  },
  {
    id: 'r5',
    name: 'Emi Store',
    netSales: '$5.15',
    laborPct: '$0.00',
    online: 1,
    onlineFraction: '100% (15/15)',
    avgTime: '00:01:49',
    orders: 164,
  },
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: `bug-${i + 1}`,
    name: 'Store for Bug 1021',
    netSales: '$0.00',
    laborPct: '$0.00',
    online: 1,
    onlineFraction: i === 0 ? '100% (2/2)' : '100% (11/11)',
    avgTime: i < 2 ? '00:01:11' : '00:00:00',
    orders: [175, 148, 0, 0, 0][i] ?? 0,
  })),
]

type Props = {
  initialSubTab?: 'Productivity' | 'Network' | 'Kitchen'
  onRowClick?: (row: StoreRow) => void
}

export function StoreView({ initialSubTab = 'Productivity', onRowClick }: Props) {
  const [subTab, setSubTab] = useState<string>(initialSubTab)

  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <TabBar tabs={SUB_TABS} value={subTab} onValueChange={setSubTab} stretch />
      </div>

      {subTab === 'Productivity' && <ProductivityView onRowClick={onRowClick} />}
      {subTab === 'Network' && <NetworkView onRowClick={onRowClick} />}
      {subTab === 'Kitchen' && <KitchenView onRowClick={onRowClick} />}
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
        color: '#339FB8',
      }}
    >
      {children}
    </div>
  )
}

function StoreNameCell({ name }: { name: string }) {
  return (
    <span style={{ fontWeight: 500 }}>
      {name}
    </span>
  )
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

function ProductivityView({ onRowClick }: { onRowClick?: (r: StoreRow) => void }) {
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
      header: 'Labor / Ne…',
      align: 'right',
      render: (row) => <ValueWithChevron>{row.laborPct}</ValueWithChevron>,
    },
  ]
  return (
    <>
      <RightLink>≡ Customize</RightLink>
      <DataTable
        columns={columns}
        rows={DEMO_ROWS}
        getRowKey={(r) => r.id}
        onRowClick={onRowClick}
      />
    </>
  )
}

function NetworkView({ onRowClick }: { onRowClick?: (r: StoreRow) => void }) {
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
        const allOnline = row.online !== null && row.online >= 1
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span
              aria-hidden
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: allOnline ? '#16A34A' : '#EF2149',
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
      rows={DEMO_ROWS}
      getRowKey={(r) => r.id}
      onRowClick={onRowClick}
    />
  )
}

function KitchenView({ onRowClick }: { onRowClick?: (r: StoreRow) => void }) {
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
        rows={DEMO_ROWS}
        getRowKey={(r) => r.id}
        onRowClick={onRowClick}
      />
    </>
  )
}
