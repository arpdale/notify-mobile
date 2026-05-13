import { useState } from 'react'
import { Button, InputField } from '@david-richard/notify-ds'
import logoQu from '@david-richard/notify-ds/assets/logo-qu.svg?url'
import { ChevronLeftIcon } from '../icons'
import { Toast } from '../components/Toast'

type Props = {
  onBack: () => void
  onSubmit: () => void
  /** Recipient email displayed in the description (best-effort placeholder) */
  emailHint?: string
  /** If set, renders the error toast variant pinned to the bottom */
  errorMessage?: string
}

export function ChooseNewPassword({
  onBack,
  onSubmit,
  emailHint = 'veryloooooongemail@long.com',
  errorMessage,
}: Props) {
  const [code, setCode] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')

  const canSubmit =
    code.trim().length > 0 &&
    next.length > 0 &&
    confirm.length > 0 &&
    next === confirm

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
        Choose a New Password
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
        Enter the 6-digit verification code sent to [{emailHint}], then create
        your new password.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
          onClick={onSubmit}
        >
          Save And Continue
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
        Didn't get the code?
        <br />
        Check your junk folder, or try again
        <br />
        with a different username
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

      {errorMessage ? <Toast message={errorMessage} variant="error" /> : null}
    </div>
  )
}
