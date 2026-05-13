import type { ReactNode } from 'react'

type Props = {
  open: boolean
  onDismiss?: () => void
  children: ReactNode
  /** Height of the sheet as % of viewport (default 80) */
  heightPercent?: number
}

export function BottomSheet({
  open,
  onDismiss,
  children,
  heightPercent = 80,
}: Props) {
  if (!open) return null
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onDismiss}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        display: 'flex',
        alignItems: 'flex-end',
        background: 'rgba(0,0,0,0.45)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          height: `${heightPercent}%`,
          background: '#FFFFFF',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: '12px 24px 24px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            alignSelf: 'center',
            width: 40,
            height: 4,
            borderRadius: 2,
            background: '#000000',
            marginBottom: 12,
          }}
        />
        <div style={{ flex: 1, overflowY: 'auto' }}>{children}</div>
      </div>
    </div>
  )
}
