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

type Phase = 'exited' | 'entering' | 'entered' | 'exiting'

export function BottomSheet({
  open,
  onDismiss,
  children,
  heightPercent = 80,
  background = '#FFFFFF',
  handleColor = '#000000',
  zIndex = 20,
}: Props) {
  const [phase, setPhase] = useState<Phase>(open ? 'entered' : 'exited')

  // Phase 1: map open changes to entering/exiting.
  useEffect(() => {
    if (open && (phase === 'exited' || phase === 'exiting')) {
      setPhase('entering')
    } else if (!open && (phase === 'entered' || phase === 'entering')) {
      setPhase('exiting')
    }
  }, [open, phase])

  // Phase 2: once entering has rendered + painted, flip to entered so the
  // browser sees a real transform change and animates the slide-up.
  useEffect(() => {
    if (phase !== 'entering') return
    let raf2: number | null = null
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setPhase('entered'))
    })
    return () => {
      cancelAnimationFrame(raf1)
      if (raf2 !== null) cancelAnimationFrame(raf2)
    }
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

  if (phase === 'exited') return null

  const isOffScreen = phase === 'entering' || phase === 'exiting'

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
        opacity: isOffScreen ? 0 : 1,
        transition: `opacity ${DURATION_MS}ms ${EASE}`,
        pointerEvents: phase === 'entered' ? 'auto' : 'auto',
      }}
      onTransitionEnd={(e) => {
        if (e.target !== e.currentTarget) return
        if (phase === 'exiting') setPhase('exited')
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
          transform: isOffScreen ? 'translateY(100%)' : 'translateY(0)',
          transition: `transform ${DURATION_MS}ms ${EASE}`,
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
