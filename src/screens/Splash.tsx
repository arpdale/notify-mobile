import type { CSSProperties, ReactNode } from 'react'

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
            <QuMark width={220} fill="#FFFFFF" />
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

/** Inline copy of @david-richard/notify-ds/assets/logo-qu.svg so the
 *  recolorable letterforms (originally `fill="currentColor"`) can sit on
 *  the dark splash background. The cyan top stripe is preserved exactly.
 *  Path data lifted verbatim from the DS asset; if the DS ever ships an
 *  inline-able React component we can drop this. */
function QuMark({ width = 200, fill = '#000000' }: { width?: number; fill?: string }) {
  const height = (width * 31) / 52
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 52 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Qu"
      role="img"
    >
      <path
        d="M13.1486 18.1501H13.1373C11.8028 18.1501 10.5496 17.633 9.60346 16.6914C8.65509 15.7476 8.13122 14.4898 8.12671 13.1531C8.12445 11.8141 8.64154 10.5563 9.5854 9.60796C10.5293 8.65733 11.787 8.13572 13.126 8.13121H13.1373C14.4695 8.13121 15.725 8.65055 16.6711 9.5899C17.6195 10.5338 18.1433 11.7915 18.1456 13.1305C18.1501 14.4695 17.6308 15.7272 16.6869 16.6756C15.7431 17.6217 14.4876 18.1478 13.1486 18.1501ZM26.2768 13.1079C26.2678 9.59893 24.8949 6.3022 22.4088 3.82739C19.9204 1.35259 16.6056 -0.0067489 13.1079 2.51968e-05C9.59895 0.0067993 6.30447 1.38194 3.82741 3.86804C1.35035 6.35639 -0.00898741 9.65764 4.47226e-05 13.1689C0.00681882 16.6779 1.38196 19.9746 3.86806 22.4494C6.34738 24.9197 9.63733 26.2768 13.1373 26.2768H13.1689C14.0992 26.2745 15.0115 26.1752 15.9011 25.9855C18.3353 29.0541 22.0926 30.9667 26.1955 30.9735V22.8446C25.0258 22.8423 23.9329 22.4313 23.0681 21.7381C25.1478 19.3423 26.2836 16.3143 26.2768 13.1079Z"
        fill={fill}
      />
      <path
        d="M40.218 26.2158C33.7216 26.2158 28.4355 20.932 28.4355 14.4356V10.5654H36.5645V14.4356C36.5645 16.4475 38.2038 18.0891 40.218 18.0891C41.1934 18.0891 42.1125 17.7098 42.8034 17.0188C43.4921 16.3279 43.8715 15.4111 43.8715 14.4334V10.5654H52.0004V14.4311C52.0004 17.5788 50.7743 20.5368 48.5501 22.7633C46.3259 24.9897 43.3657 26.2158 40.2202 26.2158H40.218Z"
        fill={fill}
      />
      <path
        d="M51.9873 0.428978H28.4473V8.12436H51.9873V0.428978Z"
        fill="#41CCF2"
      />
    </svg>
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
