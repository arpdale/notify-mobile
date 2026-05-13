import { useState } from 'react'
import { Button, Switcher } from '@david-richard/notify-ds'
import { ScreenHeader } from '../components/ScreenHeader'
import { ContextBar } from '../components/ContextBar'
import { EmptyState } from '../components/EmptyState'
import { ArchiveXIcon } from '../icons'

const TABS = ['Open', 'Closed', 'Reconciled']

type ClosedTill = {
  claimed: string
  closed: string
  employee: string
  store: string
  expectedCash: string
}

const DEMO_CLOSED: ClosedTill = {
  claimed: '01/06/2026  01:05 am',
  closed: '01/06/2026  01:12 am',
  employee: 'Data, Leo',
  store: 'DataStoreDontTouch',
  expectedCash: '$444.91',
}

type Props = {
  onBack: () => void
  /** Which tab to render initially */
  defaultTab?: 'Open' | 'Closed' | 'Reconciled'
  onReconcile?: () => void
  onPickStores?: () => void
  onPickDate?: () => void
  storeLabel?: string
  dateLabel?: string
}

export function Tills({
  onBack,
  defaultTab = 'Open',
  onReconcile,
  onPickStores,
  onPickDate,
  storeLabel = '13 Stores',
  dateLabel = '01/06/26',
}: Props) {
  const [tab, setTab] = useState<string>(defaultTab)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <ScreenHeader title="Tills" onBack={onBack} />
      <ContextBar
        storeLabel={storeLabel}
        dateLabel={dateLabel}
        onStoreClick={onPickStores}
        onDateClick={onPickDate}
      />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          background: 'var(--color-surface-app, #F4F4F4)',
          padding: '12px 16px 24px',
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <Switcher segments={TABS} value={tab} onValueChange={setTab} stretch />
        </div>

        {tab === 'Open' && (
          <EmptyState
            icon={<ArchiveXIcon size={48} />}
            title="No Tills Found"
          />
        )}

        {tab === 'Closed' && (
          <ClosedTillCard till={DEMO_CLOSED} onReconcile={onReconcile} />
        )}

        {tab === 'Reconciled' && (
          <EmptyState
            icon={<ArchiveXIcon size={48} />}
            title="No Tills Found"
          />
        )}
      </div>
    </div>
  )
}

function ClosedTillCard({
  till,
  onReconcile,
}: {
  till: ClosedTill
  onReconcile?: () => void
}) {
  const rows: Array<[string, string]> = [
    ['Claimed', till.claimed],
    ['Closed', till.closed],
    ['Employee', till.employee],
    ['Store', till.store],
    ['Expected Cash', till.expectedCash],
  ]
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        padding: '20px 20px 24px',
        boxShadow: '0 4px 4px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          fontFamily: "'Inter', sans-serif",
          fontSize: 15,
        }}
      >
        {rows.map(([label, value]) => (
          <div
            key={label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: 12,
            }}
          >
            <span style={{ color: '#000' }}>{label}</span>
            <span style={{ color: '#000', fontWeight: 500, textAlign: 'right' }}>
              {value}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 4 }}>
        <Button variant="primary" size="lg" onClick={onReconcile}>
          Reconcile
        </Button>
      </div>
    </div>
  )
}
