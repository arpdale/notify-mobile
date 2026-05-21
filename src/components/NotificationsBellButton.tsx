import { Bell } from '@david-richard/notify-ds/icons'

type Props = {
  onClick?: () => void
  /** When true, paint the red badge dot on top of the bell. Defaults to
   *  false — current proto has no unread state plumbed in yet. Replace
   *  with `unreadCount > 0` once notifications wire to real data. */
  hasUnread?: boolean
}

export function NotificationsBellButton({ onClick, hasUnread = false }: Props) {
  return (
    <button
      type="button"
      aria-label="Notifications"
      onClick={onClick}
      style={{
        position: 'relative',
        border: 0,
        background: 'transparent',
        padding: 4,
        cursor: 'pointer',
        color: '#000',
      }}
    >
      <Bell size={22} />
      {hasUnread ? (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: 4,
            right: 4,
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: 'var(--color-destructive,#EF2149)',
          }}
        />
      ) : null}
    </button>
  )
}
