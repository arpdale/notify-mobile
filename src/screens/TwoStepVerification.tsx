import { useState } from 'react'
import { Button } from '@david-richard/notify-ds'
import { AuthShell } from '../components/AuthShell'
import { CodeInput } from '../components/CodeInput'

const CODE_LENGTH = 6

type Props = {
  onBack: () => void
  /** Fires with the entered code so callers can branch on demo / error codes */
  onContinue: (code: string) => void
}

export function TwoStepVerification({ onBack, onContinue }: Props) {
  const [code, setCode] = useState('')
  const canSubmit = code.length === CODE_LENGTH

  return (
    <AuthShell
      onBack={onBack}
      heading="Two Step Verification"
      description="Enter the 6-digit security code from your authenticator app"
      requiredHint="*Required Field"
      cta={
        <Button
          variant="primary"
          size="lg"
          state={canSubmit ? 'active' : 'inactive'}
          disabled={!canSubmit}
          onClick={() => onContinue(code)}
        >
          Continue
        </Button>
      }
      supportHint={
        <>
          Having trouble signing in?
          <br />
          Contact Support
        </>
      }
    >
      <label
        style={{
          display: 'block',
          marginBottom: 8,
          fontFamily: "'Red Hat Text', 'Inter', sans-serif",
          fontSize: 18,
          fontWeight: 500,
          color: '#000',
        }}
      >
        Code<span style={{ color: '#EF2149' }}>*</span>
      </label>
      <CodeInput
        value={code}
        onChange={setCode}
        length={CODE_LENGTH}
        autoFocus
        ariaLabel="Verification code digit"
      />
    </AuthShell>
  )
}
