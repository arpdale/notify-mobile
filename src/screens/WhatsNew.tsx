import { useEffect, type ReactNode } from 'react'
import { ScreenHeader, Badge } from '@david-richard/notify-ds'
import {
  Bell,
  Calendar,
  ChevronRight,
  Dashboard as DashboardIcon,
  Filter,
  Package,
  TrendingUp,
} from '@david-richard/notify-ds/icons'
import { AppBottomNav, type AppNavValue } from '../components/AppBottomNav'
import {
  compareVersions,
  type Release,
  type ReleaseIcon,
} from '../lib/whatsNew'

const ICON_MAP: Record<ReleaseIcon, ReactNode> = {
  filter: <Filter size={26} />,
  dashboard: <DashboardIcon size={26} />,
  bell: <Bell size={26} />,
  'trending-up': <TrendingUp size={26} />,
  calendar: <Calendar size={26} />,
  package: <Package size={26} />,
}

type Props = {
  releases: Release[]
  lastSeen: string
  onPageVisited: () => void
  onDashboard: () => void
  onInventory: () => void
  onMenu: () => void
  /** Card tap — receives the deepLink string (a BaseRoute) so App.tsx can
   *  goto() into the feature. Cards without a deepLink don't fire this. */
  onOpenRelease: (route: string) => void
}

export function WhatsNew({
  releases,
  lastSeen,
  onPageVisited,
  onDashboard,
  onInventory,
  onMenu,
  onOpenRelease,
}: Props) {
  // Clear the unread pip as soon as the page renders. "Visited == seen" is
  // the right tradeoff for the prototype (simpler than scroll-tracking).
  useEffect(() => {
    onPageVisited()
  }, [onPageVisited])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <ScreenHeader title="What's New" />
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          background: 'var(--color-surface-app, #F4F4F4)',
          padding: '12px 16px 140px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {releases.map((r) => (
          <ReleaseCard
            key={r.version}
            release={r}
            isUnread={compareVersions(r.version, lastSeen) > 0}
            onClick={r.deepLink ? () => onOpenRelease(r.deepLink!) : undefined}
          />
        ))}
      </div>
      <AppBottomNav
        value={'__none__' as AppNavValue}
        onNavigate={(v) => {
          if (v === 'dashboard') onDashboard()
          else if (v === 'inventory') onInventory()
          else if (v === 'menu') onMenu()
        }}
      />
    </div>
  )
}

function ReleaseCard({
  release,
  isUnread,
  onClick,
}: {
  release: Release
  isUnread: boolean
  onClick?: () => void
}) {
  const interactive = Boolean(onClick)
  return (
    <article
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick?.()
              }
            }
          : undefined
      }
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start',
        cursor: interactive ? 'pointer' : 'default',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      <div
        aria-hidden
        style={{
          flex: '0 0 auto',
          width: 56,
          height: 56,
          borderRadius: 12,
          background: '#1F2329',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {ICON_MAP[release.icon]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 4,
          }}
        >
          {isUnread && <Badge variant="brand">NEW</Badge>}
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              color: '#9CA3AF',
              fontWeight: 500,
            }}
          >
            {release.date} · v{release.version}
          </span>
        </div>
        <h3
          style={{
            margin: '0 0 4px',
            fontFamily: "'Inter', sans-serif",
            fontSize: 17,
            fontWeight: 600,
            color: '#000',
            lineHeight: 1.25,
          }}
        >
          {release.title}
        </h3>
        <p
          style={{
            margin: 0,
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            color: '#3F3F46',
            lineHeight: 1.45,
          }}
        >
          {release.summary}
        </p>
      </div>
      {interactive && (
        <div
          aria-hidden
          style={{
            flex: '0 0 auto',
            color: '#9CA3AF',
            display: 'inline-flex',
            alignSelf: 'center',
          }}
        >
          <ChevronRight size={18} />
        </div>
      )}
    </article>
  )
}
