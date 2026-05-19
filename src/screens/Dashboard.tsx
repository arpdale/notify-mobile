import { useState } from 'react'
import { Button, TabBar } from '@david-richard/notify-ds'
import logoLockup from '@david-richard/notify-ds/assets/logo-notify-lockup.svg?url'
import { Info } from '@david-richard/notify-ds/icons'
import { NotificationsBellButton } from '../components/NotificationsBellButton'
import { AppBottomNav } from '../components/AppBottomNav'
import { ContextBar } from '../components/ContextBar'
import { EmptyState } from '../components/EmptyState'
import { Toast } from '../components/Toast'
import { SalesView } from './dashboard/SalesView'
import { LaborView } from './dashboard/LaborView'
import { StoreView } from './dashboard/StoreView'
import { DEFAULT_FILTER, type DateFilter } from '../lib/dateFilter'

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
  /** Called when the context bar's store selector is tapped */
  onPickStores?: () => void
  /** Called when the context bar's date selector is tapped */
  onPickDate?: () => void
  /** Overrides for the context bar selector labels */
  storeLabel?: string
  dateLabel?: string
  /** When set, the ContextBar shows a star action that calls this on tap.
   *  `currentViewSaved` flips the icon to filled. App.tsx wires these only
   *  when the saved-views experiment is on. */
  onSaveView?: () => void
  currentViewSaved?: boolean
  /** Live inputs driving tile data — Sales/Labor views recompute when any
   *  of these change. Optional so the error state can mount without them. */
  selectedStoreIds?: Set<string>
  dateFilter?: DateFilter
  today?: Date
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
  onPickStores,
  onPickDate,
  storeLabel = 'StoreName',
  dateLabel = '01/06/26',
  onSaveView,
  currentViewSaved = false,
  selectedStoreIds,
  dateFilter,
  today,
}: Props = {}) {
  const [tab, setTab] = useState<string>(initialTab)
  // Each view (SalesView / LaborView) now owns its own data lifecycle via
  // useEffect against the selectors — the old 600ms skeleton timer is gone.
  // Defaults below cover the error-state mount where data props aren't
  // threaded; the views won't render in that case anyway.
  const effectiveStoreIds = selectedStoreIds ?? new Set<string>()
  const effectiveFilter = dateFilter ?? DEFAULT_FILTER
  const effectiveToday = today ?? new Date()

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
        <NotificationsBellButton onClick={onNotifications} />
      </header>

      <ContextBar
        storeLabel={storeLabel}
        dateLabel={dateLabel}
        onStoreClick={onPickStores}
        onDateClick={onPickDate}
        onSaveView={onSaveView}
        saved={currentViewSaved}
      />

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
            icon={<Info size={48} />}
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
          <SalesView
            onTileClick={onTileClick}
            selectedStoreIds={effectiveStoreIds}
            dateFilter={effectiveFilter}
            today={effectiveToday}
          />
        )}

        {state === 'ready' && tab === 'Labor' && (
          <LaborView
            selectedStoreIds={effectiveStoreIds}
            dateFilter={effectiveFilter}
            today={effectiveToday}
          />
        )}

        {state === 'ready' && tab === 'Store' && (
          <StoreView
            initialSubTab={initialStoreSubTab}
            selectedStoreIds={effectiveStoreIds}
            dateFilter={effectiveFilter}
          />
        )}

        {state === 'ready' && tab === 'Product' && (
          <div
            style={{
              marginTop: 40,
              textAlign: 'center',
              fontFamily: "'Inter', sans-serif",
              color: '#6B7280',
            }}
          >
            Product view — coming soon.
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
