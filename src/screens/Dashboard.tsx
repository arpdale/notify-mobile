import { useState } from 'react'
import {
  BottomNav,
  BottomNavContainer,
  MetricTile,
  MetricTileGrid,
  Selector,
  TabBar,
} from '@david-richard/notify-ds'
import logoLockup from '@david-richard/notify-ds/assets/logo-notify-lockup.svg?url'
import {
  BellIcon,
  BoxIcon,
  CalendarIcon,
  DashboardIcon,
  MenuIcon,
  StoreIcon,
} from '../icons'

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

export function Dashboard() {
  const [tab, setTab] = useState('Sales')
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

      <div
        style={{
          height: 56,
          padding: '0 16px',
          background: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          flexShrink: 0,
        }}
      >
        <Selector
          label="StoreName"
          variant="primary"
          state="active"
          icon={<StoreIcon size={16} />}
        />
        <span style={{ color: '#6B7280', fontSize: 18, lineHeight: 1 }}>•</span>
        <Selector
          label="01/06/26"
          variant="primary"
          state="active"
          icon={<CalendarIcon size={16} />}
        />
      </div>

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

        {tab === 'Sales' && (
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

        {tab !== 'Sales' && (
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

      <BottomNavContainer>
        <BottomNav items={NAV_ITEMS} value={nav} onValueChange={setNav} />
      </BottomNavContainer>
    </div>
  )
}
