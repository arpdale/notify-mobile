import { useState } from 'react'
import { Button, InputField } from '@david-richard/notify-ds'
import { AuthShell } from '../components/AuthShell'
import { CodeInput } from '../components/CodeInput'
import { Toast } from '../components/Toast'

const CODE_LENGTH = 6

type Props = {
  onBack: () => void
  /** Fires with the entered code so callers can branch on demo / error codes */
  onSubmit: (code: string) => void
  /** Recipient email displayed in the description (best-effort placeholder) */
  emailHint?: string
  /** If set, renders the error toast variant pinned to the bottom */
  errorMessage?: string
  onDevSkip?: () => void
}

export function ChooseNewPassword({
  onBack,
  onSubmit,
  emailHint = 'veryloooooongemail@long.com',
  errorMessage,
  onDevSkip,
}: Props) {
  const [code, setCode] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')

  const canSubmit =
    code.length === CODE_LENGTH &&
    next.length > 0 &&
    confirm.length > 0 &&
    next === confirm

  return (
    <AuthShell
      onBack={onBack}
      onDevSkip={onDevSkip}
      heading="Choose a New Password"
      description={
        <>
          Enter the 6-digit verification code sent to [{emailHint}], then create
          your new password.
        </>
      }
      requiredHint="*Required Field"
      cta={
        <Button
          variant="primary"
          size="lg"
          state={canSubmit ? 'active' : 'inactive'}
          disabled={!canSubmit}
          onClick={() => onSubmit(code)}
        >
          Save And Continue
        </Button>
      }
      supportHint={
        <>
          Didn't get the code?
          <br />
          Check your junk folder, or try again
          <br />
          with a different username
        </>
      }
      overlay={
        errorMessage ? <Toast message={errorMessage} variant="error" /> : null
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
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
            Code<span style={{ color: 'var(--color-destructive,#EF2149)' }}>*</span>
          </label>
          <CodeInput
            value={code}
            onChange={setCode}
            length={CODE_LENGTH}
            error={Boolean(errorMessage)}
            ariaLabel="Verification code digit"
          />
        </div>
        <InputField
          label="New Password"
          required
          type="password"
          autoComplete="new-password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
        />
        <InputField
          label="Confirm New Password"
          required
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>
    </AuthShell>
  )
}
