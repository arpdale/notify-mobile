import type { ReactNode } from 'react'
import { Badge } from '@david-richard/notify-ds'
import { BottomSheet } from '../components/BottomSheet'

type MenuItem = {
  label: string
  onClick?: () => void
  badge?: ReactNode
}

// Dark slate matching walkthrough frame 0062 — solid surface, slight cool tint.
const SHEET_BG = '#1F2329'
const TEXT_PRIMARY = '#FFFFFF'
const TEXT_SECONDARY = 'rgba(255,255,255,0.55)'

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
    <BottomSheet
      open={open}
      onDismiss={onDismiss}
      heightPercent={70}
      background={SHEET_BG}
      handleColor="rgba(255,255,255,0.4)"
      // Above the floating bottom-nav (z=50). The drawer should obscure the
      // nav while open so users can't accidentally route away mid-menu.
      zIndex={60}
    >
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
            color: TEXT_PRIMARY,
            textDecoration: 'underline',
          }}
        >
          Log Out
        </button>
        <span
          style={{
            alignSelf: 'center',
            fontSize: 13,
            color: TEXT_SECONDARY,
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
          color: TEXT_PRIMARY,
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
                color: TEXT_PRIMARY,
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
