/** Loads the on-disk fixture and re-exports it as typed arrays.
 *
 *  The JSON file is the only data source today. When a real backend lands,
 *  swap this module's body for a fetch + cache layer — the selectors don't
 *  need to know. */

import fixtureJson from './fixture.json'
import type {
  CategoryDayFact,
  Check,
  Fixture,
  LaborDayFact,
  SalesHourFact,
  Store,
  StoreOpsFact,
  TillEvent,
} from './types'

const fixture = fixtureJson as unknown as Fixture

export const FIXTURE_ANCHOR_DATE = fixture.anchorDate
export const FIXTURE_GENERATED_AT = fixture.generatedAt

export const STORES: Store[] = fixture.stores
export const SALES_HOURLY: SalesHourFact[] = fixture.salesHourly
export const LABOR_DAILY: LaborDayFact[] = fixture.laborDaily
export const CATEGORY_DAILY: CategoryDayFact[] = fixture.categoryDaily
export const STORE_OPS: StoreOpsFact[] = fixture.storeOps
export const TILLS: TillEvent[] = fixture.tills
export const CHECKS: Check[] = fixture.checks
