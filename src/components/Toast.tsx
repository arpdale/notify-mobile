type Props = {
  message: string
  variant?: 'error' | 'success'
  /**
   * - 'floating' (default): full-radius pill with 16px side gutter, sits 24px
   *   above the bottom edge. Used for transient confirmations.
   * - 'attached': full-width bar with only the top corners rounded, flush
   *   with the bottom edge. Used for the dashboard error toast that
   *   visually replaces the bottom nav.
   */
  position?: 'floating' | 'attached'
}

const VARIANT_BG: Record<NonNullable<Props['variant']>, string> = {
  error: '#EF2149',
  success: '#16A34A',
}

export function Toast({ message, variant = 'error', position = 'floating' }: Props) {
  const isAttached = position === 'attached'
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        // Attached pins to the viewport bottom (replaces the bottom nav);
        // floating anchors to its nearest positioned ancestor (e.g. AuthShell)
        // so it sits at the bottom of the screen content, not the page.
        position: isAttached ? 'fixed' : 'absolute',
        zIndex: isAttached ? 15 : undefined,
        left: isAttached ? 0 : 16,
        right: isAttached ? 0 : 16,
        bottom: isAttached ? 0 : 24,
        padding: '16px 20px',
        minHeight: isAttached ? 52 : undefined,
        background: VARIANT_BG[variant],
        color: '#FFFFFF',
        borderRadius: isAttached ? '24px 24px 0 0' : 9999,
        fontFamily: "'Inter', sans-serif",
        fontSize: 16,
        fontWeight: 400,
        boxShadow: isAttached
          ? '0 -4px 12px rgba(0,0,0,0.12)'
          : '0 8px 24px rgba(0,0,0,0.18)',
      }}
    >
      {message}
    </div>
  )
}
