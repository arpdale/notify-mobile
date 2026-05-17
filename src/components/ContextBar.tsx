import { Selector } from '@david-richard/notify-ds'
import { Calendar, Store } from '@david-richard/notify-ds/icons'

type Props = {
  storeLabel: string
  dateLabel: string
  onStoreClick?: () => void
  onDateClick?: () => void
}

export function ContextBar({ storeLabel, dateLabel, onStoreClick, onDateClick }: Props) {
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
    </div>
  )
}
