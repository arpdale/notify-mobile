import { MetricTile, MetricTileGrid } from '@david-richard/notify-ds'
import type { DashboardTile } from '../Dashboard'

type TileData = {
  label: DashboardTile
  value: string
  trend?: number
  trendLabel?: string
}

const TILES: TileData[] = [
  { label: 'Net Sales', value: '$345.58', trend: 11.8, trendLabel: '$304.78' },
  { label: 'Checks', value: '11', trend: 18.1, trendLabel: '9' },
  { label: 'Payments', value: '$378.40', trend: 11.1, trendLabel: '$336.28' },
  { label: 'Average Check', value: '$33.86', trend: 7.7, trendLabel: '$31.42' },
  { label: 'Gross Sales', value: '$368.40', trend: -11.4, trendLabel: '$326.28' },
  { label: 'Discounts', value: '$22.40', trend: 14.2, trendLabel: '$19.20' },
  { label: 'Cash', value: '$44.91', trendLabel: '$44.91' },
  // Tills slot is rendered out-of-band by TillsTile in the 8th grid cell.
  { label: 'Voids', value: '$8.00' },
  { label: 'Service Charges', value: '$10.00' },
]

type Props = {
  onTileClick?: (tile: DashboardTile) => void
  /** When true, every tile renders the DS skeleton state */
  loading?: boolean
}

export function SalesView({ onTileClick, loading }: Props) {
  return (
    <MetricTileGrid cols={2}>
      {TILES.slice(0, 7).map((t) => (
        <MetricTile
          key={t.label}
          label={t.label}
          value={loading ? '' : t.value}
          trend={loading ? undefined : t.trend}
          trendLabel={loading ? undefined : t.trendLabel}
          loading={loading}
          onClick={() => onTileClick?.(t.label)}
        />
      ))}
      <TillsTile loading={loading} onClick={() => onTileClick?.('Tills')} />
      {TILES.slice(7).map((t) => (
        <MetricTile
          key={t.label}
          label={t.label}
          value={loading ? '' : t.value}
          trend={loading ? undefined : t.trend}
          trendLabel={loading ? undefined : t.trendLabel}
          loading={loading}
          onClick={() => onTileClick?.(t.label)}
        />
      ))}
    </MetricTileGrid>
  )
}

/**
 * Tills is the one Sales tile that doesn't fit DS MetricTile (its "value"
 * is a three-row status list, and MetricTile.value is typed string | number).
 * Rendered with the same 16px-radius / 4px shadow card the DS uses so the
 * grid reads as one consistent surface.
 */
function TillsTile({
  onClick,
  loading,
}: {
  onClick?: () => void
  loading?: boolean
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-busy={loading}
      onClick={loading ? undefined : onClick}
      onKeyDown={(e) => {
        if (loading) return
        if (e.key === 'Enter' || e.key === ' ') onClick?.()
      }}
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        boxShadow: '0 4px 4px rgba(0,0,0,0.06)',
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        cursor: loading ? 'default' : 'pointer',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#6B7280',
          fontSize: 12,
        }}
      >
        <span>Tills</span>
        {!loading && <span aria-hidden>›</span>}
      </div>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <SkeletonLine width="48%" />
          <SkeletonLine width="56%" />
          <SkeletonLine width="60%" />
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            fontSize: 14,
            color: '#000',
          }}
        >
          <span>
            Open: <strong style={{ fontWeight: 600 }}>0</strong>
          </span>
          <span>
            Closed: <strong style={{ fontWeight: 600 }}>1</strong>
          </span>
          <span>
            Reconciled: <strong style={{ fontWeight: 600 }}>0</strong>
          </span>
        </div>
      )}
    </div>
  )
}

function SkeletonLine({ width = '100%' }: { width?: string }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'block',
        width,
        height: 12,
        borderRadius: 4,
        background: '#EAEAEA',
      }}
    />
  )
}
