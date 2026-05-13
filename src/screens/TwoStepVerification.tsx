import { useState } from 'react'
import { Button, InputField } from '@david-richard/notify-ds'
import logoQu from '@david-richard/notify-ds/assets/logo-qu.svg?url'
import { ChevronLeftIcon } from '../icons'

type Props = {
  onBack: () => void
  onContinue: () => void
}

export function TwoStepVerification({ onBack, onContinue }: Props) {
  const [code, setCode] = useState('')
  const canSubmit = code.trim().length > 0

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        background: '#FFFFFF',
        padding: '56px 24px 24px',
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
        <ChevronLeftIcon size={18} />
        <span style={{ textDecoration: 'underline' }}>Back to sign in</span>
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
        Two Step Verification
      </h1>
      <p
        style={{
          margin: '0 0 24px',
          fontFamily: "'Inter', sans-serif",
          fontSize: 14,
          color: '#6B7280',
          lineHeight: 1.5,
        }}
      >
        Enter the 6-digit security code from your authenticator app
      </p>

      <InputField
        label="Code"
        required
        type="default"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
      />

      <p style={{ margin: '12px 0 0', fontSize: 12, color: '#6B7280' }}>
        *Required Field
      </p>

      <div
        style={{
          marginTop: 24,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button
          variant="primary"
          size="lg"
          state={canSubmit ? 'active' : 'inactive'}
          disabled={!canSubmit}
          onClick={onContinue}
        >
          Continue
        </Button>
      </div>

      <p
        style={{
          margin: '20px 0 0',
          textAlign: 'center',
          fontFamily: "'Inter', sans-serif",
          fontSize: 14,
          color: '#6B7280',
          lineHeight: 1.5,
        }}
      >
        Having trouble signing in?
        <br />
        Contact Support
      </p>

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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 14,
            color: '#000',
          }}
        >
          <span>Powered by</span>
          <img src={logoQu} alt="Qu" style={{ height: 18 }} />
        </div>
        <span style={{ fontSize: 11, color: '#9CA3AF' }}>
          Version 3.6.222-build. 1483
        </span>
      </div>
    </div>
  )
}
