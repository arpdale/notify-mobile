import { useEffect, useState, type ReactNode } from 'react'

type Direction = 'right' | 'bottom'

type Props = {
  open: boolean
  direction: Direction
  /** Called when the exit animation completes (so callers can clear state) */
  onExited?: () => void
  /** When set, Escape key fires this — typically the same handler that flips open=false */
  onDismiss?: () => void
  /** z-index; default 60 (above the floating bottom-nav at z=50 so the
   *  overlay covers the global nav while presented). */
  zIndex?: number
  children: ReactNode
}

const DURATION_MS = 280
const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)'

type Phase = 'exited' | 'entering' | 'entered' | 'exiting'

function offTransform(direction: Direction): string {
  return direction === 'right' ? 'translateX(100%)' : 'translateY(100%)'
}

export function SlideIn({
  open,
  direction,
  onExited,
  onDismiss,
  zIndex = 60,
  children,
}: Props) {
  const [phase, setPhase] = useState<Phase>(open ? 'entered' : 'exited')

  // Effect 1: react to `open` changes, flip into entering / exiting.
  // Does NOT schedule the next phase — that has to wait for the entering
  // render to commit + paint, otherwise React can batch both updates and
  // the browser never sees a transform change to animate from.
  useEffect(() => {
    if (open && (phase === 'exited' || phase === 'exiting')) {
      setPhase('entering')
    } else if (!open && (phase === 'entered' || phase === 'entering')) {
      setPhase('exiting')
    }
  }, [open, phase])

  // Effect 2: after the entering render commits + paints (useEffect runs
  // post-paint), wait one more frame, then flip to entered so the browser
  // sees a real transform-property change and animates the transition.
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

  useEffect(() => {
    if (!open || !onDismiss) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onDismiss])

  if (phase === 'exited') return null

  const transform =
    phase === 'entering' || phase === 'exiting' ? offTransform(direction) : 'none'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex,
        background: 'var(--color-surface-app, #F4F4F4)',
        transform,
        transition: `transform ${DURATION_MS}ms ${EASE}`,
        display: 'flex',
        flexDirection: 'column',
        willChange: 'transform',
        boxShadow:
          direction === 'right'
            ? '-12px 0 24px rgba(0,0,0,0.12)'
            : '0 -12px 24px rgba(0,0,0,0.12)',
      }}
      onTransitionEnd={(e) => {
        // Only react to our own transform transition (not transitions inside children).
        if (e.target !== e.currentTarget) return
        if (phase === 'exiting') {
          setPhase('exited')
          onExited?.()
        }
      }}
    >
      {children}
    </div>
  )
}
