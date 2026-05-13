import { MetricTile, MetricTileGrid } from '@david-richard/notify-ds'

/**
 * Labor-tab content matched against the PM-walkthrough Labor frame.
 * Five tiles in a 2-column grid (last cell intentionally empty so the
 * "Open Shifts" tile sits alone on its row, matching the reference).
 */

type TileData = {
  label: string
  value: string
  trend?: number
  trendLabel?: string
}

const TILES: TileData[] = [
  { label: 'Labor Hours', value: '0.00', trend: -100, trendLabel: '2.72' },
  { label: 'Net Sales/Labor Hrs', value: '0.00', trendLabel: '0.00' },
  { label: 'Employee Tips', value: '0.00', trendLabel: '0.00' },
  { label: 'Clocked In #', value: '0', trend: -100, trendLabel: '1' },
  { label: 'Open Shifts', value: '0', trendLabel: '0' },
]

type Props = {
  /** When true, tiles render the DS skeleton state */
  loading?: boolean
}

export function LaborView({ loading }: Props) {
  return (
    <MetricTileGrid cols={2}>
      {TILES.map((t) => (
        <MetricTile
          key={t.label}
          label={t.label}
          value={loading ? '' : t.value}
          trend={loading ? undefined : t.trend}
          trendLabel={loading ? undefined : t.trendLabel}
          loading={loading}
        />
      ))}
    </MetricTileGrid>
  )
}
