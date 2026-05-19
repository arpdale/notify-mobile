import { useSyncExternalStore } from 'react'
import type { DateFilter } from './dateFilter'

/** A bookmarked filter combination plus the screen + tabs the user was on
 *  when they saved it. Applying a saved view restores all of it: filters,
 *  base route, and L1/L2 tab state. One view can be marked default; on
 *  boot the app opens to that view (when saved-views flag is on).
 *
 *  Naming defaults to a generated description ("5 Stores · This Week") to
 *  skip the friction of a naming dialog on save. Future iteration: tap to
 *  rename. Location fields are optional so older views (or views saved
 *  from a non-Dashboard screen) still apply cleanly. */
export type SavedViewLocation = {
  /** BaseRoute string — e.g. 'dashboard', 'inventory', 'leaderboards'. */
  screen?: string
  /** Dashboard primary tab — 'Sales' | 'Labor' | 'Store' | 'Product'. */
  dashboardTab?: string
  /** Store sub-tab — 'Productivity' | 'Network' | 'Kitchen'. */
  storeSubTab?: string
}

export type SavedView = {
  id: string
  name: string
  storeIds: string[]
  dateFilter: DateFilter
  /** Captured location at save time. Optional for backward compat with
   *  pre-tab-capture saves; applying treats absent fields as "leave alone." */
  location?: SavedViewLocation
  isDefault: boolean
  createdAt: number
}

const STORAGE_KEY = 'notify-saved-views'

function readStorage(): SavedView[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isSavedView)
  } catch {
    return []
  }
}

function isSavedView(v: unknown): v is SavedView {
  if (!v || typeof v !== 'object') return false
  const r = v as Record<string, unknown>
  return (
    typeof r.id === 'string' &&
    typeof r.name === 'string' &&
    Array.isArray(r.storeIds) &&
    typeof r.dateFilter === 'object' &&
    r.dateFilter !== null &&
    typeof r.isDefault === 'boolean'
  )
}

function persist(views: SavedView[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(views))
  } catch {
    // ignore
  }
}

let state: SavedView[] = readStorage()
const listeners = new Set<() => void>()

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}
function getSnapshot(): SavedView[] {
  return state
}
function notify() {
  for (const fn of listeners) fn()
}

function setState(next: SavedView[]) {
  state = next
  persist(state)
  notify()
}

function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

/** Auto-name generator. Matches the ContextBar's pill vocabulary so users
 *  see the same words ("5 Stores · This Week") in the save action that they
 *  see in the pills they're saving. */
export function describeView(
  storeIds: Set<string>,
  filter: DateFilter,
  storeNameById: (id: string) => string | undefined,
): string {
  let storeLabel: string
  if (storeIds.size === 0) storeLabel = 'No stores'
  else if (storeIds.size === 1) {
    const [id] = storeIds
    storeLabel = storeNameById(id) ?? '1 Store'
  } else storeLabel = `${storeIds.size} Stores`

  const dateLabel = formatFilterShort(filter)
  return `${storeLabel} · ${dateLabel}`
}

function formatFilterShort(f: DateFilter): string {
  if (f.mode === 'Day') return f.period === 'yesterday' ? 'Yesterday' : 'Today'
  if (f.mode === 'Week') return f.period === 'last-week' ? 'Last Week' : 'This Week'
  if (f.mode === 'Month') return f.period === 'last-month' ? 'Last Month' : 'This Month'
  return 'Custom'
}

/** True when a saved view matches the user's current axes exactly. Drives
 *  the filled-vs-outlined star icon on the ContextBar and the "active" row
 *  highlight in the saved-views strip. */
export function viewMatches(
  view: SavedView,
  storeIds: Set<string>,
  filter: DateFilter,
): boolean {
  if (view.storeIds.length !== storeIds.size) return false
  for (const id of view.storeIds) if (!storeIds.has(id)) return false
  const a = view.dateFilter
  return (
    a.mode === filter.mode &&
    a.period === filter.period &&
    (a.customDate ?? null) === (filter.customDate ?? null) &&
    a.compareOn === filter.compareOn &&
    (a.compare ?? null) === (filter.compare ?? null)
  )
}

/** Add the current state as a new saved view. Idempotent — if an existing
 *  view already matches on filters, returns that one instead of creating a
 *  duplicate. `location` captures screen + tab state so applying the view
 *  later restores where the user was, not just what they were filtering. */
export function saveView(
  storeIds: Set<string>,
  filter: DateFilter,
  name: string,
  location?: SavedViewLocation,
): SavedView {
  const existing = state.find((v) => viewMatches(v, storeIds, filter))
  if (existing) return existing
  const view: SavedView = {
    id: newId(),
    name,
    storeIds: [...storeIds],
    dateFilter: filter,
    location,
    isDefault: false,
    createdAt: Date.now(),
  }
  setState([view, ...state])
  return view
}

export function deleteView(id: string) {
  setState(state.filter((v) => v.id !== id))
}

/** Mark one view as default, clearing the flag on all others. Passing the
 *  current default's id toggles it off (no default). */
export function setDefaultView(id: string) {
  const current = state.find((v) => v.isDefault)
  const turningOff = current?.id === id
  setState(
    state.map((v) => ({
      ...v,
      isDefault: turningOff ? false : v.id === id,
    })),
  )
}

export function renameView(id: string, name: string) {
  setState(state.map((v) => (v.id === id ? { ...v, name } : v)))
}

/** Synchronous reader for boot-time initializers (useState defaults). */
export function getDefaultView(): SavedView | null {
  return state.find((v) => v.isDefault) ?? null
}

/** Reactive hook for components that need to render the list and write to it. */
export function useSavedViews() {
  const snap = useSyncExternalStore(subscribe, getSnapshot)
  return {
    views: snap,
    saveView,
    deleteView,
    setDefaultView,
    renameView,
  }
}
