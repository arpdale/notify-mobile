import { lazy, Suspense, useEffect, useState } from 'react'
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
import { Splash } from './screens/Splash'
import { NewVersionAvailable } from './screens/NewVersionAvailable'
import { NetworkError } from './screens/NetworkError'
import { Notifications } from './screens/Notifications'
import { Inventory } from './screens/Inventory'
import { StoresPicker } from './screens/StoresPicker'
import { FilterByDate } from './screens/FilterByDate'
import { SlideIn } from './components/SlideIn'

// Chart detail screens are lazy-loaded so recharts (~150kB gz) ships in its
// own chunk, off the auth + dashboard critical path.
const NetSales = lazy(() =>
  import('./screens/NetSales').then((m) => ({ default: m.NetSales })),
)
const Payments = lazy(() =>
  import('./screens/Payments').then((m) => ({ default: m.Payments })),
)
const Discounts = lazy(() =>
  import('./screens/Discounts').then((m) => ({ default: m.Discounts })),
)
const Taxes = lazy(() => import('./screens/Taxes').then((m) => ({ default: m.Taxes })))
const ServiceCharges = lazy(() =>
  import('./screens/ServiceCharges').then((m) => ({ default: m.ServiceCharges })),
)

function DetailFallback() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-surface-app, #F4F4F4)',
      }}
    >
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          color: '#9CA3AF',
        }}
      >
        Loading…
      </span>
    </div>
  )
}

/** Routes that occupy the base layer of the app. These swap instantly
 *  (no animation) — auth flow + bottom-nav homes. */
type BaseRoute =
  | 'splash'
  | 'sign-in'
  | 'reset-password'
  | 'two-step-verification'
  | 'choose-new-password'
  | 'enable-face-id'
  | 'dashboard'
  | 'dashboard-error'
  | 'network-error'
  | 'inventory'

/** Routes that push on top of the base layer with a right-to-left slide. */
type PushRoute =
  | 'tills'
  | 'check-search'
  | 'thanksgiving-feast'
  | 'net-sales'
  | 'payments'
  | 'discounts'
  | 'taxes'
  | 'service-charges'

const TILE_ROUTES: Partial<Record<DashboardTile, PushRoute>> = {
  'Net Sales': 'net-sales',
  Payments: 'payments',
  Discounts: 'discounts',
  'Service Charges': 'service-charges',
  Tills: 'tills',
}

const DEMO_CODES = {
  DASHBOARD_ERROR: '000000',
  NETWORK_ERROR: '111111',
  CHOOSE_PASSWORD_ERROR: '000000',
} as const

const SPLASH_VERSION_PROMPT_DELAY_MS = 1200

function App() {
  const [baseRoute, setBaseRoute] = useState<BaseRoute>('splash')
  const [push, setPush] = useState<PushRoute | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [storesPickerOpen, setStoresPickerOpen] = useState(false)
  const [dateFilterOpen, setDateFilterOpen] = useState(false)
  const [versionPromptOpen, setVersionPromptOpen] = useState(false)
  const [chooseNewPasswordError, setChooseNewPasswordError] = useState<
    string | undefined
  >(undefined)

  useEffect(() => {
    if (baseRoute !== 'splash') return
    const t = setTimeout(() => setVersionPromptOpen(true), SPLASH_VERSION_PROMPT_DELAY_MS)
    return () => clearTimeout(t)
  }, [baseRoute])

  const goto = (r: BaseRoute) => {
    setMenuOpen(false)
    setNotificationsOpen(false)
    setStoresPickerOpen(false)
    setDateFilterOpen(false)
    setVersionPromptOpen(false)
    setPush(null)
    setBaseRoute(r)
  }

  const onTileClick = (tile: DashboardTile) => {
    const target = TILE_ROUTES[tile]
    if (target) setPush(target)
  }

  const handleTwoFactor = (code: string) => {
    if (code === DEMO_CODES.DASHBOARD_ERROR) goto('dashboard-error')
    else if (code === DEMO_CODES.NETWORK_ERROR) goto('network-error')
    else goto('enable-face-id')
  }

  const handleChooseNewPassword = (code: string) => {
    if (code === DEMO_CODES.CHOOSE_PASSWORD_ERROR) {
      setChooseNewPasswordError('Ooops, we are having problems')
    } else {
      setChooseNewPasswordError(undefined)
      goto('dashboard')
    }
  }

  const openStoresPicker = () => setStoresPickerOpen(true)
  const closeStoresPicker = () => setStoresPickerOpen(false)
  const openDateFilter = () => setDateFilterOpen(true)
  const closeDateFilter = () => setDateFilterOpen(false)
  const closePush = () => setPush(null)

  return (
    <div
      style={{
        height: '100svh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-surface-app, #F4F4F4)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* ── Base layer ──────────────────────────────────────────── */}
      {baseRoute === 'splash' && (
        <>
          <Splash />
          <NewVersionAvailable
            open={versionPromptOpen}
            onUpdate={() => goto('sign-in')}
            onLater={() => goto('sign-in')}
          />
        </>
      )}

      {baseRoute === 'sign-in' && (
        <SignIn
          onSignIn={() => goto('two-step-verification')}
          onForgotPassword={() => goto('reset-password')}
        />
      )}
      {baseRoute === 'reset-password' && (
        <ResetPassword
          onBack={() => goto('sign-in')}
          onSendCode={() => {
            setChooseNewPasswordError(undefined)
            goto('choose-new-password')
          }}
        />
      )}
      {baseRoute === 'two-step-verification' && (
        <TwoStepVerification
          onBack={() => goto('sign-in')}
          onContinue={handleTwoFactor}
        />
      )}
      {baseRoute === 'choose-new-password' && (
        <ChooseNewPassword
          onBack={() => goto('sign-in')}
          onSubmit={handleChooseNewPassword}
          errorMessage={chooseNewPasswordError}
        />
      )}
      {baseRoute === 'enable-face-id' && (
        <>
          <SignIn onSignIn={() => undefined} />
          <EnableFaceId
            open
            onEnable={() => goto('dashboard')}
            onSkip={() => goto('dashboard')}
          />
        </>
      )}

      {baseRoute === 'dashboard' && (
        <Dashboard
          onMenu={() => setMenuOpen(true)}
          onInventory={() => goto('inventory')}
          onTileClick={onTileClick}
          onNotifications={() => setNotificationsOpen(true)}
          onPickStores={openStoresPicker}
          onPickDate={openDateFilter}
        />
      )}
      {baseRoute === 'inventory' && (
        <Inventory
          onDashboard={() => goto('dashboard')}
          onMenu={() => setMenuOpen(true)}
          onNotifications={() => setNotificationsOpen(true)}
          onPickStores={openStoresPicker}
          onPickDate={openDateFilter}
        />
      )}
      {baseRoute === 'dashboard-error' && (
        <Dashboard
          state="error"
          onRefresh={() => goto('dashboard')}
          errorMessage="Ooops, we are having problems"
        />
      )}
      {baseRoute === 'network-error' && (
        <NetworkError onRefresh={() => goto('sign-in')} />
      )}

      {/* ── Push overlays (slide in from right over the base) ──── */}
      <SlideIn open={push === 'tills'} direction="right" onDismiss={closePush}>
        <Tills
          onBack={closePush}
          defaultTab="Closed"
          onPickStores={openStoresPicker}
          onPickDate={openDateFilter}
        />
      </SlideIn>
      <SlideIn
        open={push === 'check-search'}
        direction="right"
        onDismiss={closePush}
      >
        <CheckSearch onBack={closePush} />
      </SlideIn>
      <SlideIn
        open={push === 'thanksgiving-feast'}
        direction="right"
        onDismiss={closePush}
      >
        <ThanksgivingFeast onBack={closePush} />
      </SlideIn>
      <SlideIn open={push === 'net-sales'} direction="right" onDismiss={closePush}>
        <Suspense fallback={<DetailFallback />}>
          <NetSales
            onBack={closePush}
            onPickStores={openStoresPicker}
            onPickDate={openDateFilter}
          />
        </Suspense>
      </SlideIn>
      <SlideIn open={push === 'payments'} direction="right" onDismiss={closePush}>
        <Suspense fallback={<DetailFallback />}>
          <Payments
            onBack={closePush}
            onPickStores={openStoresPicker}
            onPickDate={openDateFilter}
          />
        </Suspense>
      </SlideIn>
      <SlideIn open={push === 'discounts'} direction="right" onDismiss={closePush}>
        <Suspense fallback={<DetailFallback />}>
          <Discounts
            onBack={closePush}
            onPickStores={openStoresPicker}
            onPickDate={openDateFilter}
          />
        </Suspense>
      </SlideIn>
      <SlideIn open={push === 'taxes'} direction="right" onDismiss={closePush}>
        <Suspense fallback={<DetailFallback />}>
          <Taxes
            onBack={closePush}
            onPickStores={openStoresPicker}
            onPickDate={openDateFilter}
          />
        </Suspense>
      </SlideIn>
      <SlideIn
        open={push === 'service-charges'}
        direction="right"
        onDismiss={closePush}
      >
        <Suspense fallback={<DetailFallback />}>
          <ServiceCharges
            onBack={closePush}
            onPickStores={openStoresPicker}
            onPickDate={openDateFilter}
          />
        </Suspense>
      </SlideIn>

      {/* ── Full-screen modals (slide up from bottom) ──────────── */}
      <SlideIn
        open={storesPickerOpen}
        direction="bottom"
        onDismiss={closeStoresPicker}
      >
        <StoresPicker onBack={closeStoresPicker} onApply={closeStoresPicker} />
      </SlideIn>
      <SlideIn
        open={dateFilterOpen}
        direction="bottom"
        onDismiss={closeDateFilter}
      >
        <FilterByDate onDismiss={closeDateFilter} />
      </SlideIn>

      {/* ── Sheet overlays (existing BottomSheet pattern) ─────── */}
      <MenuOverlay
        open={menuOpen}
        onDismiss={() => setMenuOpen(false)}
        onCheckSearch={() => {
          setMenuOpen(false)
          setPush('check-search')
        }}
        onLogOut={() => goto('sign-in')}
      />
      <Notifications
        open={notificationsOpen}
        onDismiss={() => setNotificationsOpen(false)}
      />
    </div>
  )
}

export default App
