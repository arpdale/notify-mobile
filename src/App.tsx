import { useEffect, useState } from 'react'
import { PhoneFrame } from './PhoneFrame'
import { SignIn } from './screens/SignIn'
import { Dashboard, type DashboardTile } from './screens/Dashboard'
import { ResetPassword } from './screens/ResetPassword'
import { TwoStepVerification } from './screens/TwoStepVerification'
import { ChooseNewPassword } from './screens/ChooseNewPassword'
import { Tills } from './screens/Tills'
import { CheckSearch } from './screens/CheckSearch'
import { MenuOverlay } from './screens/MenuOverlay'
import { EnableFaceId } from './screens/EnableFaceId'
import { ThanksgivingFeast } from './screens/ThanksgivingFeast'
import { NetSales } from './screens/NetSales'
import { Payments } from './screens/Payments'
import { Discounts } from './screens/Discounts'
import { Taxes } from './screens/Taxes'
import { ServiceCharges } from './screens/ServiceCharges'
import { Splash } from './screens/Splash'
import { NewVersionAvailable } from './screens/NewVersionAvailable'
import { NetworkError } from './screens/NetworkError'

type Route =
  | 'splash'
  | 'sign-in'
  | 'reset-password'
  | 'two-step-verification'
  | 'choose-new-password'
  | 'enable-face-id'
  | 'dashboard'
  | 'dashboard-error'
  | 'network-error'
  | 'tills'
  | 'check-search'
  | 'thanksgiving-feast'
  | 'net-sales'
  | 'payments'
  | 'discounts'
  | 'taxes'
  | 'service-charges'

const TILE_ROUTES: Partial<Record<DashboardTile, Route>> = {
  'Net Sales': 'net-sales',
  Payments: 'payments',
  Discounts: 'discounts',
  'Service Charges': 'service-charges',
  Tills: 'tills',
}

/** Demo-only codes wired into 2FA + reset flow to surface error states.
 *  Real auth comes in a later tier; for now these codes let testers
 *  reach Dashboard-error / NetworkError / Choose-new-password-toast
 *  from the running app. */
const DEMO_CODES = {
  /** 2FA: lands the Dashboard error state with toast */
  DASHBOARD_ERROR: '000000',
  /** 2FA: lands the standalone NetworkError screen */
  NETWORK_ERROR: '111111',
  /** Choose New Password: surfaces the error toast variant */
  CHOOSE_PASSWORD_ERROR: '000000',
} as const

const SPLASH_VERSION_PROMPT_DELAY_MS = 1200

function App() {
  const [route, setRoute] = useState<Route>('splash')
  const [menuOpen, setMenuOpen] = useState(false)
  const [versionPromptOpen, setVersionPromptOpen] = useState(false)
  const [chooseNewPasswordError, setChooseNewPasswordError] = useState<
    string | undefined
  >(undefined)

  // Show the New Version Available modal once, shortly after the app lands
  // on Splash. Subsequent visits to /splash don't re-trigger (the cleanup
  // resets the timer, but the prompt is tied to a one-shot user moment).
  useEffect(() => {
    if (route !== 'splash') return
    const t = setTimeout(() => setVersionPromptOpen(true), SPLASH_VERSION_PROMPT_DELAY_MS)
    return () => clearTimeout(t)
  }, [route])

  const goto = (r: Route) => {
    setMenuOpen(false)
    setVersionPromptOpen(false)
    setRoute(r)
  }

  const onTileClick = (tile: DashboardTile) => {
    const target = TILE_ROUTES[tile]
    if (target) goto(target)
  }

  const handleTwoFactor = (code: string) => {
    if (code === DEMO_CODES.DASHBOARD_ERROR) {
      goto('dashboard-error')
    } else if (code === DEMO_CODES.NETWORK_ERROR) {
      goto('network-error')
    } else {
      goto('enable-face-id')
    }
  }

  const handleChooseNewPassword = (code: string) => {
    if (code === DEMO_CODES.CHOOSE_PASSWORD_ERROR) {
      setChooseNewPasswordError('Ooops, we are having problems')
    } else {
      setChooseNewPasswordError(undefined)
      goto('dashboard')
    }
  }

  return (
    <PhoneFrame>
      {route === 'splash' && (
        <>
          <Splash />
          <NewVersionAvailable
            open={versionPromptOpen}
            onUpdate={() => goto('sign-in')}
            onLater={() => goto('sign-in')}
          />
        </>
      )}

      {route === 'sign-in' && (
        <SignIn
          onSignIn={() => goto('two-step-verification')}
          onForgotPassword={() => goto('reset-password')}
        />
      )}
      {route === 'reset-password' && (
        <ResetPassword
          onBack={() => goto('sign-in')}
          onSendCode={() => {
            setChooseNewPasswordError(undefined)
            goto('choose-new-password')
          }}
        />
      )}
      {route === 'two-step-verification' && (
        <TwoStepVerification
          onBack={() => goto('sign-in')}
          onContinue={handleTwoFactor}
        />
      )}
      {route === 'choose-new-password' && (
        <ChooseNewPassword
          onBack={() => goto('sign-in')}
          onSubmit={handleChooseNewPassword}
          errorMessage={chooseNewPasswordError}
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
          <Dashboard onMenu={() => setMenuOpen(true)} onTileClick={onTileClick} />
          <MenuOverlay
            open={menuOpen}
            onDismiss={() => setMenuOpen(false)}
            onCheckSearch={() => goto('check-search')}
            onLogOut={() => goto('sign-in')}
          />
        </>
      )}
      {route === 'dashboard-error' && (
        <Dashboard
          state="error"
          onRefresh={() => goto('dashboard')}
          errorMessage="Ooops, we are having problems"
        />
      )}
      {route === 'network-error' && (
        <NetworkError onRefresh={() => goto('sign-in')} />
      )}

      {route === 'tills' && (
        <Tills onBack={() => goto('dashboard')} defaultTab="Closed" />
      )}
      {route === 'check-search' && <CheckSearch onBack={() => goto('dashboard')} />}
      {route === 'thanksgiving-feast' && (
        <ThanksgivingFeast onBack={() => goto('dashboard')} />
      )}
      {route === 'net-sales' && <NetSales onBack={() => goto('dashboard')} />}
      {route === 'payments' && <Payments onBack={() => goto('dashboard')} />}
      {route === 'discounts' && <Discounts onBack={() => goto('dashboard')} />}
      {route === 'taxes' && <Taxes onBack={() => goto('dashboard')} />}
      {route === 'service-charges' && (
        <ServiceCharges onBack={() => goto('dashboard')} />
      )}
    </PhoneFrame>
  )
}

export default App
