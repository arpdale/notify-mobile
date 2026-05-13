import logoLockup from '@david-richard/notify-ds/assets/logo-notify-lockup.svg?url'

type Props = {
  version?: string
  /**
   * If true, render the dark background only — no logo, no version string.
   * Used as a backdrop for modal overlays (e.g. NewVersionAvailable).
   */
  bareBackground?: boolean
}

export function Splash({
  version = 'Version 3.6.222-build. 1483',
  bareBackground,
}: Props) {
  return (
    <div
      style={{
        flex: 1,
        position: 'relative',
        background: '#000000',
        overflow: 'hidden',
        color: '#FFFFFF',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Decorative line-art placeholders — the production splash uses
          hand-drawn food illustrations not shipped in @david-richard/notify-ds.
          The simple stroke glyphs here suggest the scatter without inventing
          art. */}
      <BurgerGlyph
        color="#EF2149"
        style={{ position: 'absolute', top: 56, left: -8, opacity: 0.85 }}
      />
      <HotdogGlyph
        color="#FFFFFF"
        style={{ position: 'absolute', top: 96, right: -16, opacity: 0.55 }}
      />
      <DonutGlyph
        color="#FFFFFF"
        style={{ position: 'absolute', bottom: 80, right: 32, opacity: 0.45 }}
      />
      <CupcakeGlyph
        color="#FFFFFF"
        style={{ position: 'absolute', bottom: 240, left: 24, opacity: 0.4 }}
      />

      {!bareBackground && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -110%)',
              width: '70%',
              maxWidth: 240,
            }}
          >
            <img
              src={logoLockup}
              alt="Qu Notify"
              style={{
                width: '100%',
                filter: 'invert(1) brightness(2)',
              }}
            />
          </div>

          <BrandCard />

          <span
            style={{
              position: 'absolute',
              bottom: 24,
              left: 0,
              right: 0,
              textAlign: 'center',
              fontSize: 11,
              color: '#6B7280',
            }}
          >
            {version}
          </span>
        </>
      )}
    </div>
  )
}

function BrandCard() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '52%',
        left: '50%',
        transform: 'translate(-50%, 0) rotate(-5deg)',
        width: 168,
        height: 168,
        borderRadius: 12,
        background: '#EF2149',
        boxShadow: '0 24px 60px rgba(239,33,73,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <BurgerGlyph color="#40CCF2" size={120} />
    </div>
  )
}

type GlyphProps = {
  color: string
  size?: number
  style?: React.CSSProperties
}

function BurgerGlyph({ color, size = 96, style }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden
    >
      <path d="M16 56c0-18 20-32 44-32s44 14 44 32" />
      <circle cx="44" cy="44" r="2" />
      <circle cx="68" cy="40" r="2" />
      <circle cx="84" cy="48" r="2" />
      <path d="M14 68h92" />
      <path d="M14 78c12 0 12-6 24-6s12 6 24 6 12-6 24-6 12 6 20 6" />
      <path d="M14 88h92" />
      <path d="M18 92c0 10 10 14 42 14s42-4 42-14" />
    </svg>
  )
}

function HotdogGlyph({ color, size = 96, style }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden
    >
      <rect x="20" y="42" width="80" height="36" rx="18" />
      <rect x="26" y="36" width="68" height="22" rx="11" />
      <path d="M30 48l4 4M40 44l4 4M50 48l4 4M60 44l4 4M70 48l4 4M80 44l4 4" />
    </svg>
  )
}

function DonutGlyph({ color, size = 76, style }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden
    >
      <circle cx="60" cy="60" r="38" />
      <circle cx="60" cy="60" r="14" />
      <path d="M40 44l4 4M76 50l-4 4M82 80l-4-4M48 84l-4 4M44 64l4-2" />
    </svg>
  )
}

function CupcakeGlyph({ color, size = 70, style }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden
    >
      <path d="M30 60h60l-8 38H38Z" />
      <path d="M30 60c0-14 12-26 30-26s30 12 30 26" />
      <path d="M60 22v8M52 28l4 6M68 28l-4 6" />
    </svg>
  )
}
