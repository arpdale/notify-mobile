import { useState } from 'react'
import {
  BottomNav,
  BottomNavContainer,
  Button,
  MetricTile,
  MetricTileGrid,
  TabBar,
} from '@david-richard/notify-ds'
import logoLockup from '@david-richard/notify-ds/assets/logo-notify-lockup.svg?url'
import {
  BellIcon,
  BoxIcon,
  DashboardIcon,
  InfoCircleIcon,
  MenuIcon,
} from '../icons'
import { ContextBar } from '../components/ContextBar'
import { EmptyState } from '../components/EmptyState'
import { Toast } from '../components/Toast'
import { StoreView } from './dashboard/StoreView'

export type DashboardState = 'ready' | 'error'
export type DashboardTab = 'Sales' | 'Labor' | 'Store' | 'Product'
export type StoreSubTab = 'Productivity' | 'Network' | 'Kitchen'

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
}

const TABS = ['Sales', 'Labor', 'Store', 'Product']

const NAV_ITEMS = [
  { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { value: 'inventory', label: 'Inventory', icon: <BoxIcon /> },
  { value: 'menu', label: 'Menu', icon: <MenuIcon /> },
]

function TillsTile() {
  return (
    <div
      role="button"
      tabIndex={0}
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        boxShadow: '0 4px 4px rgba(0,0,0,0.06)',
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#6B7280',
          fontSize: 12,
        }}
      >
        <span>Tills</span>
        <span aria-hidden>›</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          fontSize: 14,
          color: '#000',
        }}
      >
        <span>
          Open: <strong style={{ fontWeight: 600 }}>0</strong>
        </span>
        <span>
          Closed: <strong style={{ fontWeight: 600 }}>1</strong>
        </span>
        <span>
          Reconciled: <strong style={{ fontWeight: 600 }}>0</strong>
        </span>
      </div>
    </div>
  )
}

export function Dashboard({
  state = 'ready',
  onRefresh,
  errorMessage,
  initialTab = 'Sales',
  initialStoreSubTab,
  onMenu,
}: Props = {}) {
  const [tab, setTab] = useState<string>(initialTab)
  const [nav, setNav] = useState('dashboard')

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
              <Button
                variant="primary"
                size="lg"
                onClick={onRefresh}
              >
                Refresh
              </Button>
            }
          />
        )}

        {state === 'ready' && tab === 'Sales' && (
          <MetricTileGrid cols={2}>
            <MetricTile
              label="Net Sales"
              value="$345.58"
              trend={11.8}
              trendLabel="$304.78"
            />
            <MetricTile
              label="Checks"
              value="11"
              trend={18.1}
              trendLabel="9"
            />
            <MetricTile
              label="Payments"
              value="$378.40"
              trend={11.1}
              trendLabel="$336.28"
            />
            <MetricTile
              label="Average Check"
              value="$33.86"
              trend={7.7}
              trendLabel="$31.42"
            />
            <MetricTile
              label="Gross Sales"
              value="$368.40"
              trend={-11.4}
              trendLabel="$326.28"
            />
            <MetricTile
              label="Discounts"
              value="$22.40"
              trend={14.2}
              trendLabel="$19.20"
            />
            <MetricTile label="Cash" value="$44.91" trendLabel="$44.91" />
            <TillsTile />
            <MetricTile label="Voids" value="$8.00" />
            <MetricTile label="Service Charges" value="$10.00" />
          </MetricTileGrid>
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
        <BottomNavContainer>
          <BottomNav
            items={NAV_ITEMS}
            value={nav}
            onValueChange={(v) => {
              if (v === 'menu') {
                onMenu?.()
              } else {
                setNav(v)
              }
            }}
          />
        </BottomNavContainer>
      )}
    </div>
  )
}
