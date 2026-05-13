type Props = {
  message: string
  variant?: 'error' | 'success'
}

const VARIANT_BG: Record<NonNullable<Props['variant']>, string> = {
  error: '#EF2149',
  success: '#16A34A',
}

export function Toast({ message, variant = 'error' }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 24,
        padding: '16px 20px',
        background: VARIANT_BG[variant],
        color: '#FFFFFF',
        borderRadius: 9999,
        fontFamily: "'Inter', sans-serif",
        fontSize: 16,
        fontWeight: 400,
        boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
      }}
    >
      {message}
    </div>
  )
}
