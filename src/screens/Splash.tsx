import type { CSSProperties, ReactNode } from 'react'
import { QuMark } from '@david-richard/notify-ds'

type Props = {
  version?: string
  /**
   * If true, render the dark background only — no logo, no version string.
   * Used as a backdrop for modal overlays (e.g. NewVersionAvailable).
   */
  bareBackground?: boolean
}

// Splash illustrations live in /public/splash so they're served at the site
// root without a per-file bundler import. Drop replacements straight in
// Finder and Vite picks them up.
const ASSET = {
  hamburgerRed: '/splash/super-hamburger_red.svg',
  hamburgerBlue: '/splash/super-hamburger-blue.svg',
  hotDog: '/splash/hot-dog.svg',
  pizza: '/splash/pizza.svg',
  pastryWhite: '/splash/pastry-white.svg',
  pastryBlue: '/splash/pastry-blue.svg',
  lemonSlice: '/splash/lemon-slice.svg',
} as const

const CARD_RED = '#EF2149'
const CARD_CYAN = '#40CCF2'

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
      {/* ── Top scatter: red burger upper-left, hot dog upper-right ── */}
      <img
        src={ASSET.hamburgerRed}
        alt=""
        aria-hidden
        style={{
          position: 'absolute',
          top: 64,
          left: -16,
          width: 200,
          transform: 'rotate(-8deg)',
        }}
      />
      <img
        src={ASSET.hotDog}
        alt=""
        aria-hidden
        style={{
          position: 'absolute',
          top: 108,
          right: -28,
          width: 210,
          transform: 'rotate(18deg)',
        }}
      />

      {!bareBackground && (
        <>
          {/* Qu mark — same logo as the SignIn footer's "Powered by".
           *  Inlined as SVG so the letterforms can render white on black
           *  while the cyan stripe stays cyan (the asset's stripe is a
           *  hardcoded #41CCF2, the rest is currentColor). */}
          <div
            style={{
              position: 'absolute',
              top: '42%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <QuMark width={220} color="#FFFFFF" />
          </div>

          {/* Small accents floating between the logo and the card pile. */}
          <img
            src={ASSET.pastryWhite}
            alt=""
            aria-hidden
            style={{
              position: 'absolute',
              top: '54%',
              left: 24,
              width: 52,
              opacity: 0.9,
            }}
          />
          <img
            src={ASSET.lemonSlice}
            alt=""
            aria-hidden
            style={{
              position: 'absolute',
              top: '58%',
              left: '58%',
              width: 24,
              opacity: 0.7,
            }}
          />
          <img
            src={ASSET.lemonSlice}
            alt=""
            aria-hidden
            style={{
              position: 'absolute',
              top: '62%',
              left: '74%',
              width: 18,
              opacity: 0.55,
            }}
          />

          {/* ── Card scatter — 4 overlapping tiles, varied rotation ──
           *  Source order = paint order. Back-to-front: red/burger,
           *  cyan/cupcake, cyan/pizza, red/blue-cupcake (front-most). */}
          <Card
            color={CARD_RED}
            rotate={-8}
            style={{ top: '66%', left: '4%' }}
          >
            <img
              src={ASSET.hamburgerBlue}
              alt=""
              aria-hidden
              style={{ width: '88%' }}
            />
          </Card>
          <Card
            color={CARD_CYAN}
            rotate={5}
            style={{ top: '72%', left: '32%' }}
          >
            <img
              src={ASSET.pastryWhite}
              alt=""
              aria-hidden
              style={{ width: '70%' }}
            />
          </Card>
          <Card
            color={CARD_CYAN}
            rotate={-3}
            style={{ top: '66%', left: '57%' }}
          >
            <img
              src={ASSET.pizza}
              alt=""
              aria-hidden
              style={{ width: '88%' }}
            />
          </Card>
          <Card
            color={CARD_RED}
            rotate={18}
            style={{ top: '82%', left: '68%' }}
          >
            <img
              src={ASSET.pastryBlue}
              alt=""
              aria-hidden
              style={{ width: '76%' }}
            />
          </Card>

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

/** Rounded-corner color tile used in the splash card scatter. Children
 *  (typically an SVG) sit centered. Caller positions via `style`. */
function Card({
  color,
  rotate,
  style,
  children,
}: {
  color: string
  rotate: number
  style?: CSSProperties
  children: ReactNode
}) {
  return (
    <div
      style={{
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 16,
        background: color,
        boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
