import { useEffect, type ReactNode } from 'react'

type Props = {
  open: boolean
  /** Called when the scrim is tapped or Escape is pressed. Omit to disable both. */
  onDismiss?: () => void
  children: ReactNode
  /**
   * - 'card' (default): rounded 24px card, max-width 320px, blurred-glass tint
   * - 'plain': no card chrome (children supply their own surface)
   */
  variant?: 'card' | 'plain'
}

export function Modal({ open, onDismiss, children, variant = 'card' }: Props) {
  useEffect(() => {
    if (!open || !onDismiss) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onDismiss])

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
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(2px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={
          variant === 'card'
            ? {
                width: '100%',
                maxWidth: 320,
                borderRadius: 24,
                padding: '28px 24px',
                background:
                  'linear-gradient(180deg, rgba(40,40,44,0.92), rgba(20,20,24,0.92))',
                color: '#FFFFFF',
                boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
                textAlign: 'center',
              }
            : { display: 'contents' }
        }
      >
        {children}
      </div>
    </div>
  )
}
