import { useState } from 'react'
import { PhoneFrame } from './PhoneFrame'
import { SignIn } from './screens/SignIn'
import { Dashboard } from './screens/Dashboard'
import { ResetPassword } from './screens/ResetPassword'
import { TwoStepVerification } from './screens/TwoStepVerification'
import { ChooseNewPassword } from './screens/ChooseNewPassword'

const ROUTES = [
  { value: 'sign-in', label: 'Sign In' },
  { value: 'reset-password', label: 'Reset Password' },
  { value: 'two-step-verification', label: 'Two-Step Verification' },
  { value: 'choose-new-password', label: 'Choose New Password' },
  { value: 'choose-new-password-error', label: 'Choose New Password (toast)' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'dashboard-error', label: 'Dashboard — Error' },
  { value: 'dashboard-error-toast', label: 'Dashboard — Error + Toast' },
] as const

type Route = (typeof ROUTES)[number]['value']

function App() {
  const [route, setRoute] = useState<Route>('sign-in')

  return (
    <>
      <DevNav route={route} setRoute={setRoute} />
      <PhoneFrame>
        {route === 'sign-in' && (
          <SignIn
            onSignIn={() => setRoute('two-step-verification')}
            onForgotPassword={() => setRoute('reset-password')}
          />
        )}
        {route === 'reset-password' && (
          <ResetPassword
            onBack={() => setRoute('sign-in')}
            onSendCode={() => setRoute('choose-new-password')}
          />
        )}
        {route === 'two-step-verification' && (
          <TwoStepVerification
            onBack={() => setRoute('sign-in')}
            onContinue={() => setRoute('dashboard')}
          />
        )}
        {route === 'choose-new-password' && (
          <ChooseNewPassword
            onBack={() => setRoute('sign-in')}
            onSubmit={() => setRoute('dashboard')}
          />
        )}
        {route === 'choose-new-password-error' && (
          <ChooseNewPassword
            onBack={() => setRoute('sign-in')}
            onSubmit={() => setRoute('dashboard')}
            errorMessage="Ooops, we are having problems"
          />
        )}
        {route === 'dashboard' && <Dashboard />}
        {route === 'dashboard-error' && (
          <Dashboard state="error" onRefresh={() => setRoute('dashboard')} />
        )}
        {route === 'dashboard-error-toast' && (
          <Dashboard
            state="error"
            onRefresh={() => setRoute('dashboard')}
            errorMessage="Ooops, we are having problems"
          />
        )}
      </PhoneFrame>
    </>
  )
}

function DevNav({ route, setRoute }: { route: Route; setRoute: (r: Route) => void }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        left: 16,
        zIndex: 10,
        background: 'rgba(255,255,255,0.92)',
        borderRadius: 12,
        padding: '8px 12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
        fontFamily: "'Inter', sans-serif",
        fontSize: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <span style={{ color: '#6B7280', fontWeight: 600, letterSpacing: 0.4 }}>
        PREVIEW
      </span>
      <select
        value={route}
        onChange={(e) => setRoute(e.target.value as Route)}
        style={{
          fontFamily: 'inherit',
          fontSize: 13,
          padding: '6px 8px',
          border: '1px solid #DEDEDE',
          borderRadius: 8,
          background: '#fff',
          color: '#000',
        }}
      >
        {ROUTES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default App
