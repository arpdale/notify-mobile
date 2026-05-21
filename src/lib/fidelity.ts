import { useSyncExternalStore } from 'react'

/** Prototype visual fidelity.
 *
 *  'hifi'      — the real, branded design system (default).
 *  'wireframe' — low-fi review skin. Driven entirely by the DS: setting
 *                data-fidelity="wireframe" on <html> activates the
 *                [data-fidelity="wireframe"] token block in notify-ds/tokens.css
 *                (grayscale, flat, uniform radius, one neutral typeface).
 *
 *  Requires @david-richard/notify-ds >= 1.5.0 (the version that ships the
 *  wireframe token block). On older DS versions the attribute is set but has
 *  no visual effect.
 *
 *  Mirrors the store shape in ./experiments.ts: useSyncExternalStore +
 *  localStorage persistence + a `?fidelity=` URL override. */
export type Fidelity = 'hifi' | 'wireframe'

const STORAGE_KEY = 'notify-fidelity'
const DEFAULT: Fidelity = 'hifi'

function isFidelity(v: unknown): v is Fidelity {
  return v === 'hifi' || v === 'wireframe'
}

function readStored(): Fidelity | null {
  try {
    return isFidelity(localStorage.getItem(STORAGE_KEY))
      ? (localStorage.getItem(STORAGE_KEY) as Fidelity)
      : null
  } catch {
    return null
  }
}

/** URL override — `?fidelity=wireframe` (or `hifi`). Lets you hand someone a
 *  link that's already flipped, matching the `?exp=` convention. Persisted on
 *  first read so a reload keeps the chosen state. */
function readUrlOverride(): Fidelity | null {
  if (typeof window === 'undefined') return null
  const v = new URLSearchParams(window.location.search).get('fidelity')
  return isFidelity(v) ? v : null
}

function persist(f: Fidelity) {
  try {
    localStorage.setItem(STORAGE_KEY, f)
  } catch {
    // ignore
  }
}

/** Reflect state onto the document root, where the DS token block keys off it. */
function apply(f: Fidelity) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (f === 'wireframe') root.setAttribute('data-fidelity', 'wireframe')
  else root.removeAttribute('data-fidelity')
}

let state: Fidelity = (() => {
  const initial = readUrlOverride() ?? readStored() ?? DEFAULT
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

function getSnapshot(): Fidelity {
  return state
}

function notifyListeners() {
  for (const fn of listeners) fn()
}

export function setFidelity(f: Fidelity) {
  if (state === f) return
  state = f
  persist(f)
  apply(f)
  notifyListeners()
}

export function toggleFidelity() {
  setFidelity(state === 'wireframe' ? 'hifi' : 'wireframe')
}

export function getFidelity(): Fidelity {
  return state
}

/** Call once at boot (before first render) to reflect the persisted / URL
 *  state onto the DOM so the app paints in the right fidelity immediately. */
export function initFidelity() {
  apply(state)
}

/** Subscribe to fidelity in a component (e.g. a debug panel switch). */
export function useFidelity(): Fidelity {
  return useSyncExternalStore(subscribe, getSnapshot)
}
