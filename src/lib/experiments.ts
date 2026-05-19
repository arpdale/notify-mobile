import { useSyncExternalStore } from 'react'

/** Registry of experimental capabilities. Each key gates one or more
 *  surfaces in the prototype — entry points, routes, and any UI the IDEA
 *  introduces. Adding a new IDEA is a one-line change here plus
 *  `useExperiment(key)` gates at every surface the IDEA touches.
 *
 *  Convention: prefer to ship new IDEAs with `default: false` so main flows
 *  stay clean. Flip to `true` once the design has converged. */
export const EXPERIMENTS = {
  'whats-new': {
    label: "What's New (IDEA-3760)",
    description:
      'Post-update toast + persistent page for in-app release awareness.',
    default: true,
  },
  'restore-last-view': {
    label: 'Restore last view',
    description:
      'On launch, open to whatever filter combo and screen the user had last session. Zero new UI.',
    default: true,
  },
  'saved-views': {
    label: 'Saved Views',
    description:
      'Star current filter combo as a saved view. Apply or set as default from any picker.',
    default: true,
  },
} as const

export type ExperimentKey = keyof typeof EXPERIMENTS
type State = Record<ExperimentKey, boolean>

const STORAGE_KEY = 'notify-experiments'

function defaults(): State {
  const out = {} as State
  for (const key of Object.keys(EXPERIMENTS) as ExperimentKey[]) {
    out[key] = EXPERIMENTS[key].default
  }
  return out
}

function readStored(): Partial<State> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') {
      const out: Partial<State> = {}
      for (const key of Object.keys(EXPERIMENTS) as ExperimentKey[]) {
        const v = (parsed as Record<string, unknown>)[key]
        if (typeof v === 'boolean') out[key] = v
      }
      return out
    }
  } catch {
    // ignore
  }
  return {}
}

/** URL overrides — `?exp=key1,key2` turns on, `?exp-off=key3` turns off.
 *  Useful for sharing a prototype link in a specific state without
 *  walking someone through the debug panel. Persisted to localStorage
 *  on first read so a reload keeps the chosen state. */
function readUrlOverrides(): Partial<State> {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const out: Partial<State> = {}
  for (const raw of params.get('exp')?.split(',') ?? []) {
    const key = raw.trim()
    if (key in EXPERIMENTS) out[key as ExperimentKey] = true
  }
  for (const raw of params.get('exp-off')?.split(',') ?? []) {
    const key = raw.trim()
    if (key in EXPERIMENTS) out[key as ExperimentKey] = false
  }
  return out
}

function persist(s: State) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  } catch {
    // ignore
  }
}

let state: State = (() => {
  const initial: State = { ...defaults(), ...readStored(), ...readUrlOverrides() }
  // Write the merged state back so URL overrides persist on next load.
  persist(initial)
  return initial
})()

const listeners = new Set<() => void>()

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

function getSnapshot(): State {
  return state
}

function notify() {
  for (const fn of listeners) fn()
}

export function setExperiment(key: ExperimentKey, value: boolean) {
  if (state[key] === value) return
  state = { ...state, [key]: value }
  persist(state)
  notify()
}

export function resetExperiments() {
  state = defaults()
  persist(state)
  notify()
}

/** Subscribe to a single flag. Re-renders only on that flag's changes. */
export function useExperiment(key: ExperimentKey): boolean {
  const snap = useSyncExternalStore(subscribe, getSnapshot)
  return snap[key]
}

/** Synchronous read for boot-time initializers (useState defaults) where
 *  hook subscription isn't appropriate. Don't use this in render bodies —
 *  reach for useExperiment so the UI reacts to flips. */
export function getExperiment(key: ExperimentKey): boolean {
  return state[key]
}

/** Full state + setters for the debug panel. */
export function useExperiments() {
  const snap = useSyncExternalStore(subscribe, getSnapshot)
  return { state: snap, setExperiment, resetExperiments }
}
