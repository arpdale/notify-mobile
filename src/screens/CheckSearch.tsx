import { ScreenHeader } from '../components/ScreenHeader'
import {
  ClockIcon,
  FilterIcon,
  PinIcon,
  ShareIcon,
  TicketIcon,
  UserIcon,
} from '../icons'

type Check = {
  id: string
  date: string
  store: string
  employee: string
  ocLeft: string
  ocRight: string
  stats: Array<{ label: string; value: string; emphasis?: boolean }>
}

const DEMO_CHECKS: Check[] = [
  {
    id: '20149',
    date: '04/20/26 • 10:49 am',
    store: "Rosa's Cafe 28",
    employee: 'Castaneda, Alexis',
    ocLeft: 'OC: In Store',
    ocRight: 'OC: Drive Thru',
    stats: [
      { label: 'Net Sales', value: '$11.15', emphasis: true },
      { label: 'Discounts', value: '$0.00', emphasis: true },
      { label: 'Refunds', value: '$0.00', emphasis: true },
      { label: 'Removed Items', value: '-' },
      { label: 'Returned Items', value: '0', emphasis: true },
      { label: 'Voids', value: '4', emphasis: true },
    ],
  },
  {
    id: '10001',
    date: '04/20/26 • 10:49 am',
    store: 'Texas Burger 01',
    employee: 'Gaytan, Devan',
    ocLeft: 'OC: In Store',
    ocRight: 'OC: Drive Thru',
    stats: [
      { label: 'Net Sales', value: '$8.50', emphasis: true },
      { label: 'Discounts', value: '$0.00', emphasis: true },
    ],
  },
]

type Props = {
  onBack: () => void
  onFilters?: () => void
}

export function CheckSearch({ onBack, onFilters }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <ScreenHeader title="Check Search" onBack={onBack} />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          background: 'var(--color-surface-app, #F4F4F4)',
          padding: '12px 16px 24px',
        }}
      >
        <SectionHeader title="Totals" action={
          <button
            type="button"
            onClick={onFilters}
            style={{
              border: 0,
              background: 'transparent',
              padding: 0,
              cursor: 'pointer',
              color: '#339FB8',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <FilterIcon size={16} />
            Filters
          </button>
        } />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <SummaryCard label="Check Count" value="8,013" />
          <SummaryCard label="Net Sales" value="$88,984" />
        </div>

        <SectionHeader title="Checks" action={
          <button
            type="button"
            aria-label="Export"
            style={{
              border: 0,
              background: 'transparent',
              padding: 4,
              cursor: 'pointer',
              color: '#339FB8',
            }}
          >
            <ShareIcon size={18} />
          </button>
        } />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {DEMO_CHECKS.map((c) => (
            <CheckCard key={c.id} check={c} />
          ))}
        </div>
      </div>
    </div>
  )
}

function SectionHeader({
  title,
  action,
}: {
  title: string
  action?: React.ReactNode
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '8px 0 12px',
      }}
    >
      <h2
        style={{
          margin: 0,
          fontFamily: "'Inter', sans-serif",
          fontSize: 18,
          fontWeight: 700,
          color: '#000',
        }}
      >
        {title}
      </h2>
      {action}
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        padding: '14px 16px',
        boxShadow: '0 4px 4px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <span style={{ fontSize: 13, color: '#000' }}>{label}</span>
      <hr
        style={{
          border: 0,
          borderTop: '1px solid #EAEAEA',
          margin: 0,
        }}
      />
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 22,
          fontWeight: 700,
          color: '#000',
        }}
      >
        {value}
      </span>
    </div>
  )
}

function CheckCard({ check }: { check: Check }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        boxShadow: '0 4px 4px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        fontFamily: "'Inter', sans-serif",
        fontSize: 14,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: '#339FB8',
            fontWeight: 600,
            fontSize: 18,
          }}
        >
          <TicketIcon size={20} />
          {check.id}
          <span aria-hidden style={{ marginLeft: 2 }}>
            ›
          </span>
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: '#6B7280',
            fontSize: 13,
          }}
        >
          <ClockIcon size={14} />
          {check.date}
        </div>
      </div>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: '#000',
        }}
      >
        <PinIcon size={16} />
        {check.store}
      </div>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: '#000',
        }}
      >
        <UserIcon size={16} />
        {check.employee}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          fontWeight: 700,
          color: '#000',
        }}
      >
        <span>{check.ocLeft}</span>
        <span>{check.ocRight}</span>
      </div>
      <hr style={{ border: 0, borderTop: '1px solid #EAEAEA', margin: 0 }} />
      <dl
        style={{
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {check.stats.map((s, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <dt style={{ color: s.emphasis ? '#000' : '#6B7280' }}>{s.label}</dt>
            <dd
              style={{
                margin: 0,
                color: s.emphasis ? '#000' : '#6B7280',
                fontWeight: s.emphasis ? 700 : 400,
              }}
            >
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
