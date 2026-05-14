import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { SignIn } from './screens/SignIn'
import { Dashboard, type DashboardTile } from './screens/Dashboard'
import { ResetPassword } from './screens/ResetPassword'
import { TwoStepVerification } from './screens/TwoStepVerification'
import { ChooseNewPassword } from './screens/ChooseNewPassword'
import { Tills } from './screens/Tills'
import { CheckSearch } from './screens/CheckSearch'
import { MenuOverlay, type MenuItemId } from './screens/MenuOverlay'
import { Forecast } from './screens/Forecast'
import { Settings } from './screens/Settings'
import { Analyze } from './screens/Analyze'
import {
  DigitalChannels,
  KitchenIntelligence,
  ProductTour,
} from './screens/menuTargets'
import { EnableFaceId } from './screens/EnableFaceId'
import { ThanksgivingFeast } from './screens/ThanksgivingFeast'
import { Splash } from './screens/Splash'
import { NewVersionAvailable } from './screens/NewVersionAvailable'
import { NetworkError } from './screens/NetworkError'
import { Notifications } from './screens/Notifications'
import { Inventory } from './screens/Inventory'
import { Leaderboards } from './screens/Leaderboards'
import { StoresPicker } from './screens/StoresPicker'
import { FilterByDate } from './screens/FilterByDate'
import { SlideIn } from './components/SlideIn'
import { DEFAULT_SELECTED_STORE_IDS, formatStoreLabel } from './lib/stores'
import {
  DEFAULT_FILTER,
  deserializeFilter,
  formatPillLabel,
  serializeFilter,
  type DateFilter,
} from './lib/dateFilter'

const STORES_LS_KEY = 'notify-selected-store-ids'
const FILTER_LS_KEY = 'notify-date-filter'

function loadSelectedStoreIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORES_LS_KEY)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.every((v) => typeof v === 'string')) {
        return new Set(parsed)
      }
    }
  } catch {
    // localStorage unavailable / parse failure — fall through to defaults
  }
  return new Set(DEFAULT_SELECTED_STORE_IDS)
}

function loadDateFilter(): DateFilter {
  try {
    const raw = localStorage.getItem(FILTER_LS_KEY)
    if (raw) {
      const parsed = deserializeFilter(raw)
      if (parsed) return parsed
    }
  } catch {
    // ignore
  }
  return DEFAULT_FILTER
}

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
 *  (no animation) — auth flow + bottom-nav homes + menu destinations. */
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
  // Menu-target pages — each is reached by tapping a menu item, which
  // closes the drawer with a slide-out animation while the new base
  // mounts behind it.
  | 'kitchen-intelligence'
  | 'settings'
  | 'forecast'
  | 'digital-channels'
  | 'checks-search'
  | 'leaderboards'
  | 'analyze'
  | 'product-tour'

/** Routes that push on top of the base layer with a right-to-left slide. */
type PushRoute =
  | 'tills'
  | 'thanksgiving-feast'
  | 'net-sales'
  | 'payments'
  | 'discounts'
  | 'taxes'
  | 'service-charges'

/** Map base routes back to the menu-item id so MenuOverlay can bold the
 *  active page when reopened. */
const ROUTE_TO_MENU_ITEM: Partial<Record<BaseRoute, MenuItemId>> = {
  'kitchen-intelligence': 'kitchen-intelligence',
  settings: 'settings',
  forecast: 'forecast',
  'digital-channels': 'digital-channels',
  'checks-search': 'checks-search',
  leaderboards: 'leaderboards',
  analyze: 'analyze',
  'product-tour': 'product-tour',
}

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

  // Store selection lives at the App level — every screen with a context
  // bar reads the same N, and the picker writes back into the same set.
  // Persisted to localStorage so a refresh doesn't reset the user's choice.
  const [selectedStoreIds, setSelectedStoreIds] = useState<Set<string>>(
    loadSelectedStoreIds,
  )
  useEffect(() => {
    try {
      localStorage.setItem(STORES_LS_KEY, JSON.stringify([...selectedStoreIds]))
    } catch {
      // ignore quota / private-mode errors
    }
  }, [selectedStoreIds])

  const storeLabel = formatStoreLabel(selectedStoreIds)

  // Date filter — same pattern as stores. App owns the filter; the picker
  // sheet is fully controlled. dateLabel feeds every ContextBar consumer.
  const [dateFilter, setDateFilter] = useState<DateFilter>(loadDateFilter)
  useEffect(() => {
    try {
      localStorage.setItem(FILTER_LS_KEY, serializeFilter(dateFilter))
    } catch {
      // ignore
    }
  }, [dateFilter])

  // Today is captured once per App mount. A long-lived session that crosses
  // midnight would render stale labels — acceptable for the proto; a real
  // app would refresh on visibility change.
  const today = useMemo(() => new Date(), [])
  const dateLabel = formatPillLabel(dateFilter, today)

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
          onDevSkip={() => goto('dashboard')}
        />
      )}
      {baseRoute === 'reset-password' && (
        <ResetPassword
          onBack={() => goto('sign-in')}
          onSendCode={() => {
            setChooseNewPasswordError(undefined)
            goto('choose-new-password')
          }}
          onDevSkip={() => goto('dashboard')}
        />
      )}
      {baseRoute === 'two-step-verification' && (
        <TwoStepVerification
          onBack={() => goto('sign-in')}
          onContinue={handleTwoFactor}
          onDevSkip={() => goto('dashboard')}
        />
      )}
      {baseRoute === 'choose-new-password' && (
        <ChooseNewPassword
          onBack={() => goto('sign-in')}
          onSubmit={handleChooseNewPassword}
          errorMessage={chooseNewPasswordError}
          onDevSkip={() => goto('dashboard')}
        />
      )}
      {baseRoute === 'enable-face-id' && (
        <>
          <SignIn onSignIn={() => undefined} onDevSkip={() => goto('dashboard')} />
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
          storeLabel={storeLabel}
          dateLabel={dateLabel}
          selectedStoreIds={selectedStoreIds}
          dateFilter={dateFilter}
          today={today}
        />
      )}
      {baseRoute === 'inventory' && (
        <Inventory
          onDashboard={() => goto('dashboard')}
          onMenu={() => setMenuOpen(true)}
          onNotifications={() => setNotificationsOpen(true)}
          onPickStores={openStoresPicker}
          onPickDate={openDateFilter}
          storeLabel={storeLabel}
          dateLabel={dateLabel}
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
        <NetworkError
          onRefresh={() => goto('sign-in')}
          onDevSkip={() => goto('dashboard')}
        />
      )}

      {/* Menu-target base routes — each is reached by tapping a menu link.
       *  The transition is: target mounts behind the still-open menu, then
       *  the menu's BottomSheet animates out (drawer slides down + scrim
       *  fades) while the new base sits underneath. */}
      {baseRoute === 'forecast' && (
        <Forecast
          onDashboard={() => goto('dashboard')}
          onInventory={() => goto('inventory')}
          onMenu={() => setMenuOpen(true)}
          selectedStoreIds={selectedStoreIds}
          onPickStore={openStoresPicker}
        />
      )}
      {baseRoute === 'settings' && (
        <Settings
          onDashboard={() => goto('dashboard')}
          onInventory={() => goto('inventory')}
          onMenu={() => setMenuOpen(true)}
          preferredStoreCount={selectedStoreIds.size}
          onPickStores={openStoresPicker}
        />
      )}
      {baseRoute === 'digital-channels' && (
        <DigitalChannels
          onDashboard={() => goto('dashboard')}
          onInventory={() => goto('inventory')}
          onMenu={() => setMenuOpen(true)}
        />
      )}
      {baseRoute === 'kitchen-intelligence' && (
        <KitchenIntelligence
          onDashboard={() => goto('dashboard')}
          onInventory={() => goto('inventory')}
          onMenu={() => setMenuOpen(true)}
        />
      )}
      {baseRoute === 'analyze' && (
        <Analyze
          onDashboard={() => goto('dashboard')}
          onInventory={() => goto('inventory')}
          onMenu={() => setMenuOpen(true)}
        />
      )}
      {baseRoute === 'product-tour' && (
        <ProductTour
          onDashboard={() => goto('dashboard')}
          onInventory={() => goto('inventory')}
          onMenu={() => setMenuOpen(true)}
        />
      )}
      {baseRoute === 'checks-search' && (
        <CheckSearch
          onDashboard={() => goto('dashboard')}
          onInventory={() => goto('inventory')}
          onMenu={() => setMenuOpen(true)}
        />
      )}
      {baseRoute === 'leaderboards' && (
        <Leaderboards
          onDashboard={() => goto('dashboard')}
          onInventory={() => goto('inventory')}
          onMenu={() => setMenuOpen(true)}
          selectedStoreIds={selectedStoreIds}
          dateFilter={dateFilter}
          today={today}
          storeLabel={storeLabel}
          dateLabel={dateLabel}
          onPickStores={openStoresPicker}
          onPickDate={openDateFilter}
        />
      )}

      {/* ── Push overlays (slide in from right over the base) ──── */}
      <SlideIn open={push === 'tills'} direction="right" onDismiss={closePush}>
        <Tills
          onBack={closePush}
          defaultTab="Closed"
          onPickStores={openStoresPicker}
          onPickDate={openDateFilter}
          storeLabel={storeLabel}
          dateLabel={dateLabel}
        />
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
            storeLabel={storeLabel}
          dateLabel={dateLabel}
          />
        </Suspense>
      </SlideIn>
      <SlideIn open={push === 'payments'} direction="right" onDismiss={closePush}>
        <Suspense fallback={<DetailFallback />}>
          <Payments
            onBack={closePush}
            onPickStores={openStoresPicker}
            onPickDate={openDateFilter}
            storeLabel={storeLabel}
          dateLabel={dateLabel}
          />
        </Suspense>
      </SlideIn>
      <SlideIn open={push === 'discounts'} direction="right" onDismiss={closePush}>
        <Suspense fallback={<DetailFallback />}>
          <Discounts
            onBack={closePush}
            onPickStores={openStoresPicker}
            onPickDate={openDateFilter}
            storeLabel={storeLabel}
          dateLabel={dateLabel}
          />
        </Suspense>
      </SlideIn>
      <SlideIn open={push === 'taxes'} direction="right" onDismiss={closePush}>
        <Suspense fallback={<DetailFallback />}>
          <Taxes
            onBack={closePush}
            onPickStores={openStoresPicker}
            onPickDate={openDateFilter}
            storeLabel={storeLabel}
          dateLabel={dateLabel}
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
            storeLabel={storeLabel}
          dateLabel={dateLabel}
          />
        </Suspense>
      </SlideIn>

      {/* ── Full-screen modals (slide up from bottom) ──────────── */}
      <SlideIn
        open={storesPickerOpen}
        direction="bottom"
        onDismiss={closeStoresPicker}
      >
        <StoresPicker
          onBack={closeStoresPicker}
          selectedIds={selectedStoreIds}
          onChange={setSelectedStoreIds}
        />
      </SlideIn>
      <SlideIn
        open={dateFilterOpen}
        direction="bottom"
        onDismiss={closeDateFilter}
      >
        <FilterByDate
          filter={dateFilter}
          onChange={setDateFilter}
          today={today}
          onDismiss={closeDateFilter}
        />
      </SlideIn>

      {/* ── Sheet overlays (existing BottomSheet pattern) ─────── */}
      <MenuOverlay
        open={menuOpen}
        onDismiss={() => setMenuOpen(false)}
        current={ROUTE_TO_MENU_ITEM[baseRoute]}
        // Each menu link calls goto() — the target base route mounts behind
        // the still-open drawer, and the drawer animates out simultaneously.
        // This matches the production app's "target appears, menu peels away"
        // transition.
        onKitchenIntelligence={() => goto('kitchen-intelligence')}
        onSettings={() => goto('settings')}
        onForecast={() => goto('forecast')}
        onDigitalChannels={() => goto('digital-channels')}
        onChecksSearch={() => goto('checks-search')}
        // Leaderboards is only meaningful with 2+ stores selected. When the
        // user has just one store the comparison view collapses to a single
        // row — hide the entry rather than render a degenerate page.
        onLeaderboards={
          selectedStoreIds.size > 1 ? () => goto('leaderboards') : undefined
        }
        onAnalyze={() => goto('analyze')}
        onProductTour={() => goto('product-tour')}
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
