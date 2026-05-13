import { useState } from 'react'
import { Button, InputField } from '@david-richard/notify-ds'
import logoLockup from '@david-richard/notify-ds/assets/logo-notify-lockup.svg?url'
import logoQu from '@david-richard/notify-ds/assets/logo-qu.svg?url'

type Props = {
  onSignIn: () => void
  onForgotPassword?: () => void
  /** Dev shortcut — clicking the Powered-by-Qu lockup fires this. */
  onDevSkip?: () => void
}

export function SignIn({ onSignIn, onForgotPassword, onDevSkip }: Props) {
  const [username, setUsername] = useState('myemail@gmail.com')
  const [password, setPassword] = useState('demo')

  const canSubmit = username.trim().length > 0 && password.trim().length > 0

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        background: '#FFFFFF',
        padding: '64px 24px 24px',
      }}
    >
      <div style={{ marginBottom: 32 }}>
        <p
          style={{
            margin: 0,
            fontFamily: "'Red Hat Text', 'Inter', sans-serif",
            fontSize: 22,
            fontWeight: 500,
            color: '#000',
          }}
        >
          Sign In to
        </p>
        <img
          src={logoLockup}
          alt="Qu Notify"
          style={{ height: 36, marginTop: 8 }}
        />
      </div>

      <p
        style={{
          margin: '0 0 20px',
          fontFamily: "'Inter', sans-serif",
          fontSize: 14,
          color: '#6B7280',
        }}
      >
        Sign in to continue
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <InputField
          label="Username"
          required
          type="default"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="you@example.com"
        />
        <InputField
          label="Password"
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      <a
        href="#"
        onClick={(e) => {
          e.preventDefault()
          onForgotPassword?.()
        }}
        style={{
          alignSelf: 'flex-end',
          marginTop: 12,
          color: '#339FB8',
          fontFamily: "'Red Hat Text', 'Inter', sans-serif",
          fontSize: 14,
          fontWeight: 500,
          textDecoration: 'underline',
        }}
      >
        Forgot Password?
      </a>

      <p
        style={{
          margin: '16px 0 0',
          fontSize: 12,
          color: '#6B7280',
        }}
      >
        *Required Fields
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
          onClick={onSignIn}
        >
          Sign In
        </Button>
      </div>

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
        <span style={{ fontSize: 11, color: '#9CA3AF' }}>
          Version 3.6.222-build. 1483
        </span>
      </div>
    </div>
  )
}
