import type { ReactNode } from 'react'
import { Badge } from '@david-richard/notify-ds'
import { BottomSheet } from '../components/BottomSheet'

/** Identifies which menu item maps to which destination — used to bold the
 *  currently-active page in the menu list and to wire each item's onClick. */
export type MenuItemId =
  | 'kitchen-intelligence'
  | 'settings'
  | 'forecast'
  | 'digital-channels'
  | 'checks-search'
  | 'leaderboards'
  | 'analyze'
  | 'product-tour'

type MenuItem = {
  id: MenuItemId
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
  /** Id of the currently-active page — that item renders bold in the list. */
  current?: MenuItemId
  onKitchenIntelligence?: () => void
  onSettings?: () => void
  onForecast?: () => void
  onDigitalChannels?: () => void
  onChecksSearch?: () => void
  /** Leaderboards is only shown when a handler is provided. App.tsx omits
   *  this prop for single-store users so the row disappears entirely. */
  onLeaderboards?: () => void
  onAnalyze?: () => void
  onProductTour?: () => void
  onLogOut?: () => void
  version?: string
}

export function MenuOverlay({
  open,
  onDismiss,
  current,
  onKitchenIntelligence,
  onSettings,
  onForecast,
  onDigitalChannels,
  onChecksSearch,
  onLeaderboards,
  onAnalyze,
  onProductTour,
  onLogOut,
  version = 'Version 3.6.222',
}: Props) {
  const tools: MenuItem[] = [
    {
      id: 'kitchen-intelligence',
      label: 'Kitchen Intelligence',
      onClick: onKitchenIntelligence,
      badge: <Badge variant="brand">NEW</Badge>,
    },
    { id: 'settings', label: 'Settings', onClick: onSettings },
    { id: 'forecast', label: 'Forecast', onClick: onForecast },
    { id: 'digital-channels', label: 'Digital Channels', onClick: onDigitalChannels },
    { id: 'checks-search', label: 'Checks Search', onClick: onChecksSearch },
    ...(onLeaderboards
      ? [{ id: 'leaderboards' as const, label: 'Leaderboards', onClick: onLeaderboards }]
      : []),
  ]

  const support: MenuItem[] = [
    { id: 'analyze', label: 'Analyze', onClick: onAnalyze },
    { id: 'product-tour', label: 'Product Tour', onClick: onProductTour },
  ]

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
        <MenuSection title="Tools" items={tools} current={current} />
        <MenuSection title="Support" items={support} current={current} />
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
            fontFamily: 'var(--font-display)',
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

function MenuSection({
  title,
  items,
  current,
}: {
  title: string
  items: MenuItem[]
  current?: MenuItemId
}) {
  return (
    <section>
      <h2
        style={{
          margin: '0 0 12px',
          fontFamily: 'var(--font-display)',
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
        {items.map((item) => {
          const isActive = item.id === current
          return (
            <li
              key={item.id}
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
                  fontWeight: isActive ? 700 : 500,
                  color: TEXT_PRIMARY,
                  textAlign: 'left',
                }}
              >
                {item.label}
              </button>
              {item.badge}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
