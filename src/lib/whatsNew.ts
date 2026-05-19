import { useCallback, useEffect, useState } from 'react'

/** Release manifest for the What's New surface. Bundled in the build for the
 *  prototype; in production this would be fetched (so release content can
 *  ship independently of the app binary). Most-recent first.
 *
 *  `material` is the PM-set boolean David flagged: only material releases
 *  fire the post-update toast and earn a NEW pill. Non-material entries
 *  (bug fixes, internal plumbing) are skipped by the gate. The page itself
 *  still shows the last N material releases regardless of version delta.
 *
 *  `deepLink` is the BaseRoute string from App.tsx — the page passes it
 *  back up to the router on card tap. Keep these in sync. */
/** Icon key for a release card thumbnail. Resolved to a DS icon component
 *  inside the WhatsNew screen — keeps this manifest a pure data module. */
export type ReleaseIcon =
  | 'filter'
  | 'dashboard'
  | 'bell'
  | 'trending-up'
  | 'calendar'
  | 'package'

export type Release = {
  version: string
  date: string
  title: string
  summary: string
  material: boolean
  icon: ReleaseIcon
  deepLink?: string
}

export const CURRENT_BUILD_VERSION = '1.2.0'

export const RELEASES: Release[] = [
  {
    version: '1.2.0',
    date: 'May 18',
    title: 'Saved Views',
    summary:
      'Star any combination of stores and dates as your default. Open the app to the view you actually use.',
    material: true,
    icon: 'filter',
    deepLink: 'dashboard',
  },
  {
    version: '1.1.9',
    date: 'May 7',
    title: 'Leaderboards 2.0',
    summary:
      'Redesigned ranking page with store filters and a cleaner comparison row. Find your top performers faster.',
    material: true,
    icon: 'dashboard',
    deepLink: 'leaderboards',
  },
  {
    version: '1.1.8',
    date: 'Apr 22',
    title: 'Alerts feed',
    summary:
      'Notifications now scroll like a feed instead of stacking in a modal. Older alerts stay reachable.',
    material: true,
    icon: 'bell',
    deepLink: 'dashboard',
  },
  {
    version: '1.1.7',
    date: 'Apr 9',
    title: 'Forecast accuracy improvements',
    summary:
      'Internal model tuning for end-of-day projections. No UI changes; numbers are just better.',
    material: false,
    icon: 'trending-up',
  },
  {
    version: '1.1.6',
    date: 'Mar 27',
    title: 'Multi-store date filters',
    summary:
      'Date filter now applies across every selected store in one go. No more per-store toggling.',
    material: true,
    icon: 'calendar',
    deepLink: 'dashboard',
  },
  {
    version: '1.1.5',
    date: 'Mar 12',
    title: 'Kitchen Intelligence',
    summary:
      'Dark-surface drilldown for prep timing and station load. Live in the menu drawer.',
    material: true,
    icon: 'package',
    deepLink: 'kitchen-intelligence',
  },
]

const LAST_SEEN_KEY = 'notify-last-seen-version'
const SEEN_PAGE_KEY = 'notify-whats-new-page-seen-at'

/** Strict semver-ish compare for x.y.z strings. Returns -1, 0, or 1. */
export function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map((n) => parseInt(n, 10) || 0)
  const pb = b.split('.').map((n) => parseInt(n, 10) || 0)
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const da = pa[i] ?? 0
    const db = pb[i] ?? 0
    if (da < db) return -1
    if (da > db) return 1
  }
  return 0
}

function readLastSeen(): string {
  try {
    return localStorage.getItem(LAST_SEEN_KEY) ?? '0.0.0'
  } catch {
    return '0.0.0'
  }
}

function writeLastSeen(v: string) {
  try {
    localStorage.setItem(LAST_SEEN_KEY, v)
  } catch {
    // ignore
  }
}

function readPageSeenAt(): string | null {
  try {
    return localStorage.getItem(SEEN_PAGE_KEY)
  } catch {
    return null
  }
}

function writePageSeenAt(v: string) {
  try {
    localStorage.setItem(SEEN_PAGE_KEY, v)
  } catch {
    // ignore
  }
}

/** Releases strictly newer than `since`, in newest-first order. */
export function releasesSince(since: string, releases = RELEASES): Release[] {
  return releases.filter((r) => compareVersions(r.version, since) > 0)
}

/** The single source of truth for "should the toast fire and the drawer pip
 *  show NEW?" — there's at least one material release newer than the version
 *  this device last acknowledged.
 *
 *  Drawer NEW pip and toast both read this. Page visit clears it. */
export function hasMaterialUnseen(
  lastSeen: string,
  releases = RELEASES,
): boolean {
  return releasesSince(lastSeen, releases).some((r) => r.material)
}

export function useWhatsNew() {
  const [lastSeen, setLastSeen] = useState<string>(() => readLastSeen())
  const [pageSeenAt, setPageSeenAt] = useState<string | null>(() => readPageSeenAt())

  const unseenMaterial = hasMaterialUnseen(lastSeen)
  const featured = releasesSince(lastSeen).find((r) => r.material) ?? RELEASES[0]

  /** Visible on the page: last 6 material releases regardless of delta. */
  const pageReleases = RELEASES.filter((r) => r.material).slice(0, 6)

  const markVersionSeen = useCallback(() => {
    writeLastSeen(CURRENT_BUILD_VERSION)
    setLastSeen(CURRENT_BUILD_VERSION)
  }, [])

  const markPageVisited = useCallback(() => {
    const now = new Date().toISOString()
    writePageSeenAt(now)
    setPageSeenAt(now)
    markVersionSeen()
  }, [markVersionSeen])

  /** Dev affordance — wipes both keys so the toast fires again. Wired to a
   *  long-press on the drawer entry in the prototype. */
  const resetForDemo = useCallback(() => {
    try {
      localStorage.removeItem(LAST_SEEN_KEY)
      localStorage.removeItem(SEEN_PAGE_KEY)
    } catch {
      // ignore
    }
    setLastSeen('0.0.0')
    setPageSeenAt(null)
  }, [])

  // Defensive: another tab / debug tools mutating the keys should reflect here.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LAST_SEEN_KEY) setLastSeen(e.newValue ?? '0.0.0')
      if (e.key === SEEN_PAGE_KEY) setPageSeenAt(e.newValue)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return {
    unseenMaterial,
    featured,
    pageReleases,
    lastSeen,
    pageSeenAt,
    markVersionSeen,
    markPageVisited,
    resetForDemo,
  }
}
