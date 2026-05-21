import { useState } from 'react'
import { ScreenHeader, TabBar } from '@david-richard/notify-ds'
import { ArrowUp } from '@david-richard/notify-ds/icons'

const TABS = ['Prices', 'Checks']

type PriceRow = {
  claimed: number
  price: string
}

const DEMO_PRICES: PriceRow[] = [{ claimed: 2260, price: '$25.95' }]

type Props = {
  onBack: () => void
}

export function ThanksgivingFeast({ onBack }: Props) {
  const [tab, setTab] = useState<string>('Prices')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <ScreenHeader title="Thanksgiving Feast" onBack={onBack} />

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
          <TabBar tabs={TABS} value={tab} onValueChange={setTab} stretch />
        </div>

        {tab === 'Prices' && (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: '4px 0 16px',
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
              }}
            >
              <span style={{ color: '#000' }}>
                {DEMO_PRICES.length} Price for Thanksgiving Feast
              </span>
              <button
                type="button"
                style={{
                  border: 0,
                  background: 'transparent',
                  padding: 0,
                  cursor: 'pointer',
                  color: 'var(--color-interactive-secondary,#339FB8)',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <ArrowUp size={14} />
                Quantity
              </button>
            </div>

            {DEMO_PRICES.map((row, i) => (
              <PriceCard key={i} row={row} />
            ))}
          </>
        )}

        {tab === 'Checks' && (
          <div
            style={{
              marginTop: 40,
              textAlign: 'center',
              fontFamily: "'Inter', sans-serif",
              color: '#6B7280',
            }}
          >
            No Checks Found
          </div>
        )}
      </div>
    </div>
  )
}

function PriceCard({ row }: { row: PriceRow }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        padding: '18px 24px',
        boxShadow: '0 4px 4px rgba(0,0,0,0.04)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 14, color: 'var(--color-destructive,#EF2149)', fontWeight: 500 }}>
          Claimed
        </span>
        <span style={{ fontSize: 22, fontWeight: 600, color: 'var(--color-destructive,#EF2149)' }}>
          {row.claimed.toLocaleString()}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 14, color: '#000' }}>Price</span>
        <span style={{ fontSize: 22, fontWeight: 600, color: '#000' }}>
          {row.price}
        </span>
      </div>
    </div>
  )
}
