import type { ReactNode } from 'react'
import logoQu from '@david-richard/notify-ds/assets/logo-qu.svg?url'
import { ChevronLeft } from '@david-richard/notify-ds/icons'

type Props = {
  onBack: () => void
  /** Underlined back-link label */
  backLabel?: string
  /** Red Hat Text 26/500 — appears below the back link */
  heading: string
  /** Inter 14 gray — appears below the heading */
  description?: ReactNode
  /** Form body — inputs go here */
  children: ReactNode
  /** "*Required Field" / "*Required Fields" hint between body and CTA */
  requiredHint?: string
  /** Primary CTA, typically a DS Button. Centered. */
  cta: ReactNode
  /** Multi-line gray text shown below the CTA (e.g. "Contact Support") */
  supportHint?: ReactNode
  /** Optional element rendered last inside the form area — useful for
   *  overlay variants such as the error toast on Choose New Password */
  overlay?: ReactNode
  /** Version string shown above the build label in the footer */
  version?: string
  /** Dev shortcut — clicking the Powered-by-Qu lockup fires this. */
  onDevSkip?: () => void
}

export function AuthShell({
  onBack,
  backLabel = 'Back to sign in',
  heading,
  description,
  children,
  requiredHint,
  cta,
  supportHint,
  overlay,
  version = 'Version 3.6.222-build. 1483',
  onDevSkip,
}: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        background: '#FFFFFF',
        padding: '56px 24px 24px',
        position: 'relative',
      }}
    >
      <button
        type="button"
        onClick={onBack}
        style={{
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: 0,
          border: 0,
          background: 'transparent',
          color: '#000',
          fontFamily: "'Inter', sans-serif",
          fontSize: 14,
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        <ChevronLeft size={18} />
        <span style={{ textDecoration: 'underline' }}>{backLabel}</span>
      </button>

      <h1
        style={{
          margin: '24px 0 12px',
          fontFamily: "'Red Hat Text', 'Inter', sans-serif",
          fontSize: 26,
          fontWeight: 500,
          color: '#000',
        }}
      >
        {heading}
      </h1>
      {description ? (
        <p
          style={{
            margin: '0 0 24px',
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            color: '#6B7280',
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      ) : null}

      {children}

      {requiredHint ? (
        <p style={{ margin: '12px 0 0', fontSize: 12, color: '#6B7280' }}>
          {requiredHint}
        </p>
      ) : null}

      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
        {cta}
      </div>

      {supportHint ? (
        <div
          style={{
            margin: '20px 0 0',
            textAlign: 'center',
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            color: '#6B7280',
            lineHeight: 1.5,
          }}
        >
          {supportHint}
        </div>
      ) : null}

      <div
        style={{
          marginTop: 'auto',
          paddingTop: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <button
          type="button"
          onClick={onDevSkip}
          disabled={!onDevSkip}
          title={onDevSkip ? 'Skip to dashboard (dev)' : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 14,
            color: '#000',
            border: 0,
            background: 'transparent',
            padding: 0,
            cursor: onDevSkip ? 'pointer' : 'default',
            font: 'inherit',
          }}
        >
          <span>Powered by</span>
          <img src={logoQu} alt="Qu" style={{ height: 18 }} />
        </button>
        <span style={{ fontSize: 11, color: '#9CA3AF' }}>{version}</span>
      </div>

      {overlay}
    </div>
  )
}
