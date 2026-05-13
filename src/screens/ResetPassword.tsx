import { useState } from 'react'
import { Button, InputField } from '@david-richard/notify-ds'
import { AuthShell } from '../components/AuthShell'

type Props = {
  onBack: () => void
  onSendCode: () => void
  onDevSkip?: () => void
}

export function ResetPassword({ onBack, onSendCode, onDevSkip }: Props) {
  const [username, setUsername] = useState('')
  const canSubmit = username.trim().length > 0

  return (
    <AuthShell
      onBack={onBack}
      onDevSkip={onDevSkip}
      heading="Reset Your Password"
      description="Enter your username and we'll send a verification code to the email linked to your account."
      requiredHint="*Required Field"
      cta={
        <Button
          variant="primary"
          size="lg"
          state={canSubmit ? 'active' : 'inactive'}
          disabled={!canSubmit}
          onClick={onSendCode}
        >
          Send Code
        </Button>
      }
      supportHint={
        <>
          Don't remember your username?
          <br />
          Contact Support
        </>
      }
    >
      <InputField
        label="Username"
        required
        type="default"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
    </AuthShell>
  )
}
