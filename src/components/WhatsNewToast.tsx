import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { Badge } from '@david-richard/notify-ds'
import { Close, ChevronDown } from '@david-richard/notify-ds/icons'

type Props = {
  open: boolean
  title: string
  /** Body copy revealed as the user pulls the shade down. */
  summary: string
  onLearnMore: () => void
  onDismiss: () => void
}

const BASE_HEIGHT = 56
const MAX_PULL = 180
const COMMIT_PX = 90 // pull past this and release → open the page
const DISMISS_PX = -36 // push up past this and release → dismiss
const UP_RESIST = 0.45 // overdrag-up resistance factor

/** Slim top banner with a windowshade gesture. Drag down to peek at the
 *  release summary; release past the commit threshold to land on the
 *  What's New page. Drag up to dismiss. Storyboard SB-02. */
export function WhatsNewToast({
  open,
  title,
  summary,
  onLearnMore,
  onDismiss,
}: Props) {
  // Two-phase mount so the spring-in runs on first paint.
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    if (open) {
      const t = requestAnimationFrame(() => setMounted(true))
      return () => cancelAnimationFrame(t)
    }
    setMounted(false)
  }, [open])

  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startYRef = useRef(0)

  if (!open) return null

  const pull = Math.max(0, dragY) // downward distance
  const lift = Math.min(0, dragY) // upward (negative)
  const committing = pull >= COMMIT_PX
  const revealAmount = Math.min(1, pull / COMMIT_PX) // 0..1 for content opacity

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    // Don't start a drag if the user tapped the close button — that has its
    // own handler that calls onDismiss and shouldn't be hijacked.
    const target = e.target as HTMLElement
    if (target.closest('[data-toast-close]')) return
    setDragging(true)
    startYRef.current = e.clientY
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    const raw = e.clientY - startYRef.current
    // Resistance on upward overdrag — feels rubbery instead of disappearing.
    const next = raw < 0 ? Math.max(raw * UP_RESIST, -60) : Math.min(raw, MAX_PULL)
    setDragY(next)
  }

  const finishDrag = () => {
    if (!dragging) return
    setDragging(false)
    if (dragY >= COMMIT_PX) {
      // Snap to a "open" position briefly so the handoff feels intentional
      // rather than the toast just vanishing under the user's finger.
      setDragY(MAX_PULL)
      window.setTimeout(() => {
        onLearnMore()
        setDragY(0)
      }, 90)
      return
    }
    if (dragY <= DISMISS_PX) {
      onDismiss()
      setDragY(0)
      return
    }
    setDragY(0) // spring back
  }

  // Spring-y settle on entry; rubbery rebound on release.
  const SPRING = 'cubic-bezier(0.34, 1.32, 0.55, 1)'

  return (
    <div
      role="status"
      aria-live="polite"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        background: '#1F2329',
        color: '#FFFFFF',
        boxShadow: '0 4px 16px rgba(0,0,0,0.22)',
        height: BASE_HEIGHT + pull,
        overflow: 'hidden',
        touchAction: 'none',
        transform: mounted ? `translateY(${lift}px)` : 'translateY(-100%)',
        transition: dragging
          ? 'none'
          : `transform 320ms ${SPRING}, height 320ms ${SPRING}`,
        cursor: dragging ? 'grabbing' : 'grab',
      }}
    >
      {/* Top row — slim toast content */}
      <div
        style={{
          height: BASE_HEIGHT,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Badge variant="brand">NEW</Badge>
        <span
          style={{
            flex: 1,
            minWidth: 0,
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            fontWeight: 500,
            color: '#FFFFFF',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onLearnMore()
          }}
          style={{
            flex: '0 0 auto',
            border: 0,
            background: 'transparent',
            padding: 0,
            cursor: 'pointer',
            color: '#40CCF2',
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Learn more ›
        </button>
        <button
          type="button"
          aria-label="Dismiss"
          data-toast-close
          onClick={(e) => {
            e.stopPropagation()
            onDismiss()
          }}
          style={{
            flex: '0 0 auto',
            border: 0,
            background: 'transparent',
            padding: 4,
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.7)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Close size={16} />
        </button>
      </div>

      {/* Shade panel — grows as the user pulls down. Summary fades in;
       *  past the commit threshold the affordance flips to "Release to open." */}
      <div
        style={{
          padding: '0 16px',
          opacity: revealAmount,
          transform: `translateY(${(1 - revealAmount) * -6}px)`,
          transition: dragging ? 'none' : `opacity 200ms ${SPRING}`,
        }}
      >
        <p
          style={{
            margin: '4px 0 12px',
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            lineHeight: 1.45,
            color: 'rgba(255,255,255,0.82)',
          }}
        >
          {summary}
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            color: committing ? '#40CCF2' : 'rgba(255,255,255,0.55)',
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
          }}
        >
          <span>{committing ? 'Release to open' : 'Keep pulling'}</span>
          <ChevronDown size={14} />
        </div>
      </div>

      {/* Drag handle — the affordance that tells you the shade pulls down. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 4,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.35)',
          }}
        />
      </div>
    </div>
  )
}
