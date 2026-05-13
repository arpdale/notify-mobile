import { useState } from 'react'
import { PhoneFrame } from './PhoneFrame'
import { SignIn } from './screens/SignIn'
import { Dashboard } from './screens/Dashboard'
import { ResetPassword } from './screens/ResetPassword'
import { TwoStepVerification } from './screens/TwoStepVerification'
import { ChooseNewPassword } from './screens/ChooseNewPassword'
import { Tills } from './screens/Tills'
import { CheckSearch } from './screens/CheckSearch'
import { MenuOverlay } from './screens/MenuOverlay'
import { EnableFaceId } from './screens/EnableFaceId'
import { ThanksgivingFeast } from './screens/ThanksgivingFeast'

const ROUTES = [
  // Auth (Tier 1)
  { value: 'sign-in', label: 'Sign In', group: 'Auth' },
  { value: 'reset-password', label: 'Reset Password', group: 'Auth' },
  { value: 'two-step-verification', label: 'Two-Step Verification', group: 'Auth' },
  { value: 'choose-new-password', label: 'Choose New Password', group: 'Auth' },
  {
    value: 'choose-new-password-error',
    label: 'Choose New Password (toast)',
    group: 'Auth',
  },
  { value: 'enable-face-id', label: 'Enable Face ID (modal)', group: 'Auth' },

  // Dashboard (Tier 1 + 2)
  { value: 'dashboard', label: 'Dashboard — Sales', group: 'Dashboard' },
  {
    value: 'dashboard-store-productivity',
    label: 'Dashboard — Store / Productivity',
    group: 'Dashboard',
  },
  {
    value: 'dashboard-store-network',
    label: 'Dashboard — Store / Network',
    group: 'Dashboard',
  },
  {
    value: 'dashboard-store-kitchen',
    label: 'Dashboard — Store / Kitchen',
    group: 'Dashboard',
  },
  { value: 'dashboard-error', label: 'Dashboard — Error', group: 'Dashboard' },
  {
    value: 'dashboard-error-toast',
    label: 'Dashboard — Error + Toast',
    group: 'Dashboard',
  },

  // Interior (Tier 2)
  { value: 'tills-open', label: 'Tills — Open (empty)', group: 'Interior' },
  { value: 'tills-closed', label: 'Tills — Closed', group: 'Interior' },
  { value: 'tills-reconciled', label: 'Tills — Reconciled (empty)', group: 'Interior' },
  { value: 'check-search', label: 'Check Search', group: 'Interior' },
  { value: 'thanksgiving-feast', label: 'Thanksgiving Feast', group: 'Interior' },
  { value: 'menu-overlay', label: 'Menu Overlay (sheet)', group: 'Interior' },
] as const

type Route = (typeof ROUTES)[number]['value']

function App() {
  const [route, setRoute] = useState<Route>('sign-in')
  const [menuOpen, setMenuOpen] = useState(false)
  const goto = (r: Route) => {
    setMenuOpen(false)
    setRoute(r)
  }

  return (
    <>
      <DevNav route={route} setRoute={goto} />
      <PhoneFrame>
        {route === 'sign-in' && (
          <SignIn
            onSignIn={() => goto('two-step-verification')}
            onForgotPassword={() => goto('reset-password')}
          />
        )}
        {route === 'reset-password' && (
          <ResetPassword
            onBack={() => goto('sign-in')}
            onSendCode={() => goto('choose-new-password')}
          />
        )}
        {route === 'two-step-verification' && (
          <TwoStepVerification
            onBack={() => goto('sign-in')}
            onContinue={() => goto('enable-face-id')}
          />
        )}
        {route === 'choose-new-password' && (
          <ChooseNewPassword
            onBack={() => goto('sign-in')}
            onSubmit={() => goto('dashboard')}
          />
        )}
        {route === 'choose-new-password-error' && (
          <ChooseNewPassword
            onBack={() => goto('sign-in')}
            onSubmit={() => goto('dashboard')}
            errorMessage="Ooops, we are having problems"
          />
        )}
        {route === 'enable-face-id' && (
          <>
            <SignIn onSignIn={() => undefined} />
            <EnableFaceId
              open
              onEnable={() => goto('dashboard')}
              onSkip={() => goto('dashboard')}
            />
          </>
        )}

        {route === 'dashboard' && (
          <>
            <Dashboard onMenu={() => setMenuOpen(true)} />
            <MenuOverlay
              open={menuOpen}
              onDismiss={() => setMenuOpen(false)}
              onCheckSearch={() => goto('check-search')}
              onLogOut={() => goto('sign-in')}
            />
          </>
        )}
        {route === 'dashboard-store-productivity' && (
          <Dashboard
            initialTab="Store"
            initialStoreSubTab="Productivity"
            onMenu={() => setMenuOpen(true)}
          />
        )}
        {route === 'dashboard-store-network' && (
          <Dashboard
            initialTab="Store"
            initialStoreSubTab="Network"
            onMenu={() => setMenuOpen(true)}
          />
        )}
        {route === 'dashboard-store-kitchen' && (
          <Dashboard
            initialTab="Store"
            initialStoreSubTab="Kitchen"
            onMenu={() => setMenuOpen(true)}
          />
        )}
        {route === 'dashboard-error' && (
          <Dashboard state="error" onRefresh={() => goto('dashboard')} />
        )}
        {route === 'dashboard-error-toast' && (
          <Dashboard
            state="error"
            onRefresh={() => goto('dashboard')}
            errorMessage="Ooops, we are having problems"
          />
        )}

        {route === 'tills-open' && (
          <Tills onBack={() => goto('dashboard')} defaultTab="Open" />
        )}
        {route === 'tills-closed' && (
          <Tills
            onBack={() => goto('dashboard')}
            defaultTab="Closed"
            onReconcile={() => goto('tills-reconciled')}
          />
        )}
        {route === 'tills-reconciled' && (
          <Tills onBack={() => goto('dashboard')} defaultTab="Reconciled" />
        )}
        {route === 'check-search' && (
          <CheckSearch onBack={() => goto('dashboard')} />
        )}
        {route === 'thanksgiving-feast' && (
          <ThanksgivingFeast onBack={() => goto('dashboard')} />
        )}
        {route === 'menu-overlay' && (
          <>
            <Dashboard />
            <MenuOverlay
              open
              onDismiss={() => goto('dashboard')}
              onCheckSearch={() => goto('check-search')}
              onLogOut={() => goto('sign-in')}
            />
          </>
        )}
      </PhoneFrame>
    </>
  )
}

function DevNav({ route, setRoute }: { route: Route; setRoute: (r: Route) => void }) {
  const groups = ROUTES.reduce<Record<string, typeof ROUTES[number][]>>((acc, r) => {
    acc[r.group] ??= []
    acc[r.group].push(r)
    return acc
  }, {})

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
        maxWidth: 260,
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
        {Object.entries(groups).map(([group, routes]) => (
          <optgroup key={group} label={group}>
            {routes.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}

export default App
