import { useState } from 'react'
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

type Route =
  | 'sign-in'
  | 'reset-password'
  | 'two-step-verification'
  | 'choose-new-password'
  | 'enable-face-id'
  | 'dashboard'
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

function App() {
  const [route, setRoute] = useState<Route>('sign-in')
  const [menuOpen, setMenuOpen] = useState(false)
  const goto = (r: Route) => {
    setMenuOpen(false)
    setRoute(r)
  }
  const onTileClick = (tile: DashboardTile) => {
    const target = TILE_ROUTES[tile]
    if (target) goto(target)
  }

  return (
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
