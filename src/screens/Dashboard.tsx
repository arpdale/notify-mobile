import { useState } from 'react'
import { Button, TabBar } from '@david-richard/notify-ds'
import logoLockup from '@david-richard/notify-ds/assets/logo-notify-lockup.svg?url'
import { BellIcon, InfoCircleIcon } from '../icons'
import { AppBottomNav } from '../components/AppBottomNav'
import { ContextBar } from '../components/ContextBar'
import { EmptyState } from '../components/EmptyState'
import { Toast } from '../components/Toast'
import { SalesView } from './dashboard/SalesView'
import { StoreView } from './dashboard/StoreView'

export type DashboardState = 'ready' | 'error'
export type DashboardTab = 'Sales' | 'Labor' | 'Store' | 'Product'
export type StoreSubTab = 'Productivity' | 'Network' | 'Kitchen'

export type DashboardTile =
  | 'Net Sales'
  | 'Checks'
  | 'Payments'
  | 'Average Check'
  | 'Gross Sales'
  | 'Discounts'
  | 'Cash'
  | 'Tills'
  | 'Voids'
  | 'Service Charges'

type Props = {
  state?: DashboardState
  onRefresh?: () => void
  /** When set, renders the error toast pinned above the bottom nav */
  errorMessage?: string
  /** Initial primary tab (Sales / Labor / Store / Product) */
  initialTab?: DashboardTab
  /** Initial sub-tab — only honoured when initialTab is "Store" */
  initialStoreSubTab?: StoreSubTab
  /** Called when the bottom-nav "Menu" item is selected */
  onMenu?: () => void
  /** Called when the bottom-nav "Inventory" item is selected */
  onInventory?: () => void
  /** Called when a Sales tab metric tile is tapped */
  onTileClick?: (tile: DashboardTile) => void
  /** Called when the header bell icon is tapped */
  onNotifications?: () => void
}

const TABS = ['Sales', 'Labor', 'Store', 'Product']

export function Dashboard({
  state = 'ready',
  onRefresh,
  errorMessage,
  initialTab = 'Sales',
  initialStoreSubTab,
  onMenu,
  onInventory,
  onTileClick,
  onNotifications,
}: Props = {}) {
  const [tab, setTab] = useState<string>(initialTab)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <header
        style={{
          height: 56,
          padding: '0 20px',
          background: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <img src={logoLockup} alt="Qu Notify" style={{ height: 22 }} />
        <button
          type="button"
          aria-label="Notifications"
          onClick={onNotifications}
          style={{
            position: 'relative',
            border: 0,
            background: 'transparent',
            padding: 4,
            cursor: 'pointer',
            color: '#000',
          }}
        >
          <BellIcon size={22} />
          <span
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#EF2149',
            }}
          />
        </button>
      </header>

      <ContextBar storeLabel="StoreName" dateLabel="01/06/26" />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          background: 'var(--color-surface-app, #F4F4F4)',
          padding: '12px 16px 140px',
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <TabBar tabs={TABS} value={tab} onValueChange={setTab} stretch />
        </div>

        {state === 'error' && (
          <EmptyState
            icon={<InfoCircleIcon size={48} />}
            title="Something Went Wrong"
            description="Try Refreshing"
            action={
              <Button variant="primary" size="lg" onClick={onRefresh}>
                Refresh
              </Button>
            }
          />
        )}

        {state === 'ready' && tab === 'Sales' && (
          <SalesView onTileClick={onTileClick} />
        )}

        {state === 'ready' && tab === 'Store' && (
          <StoreView initialSubTab={initialStoreSubTab} />
        )}

        {state === 'ready' && (tab === 'Labor' || tab === 'Product') && (
          <div
            style={{
              marginTop: 40,
              textAlign: 'center',
              fontFamily: "'Inter', sans-serif",
              color: '#6B7280',
            }}
          >
            {tab} view — coming soon.
          </div>
        )}
      </div>

      {errorMessage ? (
        <Toast message={errorMessage} variant="error" position="attached" />
      ) : (
        <AppBottomNav
          value="dashboard"
          onNavigate={(v) => {
            if (v === 'menu') onMenu?.()
            else if (v === 'inventory') onInventory?.()
            // 'dashboard' is already current
          }}
        />
      )}
    </div>
  )
}
