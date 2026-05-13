import { MetricTile, MetricTileGrid } from '@david-richard/notify-ds'
import type { DashboardTile } from '../Dashboard'

type Props = {
  onTileClick?: (tile: DashboardTile) => void
}

export function SalesView({ onTileClick }: Props) {
  return (
    <MetricTileGrid cols={2}>
      <MetricTile
        label="Net Sales"
        value="$345.58"
        trend={11.8}
        trendLabel="$304.78"
        onClick={() => onTileClick?.('Net Sales')}
      />
      <MetricTile
        label="Checks"
        value="11"
        trend={18.1}
        trendLabel="9"
        onClick={() => onTileClick?.('Checks')}
      />
      <MetricTile
        label="Payments"
        value="$378.40"
        trend={11.1}
        trendLabel="$336.28"
        onClick={() => onTileClick?.('Payments')}
      />
      <MetricTile
        label="Average Check"
        value="$33.86"
        trend={7.7}
        trendLabel="$31.42"
        onClick={() => onTileClick?.('Average Check')}
      />
      <MetricTile
        label="Gross Sales"
        value="$368.40"
        trend={-11.4}
        trendLabel="$326.28"
        onClick={() => onTileClick?.('Gross Sales')}
      />
      <MetricTile
        label="Discounts"
        value="$22.40"
        trend={14.2}
        trendLabel="$19.20"
        onClick={() => onTileClick?.('Discounts')}
      />
      <MetricTile
        label="Cash"
        value="$44.91"
        trendLabel="$44.91"
        onClick={() => onTileClick?.('Cash')}
      />
      <TillsTile onClick={() => onTileClick?.('Tills')} />
      <MetricTile
        label="Voids"
        value="$8.00"
        onClick={() => onTileClick?.('Voids')}
      />
      <MetricTile
        label="Service Charges"
        value="$10.00"
        onClick={() => onTileClick?.('Service Charges')}
      />
    </MetricTileGrid>
  )
}

/**
 * Tills is the one Sales tile that doesn't fit DS MetricTile (its "value"
 * is a three-row status list, and MetricTile.value is typed string | number).
 * Rendered with the same 16px-radius / 4px shadow card the DS uses so the
 * grid reads as one consistent surface.
 */
function TillsTile({ onClick }: { onClick?: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
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
        cursor: 'pointer',
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
        <span aria-hidden>›</span>
      </div>
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
    </div>
  )
}
