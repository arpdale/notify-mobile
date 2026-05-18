import type { ReactNode } from 'react'
import { Badge, DrawerSection, DrawerItem, DrawerAction } from '@david-richard/notify-ds'
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
  | 'backlog-ideas'

type MenuItem = {
  id: MenuItemId
  label: string
  onClick?: () => void
  badge?: ReactNode
}

// Dark slate matching walkthrough frame 0062 — solid surface, slight cool tint.
const SHEET_BG = '#1F2329'
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
  onBacklogIdeas?: () => void
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
  onBacklogIdeas,
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
    { id: 'backlog-ideas', label: 'Backlog Ideas', onClick: onBacklogIdeas },
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
        <DrawerSection title="Tools">
          {tools.map((item) => (
            <DrawerItem
              key={item.id}
              label={item.label}
              onClick={item.onClick}
              active={item.id === current}
              badge={item.badge}
            />
          ))}
        </DrawerSection>
        <DrawerSection title="Support">
          {support.map((item) => (
            <DrawerItem
              key={item.id}
              label={item.label}
              onClick={item.onClick}
              active={item.id === current}
              badge={item.badge}
            />
          ))}
        </DrawerSection>
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
        <DrawerAction onClick={onLogOut}>Log Out</DrawerAction>
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
