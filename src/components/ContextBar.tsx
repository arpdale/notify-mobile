import { Selector } from '@david-richard/notify-ds'
import { Calendar, Store } from '@david-richard/notify-ds/icons'
import { StarIcon } from './SavedViewsStrip'

type Props = {
  storeLabel: string
  dateLabel: string
  onStoreClick?: () => void
  onDateClick?: () => void
  /** Optional save action — wires up the trailing star. When provided, the
   *  star renders; otherwise the bar looks identical to its pre-IDEA shape.
   *  `saved` flips the icon to filled, signalling that the current combo is
   *  already in the user's saved views. */
  onSaveView?: () => void
  saved?: boolean
}

export function ContextBar({
  storeLabel,
  dateLabel,
  onStoreClick,
  onDateClick,
  onSaveView,
  saved = false,
}: Props) {
  return (
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
        label={storeLabel}
        variant="primary"
        state="active"
        icon={<Store size={16} />}
        onClick={onStoreClick}
      />
      <span style={{ color: '#6B7280', fontSize: 18, lineHeight: 1 }}>•</span>
      <Selector
        label={dateLabel}
        variant="primary"
        state="active"
        icon={<Calendar size={16} />}
        onClick={onDateClick}
      />
      {onSaveView && (
        <button
          type="button"
          aria-label={saved ? 'Combo already saved' : 'Save this view'}
          onClick={onSaveView}
          disabled={saved}
          style={{
            marginLeft: 4,
            border: 0,
            background: 'transparent',
            padding: 8,
            cursor: saved ? 'default' : 'pointer',
            color: saved ? '#40CCF2' : '#6B7280',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <StarIcon filled={saved} size={18} />
        </button>
      )}
    </div>
  )
}
