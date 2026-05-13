import { useEffect, useState, type ReactNode } from 'react'

type Props = {
  open: boolean
  /** Called when the scrim is tapped or Escape is pressed. */
  onDismiss?: () => void
  children: ReactNode
  /** Height of the sheet as % of viewport (default 80) */
  heightPercent?: number
  /** Sheet surface color (default white) */
  background?: string
  /** Drag handle color (default black) */
  handleColor?: string
  /** z-index (default 20). Bump above 50 to obscure the floating bottom nav. */
  zIndex?: number
}

const DURATION_MS = 280
const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)'

type Phase = 'closed' | 'open' | 'closing'

export function BottomSheet({
  open,
  onDismiss,
  children,
  heightPercent = 80,
  background = '#FFFFFF',
  handleColor = '#000000',
  zIndex = 20,
}: Props) {
  const [phase, setPhase] = useState<Phase>(open ? 'open' : 'closed')

  // Map open changes to phase. closing → closed happens via the timer below.
  useEffect(() => {
    if (open && (phase === 'closed' || phase === 'closing')) {
      setPhase('open')
    } else if (!open && phase === 'open') {
      setPhase('closing')
    }
  }, [open, phase])

  // Schedule the unmount after the close animation duration.
  useEffect(() => {
    if (phase !== 'closing') return
    const t = window.setTimeout(() => setPhase('closed'), DURATION_MS + 20)
    return () => window.clearTimeout(t)
  }, [phase])

  // Esc dismiss while open.
  useEffect(() => {
    if (!open || !onDismiss) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onDismiss])

  if (phase === 'closed') return null

  const scrimAnimation =
    phase === 'open'
      ? `bs-fade-in ${DURATION_MS}ms ${EASE} forwards`
      : `bs-fade-out ${DURATION_MS}ms ${EASE} forwards`

  const sheetAnimation =
    phase === 'open'
      ? `bs-slide-up ${DURATION_MS}ms ${EASE} forwards`
      : `bs-slide-down ${DURATION_MS}ms ${EASE} forwards`

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex,
        display: 'flex',
        alignItems: 'flex-end',
        background: 'rgba(0,0,0,0.45)',
        animation: scrimAnimation,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          height: `${heightPercent}%`,
          background,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: '12px 24px 24px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: sheetAnimation,
          willChange: 'transform',
          boxShadow: '0 -12px 24px rgba(0,0,0,0.18)',
        }}
      >
        <div
          aria-hidden
          style={{
            alignSelf: 'center',
            width: 40,
            height: 4,
            borderRadius: 2,
            background: handleColor,
            marginBottom: 12,
          }}
        />
        <div style={{ flex: 1, overflowY: 'auto' }}>{children}</div>
      </div>
    </div>
  )
}
