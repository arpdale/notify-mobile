import logoLockup from '@david-richard/notify-ds/assets/logo-notify-lockup.svg?url'
import { AppBottomNav } from '../components/AppBottomNav'
import { ContextBar } from '../components/ContextBar'
import { EmptyState } from '../components/EmptyState'
import { Package } from '@david-richard/notify-ds/icons'
import { NotificationsBellButton } from '../components/NotificationsBellButton'

type Props = {
  onMenu: () => void
  onDashboard: () => void
  onNotifications?: () => void
  onPickStores?: () => void
  onPickDate?: () => void
  storeLabel?: string
  dateLabel?: string
}

export function Inventory({
  onMenu,
  onDashboard,
  onNotifications,
  onPickStores,
  onPickDate,
  storeLabel = 'StoreName',
  dateLabel = '01/06/26',
}: Props) {
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
      />

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
        <EmptyState
          icon={<Package size={48} />}
          title="Inventory coming soon"
          description="Live counts and restock alerts will land here."
        />
      </div>

      <AppBottomNav
        value="inventory"
        onNavigate={(v) => {
          if (v === 'dashboard') onDashboard()
          else if (v === 'menu') onMenu()
        }}
      />
    </div>
  )
}
