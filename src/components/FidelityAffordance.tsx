import { useEffect, useRef } from 'react'
import { toggleFidelity } from '../lib/fidelity'

/**
 * FidelityAffordance — hidden gestures to flip the prototype between hi-fi and
 * wireframe during a client review, with nothing visible on screen for the
 * client to notice. Mount once, near the app root.
 *
 * Three ways in (all toggle the same store):
 *   1. Touch  — triple-tap the bottom-left corner (an invisible 40×40 hotspot
 *               tucked where no UI lives, below the centered bottom-nav pill).
 *   2. Desktop— type the sequence "lofi" anywhere outside a text field.
 *   3. Link   — open with `?fidelity=wireframe` (handled in lib/fidelity.ts).
 *
 * The flip itself is the only feedback — the whole UI changes — so there's no
 * confirmation toast that could tip off the room.
 */

const SEQUENCE = 'lofi'
const TAPS_TO_TOGGLE = 3
const TAP_WINDOW_MS = 700

export function FidelityAffordance() {
  // Desktop: typed key sequence.
  useEffect(() => {
    let buffer = ''
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) {
        return
      }
      if (e.key.length !== 1) return
      buffer = (buffer + e.key.toLowerCase()).slice(-SEQUENCE.length)
      if (buffer === SEQUENCE) {
        buffer = ''
        toggleFidelity()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Touch / mouse: rapid multi-tap on the corner hotspot.
  const taps = useRef({ count: 0, last: 0 })
  function onHotspot() {
    const now = Date.now()
    const s = taps.current
    s.count = now - s.last < TAP_WINDOW_MS ? s.count + 1 : 1
    s.last = now
    if (s.count >= TAPS_TO_TOGGLE) {
      s.count = 0
      toggleFidelity()
    }
  }

  return (
    <button
      type="button"
      aria-hidden="true"
      tabIndex={-1}
      onClick={onHotspot}
      style={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: 40,
        height: 40,
        margin: 0,
        padding: 0,
        border: 'none',
        background: 'transparent',
        opacity: 0,
        zIndex: 2147483647,
        cursor: 'default',
        WebkitTapHighlightColor: 'transparent',
      }}
    />
  )
}
