import type { ReactNode } from 'react'
import { ChevronLeftIcon } from '../icons'

type Props = {
  title: string
  onBack?: () => void
  /** Optional element rendered on the right side (e.g., action icon) */
  rightSlot?: ReactNode
}

export function ScreenHeader({ title, onBack, rightSlot }: Props) {
  return (
    <header
      style={{
        height: 56,
        padding: '0 16px',
        background: '#FFFFFF',
        display: 'grid',
        gridTemplateColumns: '44px 1fr 44px',
        alignItems: 'center',
        flexShrink: 0,
      }}
    >
      {onBack ? (
        <button
          type="button"
          aria-label="Back"
          onClick={onBack}
          style={{
            border: 0,
            background: 'transparent',
            padding: 4,
            cursor: 'pointer',
            color: '#000',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <ChevronLeftIcon size={24} />
        </button>
      ) : (
        <span />
      )}
      <h1
        style={{
          margin: 0,
          fontFamily: "'Inter', sans-serif",
          fontSize: 17,
          fontWeight: 500,
          color: '#000',
          textAlign: 'center',
        }}
      >
        {title}
      </h1>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        {rightSlot}
      </div>
    </header>
  )
}
