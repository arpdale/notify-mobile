import type { ReactNode } from 'react'
import { ScreenHeader } from './ScreenHeader'
import { ContextBar } from './ContextBar'

type Props = {
  title: string
  onBack: () => void
  storeLabel?: string
  dateLabel?: string
  children: ReactNode
}

export function DetailShell({
  title,
  onBack,
  storeLabel = '13 Stores',
  dateLabel = '01/06/26',
  children,
}: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <ScreenHeader title={title} onBack={onBack} />
      <ContextBar storeLabel={storeLabel} dateLabel={dateLabel} />
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          background: 'var(--color-surface-app, #F4F4F4)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

/**
 * White card with optional title bar — used to wrap charts in the detail
 * screens. Title is centered, optional external-link icon sits top-right.
 */
export function DetailCard({
  title,
  onExpand,
  children,
}: {
  title?: string
  onExpand?: () => void
  children: ReactNode
}) {
  return (
    <section
      style={{
        background: '#FFFFFF',
        borderRadius: 0,
        padding: '20px 16px 24px',
        boxShadow: 'none',
        marginBottom: 12,
        position: 'relative',
      }}
    >
      {title ? (
        <h2
          style={{
            margin: '0 0 16px',
            fontFamily: "'Inter', sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: '#000',
            textAlign: 'center',
          }}
        >
          {title}
        </h2>
      ) : null}
      {onExpand ? (
        <button
          type="button"
          aria-label="Expand"
          onClick={onExpand}
          style={{
            position: 'absolute',
            top: 18,
            right: 16,
            border: 0,
            background: 'transparent',
            padding: 4,
            cursor: 'pointer',
            color: '#000',
          }}
        >
          <svg
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M15 3h6v6" />
            <path d="m21 3-9 9" />
            <path d="M9 21H3v-6" />
          </svg>
        </button>
      ) : null}
      {children}
    </section>
  )
}
