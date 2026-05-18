import type { ReactNode } from 'react'
import { ScreenHeader } from '@david-richard/notify-ds'
import { AppBottomNav, type AppNavValue } from './AppBottomNav'

type Props = {
  title: string
  /** Optional context-bar slot (e.g. single-store pill on Forecast). */
  contextBar?: ReactNode
  /** Body content — rendered in a scrollable area with bottom-nav clearance. */
  children: ReactNode
  /** Currently-active bottom-nav item; usually undefined since menu targets
   *  don't map onto Dashboard / Inventory / Menu directly. */
  navValue?: AppNavValue
  onDashboard: () => void
  onInventory: () => void
  onMenu: () => void
}

/**
 * Shell for the menu-driven destinations (Forecast, Settings, Digital Channels,
 * Kitchen Intelligence, Analyze, Product Tour, Checks Search). These behave as
 * top-level base routes — page-level title with no back chevron, optional
 * context bar, scroll body, and the standard AppBottomNav so users can
 * return to Dashboard / Inventory or reopen the Menu drawer.
 */
export function MenuTargetPage({
  title,
  contextBar,
  children,
  navValue,
  onDashboard,
  onInventory,
  onMenu,
}: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <ScreenHeader title={title} />
      {contextBar}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          background: 'var(--color-surface-app, #F4F4F4)',
          padding: '12px 16px 140px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </div>
      <AppBottomNav
        value={navValue ?? ('__none__' as AppNavValue)}
        onNavigate={(v) => {
          if (v === 'dashboard') onDashboard()
          else if (v === 'inventory') onInventory()
          else if (v === 'menu') onMenu()
        }}
      />
    </div>
  )
}
