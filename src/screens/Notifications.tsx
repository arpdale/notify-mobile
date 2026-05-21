import { BottomSheet } from '../components/BottomSheet'
import { Bell } from '@david-richard/notify-ds/icons'

type Props = {
  open: boolean
  onDismiss: () => void
}

export function Notifications({ open, onDismiss }: Props) {
  return (
    <BottomSheet
      open={open}
      onDismiss={onDismiss}
      heightPercent={70}
      // Above the floating bottom-nav (z=50) so the panel obscures the nav
      // while open — matches the MenuOverlay treatment so all bottom-anchored
      // sheets in the app behave the same way.
      zIndex={60}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 16,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: "'Red Hat Display', 'Inter', sans-serif",
            fontSize: 24,
            fontWeight: 700,
            color: '#000',
          }}
        >
          Notifications
        </h2>
        <button
          type="button"
          onClick={onDismiss}
          style={{
            border: 0,
            background: 'transparent',
            padding: 0,
            cursor: 'pointer',
            color: 'var(--color-interactive-secondary,#339FB8)',
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Mark all read
        </button>
      </header>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          padding: '32px 16px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#F4F4F4',
            color: '#9CA3AF',
          }}
        >
          <Bell size={28} />
        </div>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 16,
            color: '#6B7280',
            lineHeight: 1.4,
          }}
        >
          <div>You're all caught up</div>
          <div>New notifications will appear here</div>
        </div>
      </div>
    </BottomSheet>
  )
}
