import type { ReactNode } from 'react'
import { Badge } from '@david-richard/notify-ds'
import { BottomSheet } from '../components/BottomSheet'

type MenuItem = {
  label: string
  onClick?: () => void
  badge?: ReactNode
}

type Props = {
  open: boolean
  onDismiss: () => void
  onCheckSearch?: () => void
  onKitchenIntelligence?: () => void
  onLogOut?: () => void
  version?: string
}

export function MenuOverlay({
  open,
  onDismiss,
  onCheckSearch,
  onKitchenIntelligence,
  onLogOut,
  version = 'Version 3.6.222',
}: Props) {
  const tools: MenuItem[] = [
    {
      label: 'Kitchen Intelligence',
      onClick: onKitchenIntelligence,
      badge: <Badge variant="brand">NEW</Badge>,
    },
    { label: 'Settings' },
    { label: 'Forecast' },
    { label: 'Digital Channels' },
    { label: 'Checks Search', onClick: onCheckSearch },
  ]

  const support: MenuItem[] = [{ label: 'Analyze' }, { label: 'Product Tour' }]

  return (
    <BottomSheet open={open} onDismiss={onDismiss} heightPercent={68}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          paddingTop: 4,
          paddingBottom: 16,
        }}
      >
        <MenuSection title="Tools" items={tools} />
        <MenuSection title="Support" items={support} />
      </div>

      <div
        style={{
          marginTop: 'auto',
          paddingTop: 24,
          paddingBottom: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <button
          type="button"
          onClick={onLogOut}
          style={{
            alignSelf: 'flex-start',
            border: 0,
            background: 'transparent',
            padding: 0,
            cursor: 'pointer',
            fontFamily: "'Red Hat Display', 'Inter', sans-serif",
            fontSize: 22,
            fontWeight: 700,
            color: '#000',
            textDecoration: 'underline',
          }}
        >
          Log Out
        </button>
        <span
          style={{
            alignSelf: 'center',
            fontSize: 13,
            color: '#6B7280',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {version}
        </span>
      </div>
    </BottomSheet>
  )
}

function MenuSection({ title, items }: { title: string; items: MenuItem[] }) {
  return (
    <section>
      <h2
        style={{
          margin: '0 0 12px',
          fontFamily: "'Red Hat Display', 'Inter', sans-serif",
          fontSize: 24,
          fontWeight: 700,
          color: '#000',
        }}
      >
        {title}
      </h2>
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {items.map((item) => (
          <li
            key={item.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <button
              type="button"
              onClick={item.onClick}
              style={{
                border: 0,
                background: 'transparent',
                padding: 0,
                cursor: item.onClick ? 'pointer' : 'default',
                fontFamily: "'Inter', sans-serif",
                fontSize: 18,
                fontWeight: 500,
                color: '#000',
                textAlign: 'left',
              }}
            >
              {item.label}
            </button>
            {item.badge}
          </li>
        ))}
      </ul>
    </section>
  )
}
