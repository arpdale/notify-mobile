import { DetailCard, DetailShell } from '../components/DetailShell'
import { CompareLineChart } from '../components/charts/CompareLineChart'
import { CHART_COLORS } from '../components/charts/colors'

type HourRow = {
  hour: string
  today: number
  previous: number
  /** % change today vs previous; null when no comparison */
  pct: number | null
}

/** 24-hour shape mirroring net-sales.png — today mostly zero with a single
 *  morning spike; previous day has multiple spikes. */
const DEMO_HOURS: HourRow[] = [
  { hour: '12 AM', today: 0, previous: 0, pct: 0 },
  { hour: '1 AM', today: 0, previous: 0, pct: 0 },
  { hour: '2 AM', today: 0, previous: 0, pct: 0 },
  { hour: '3 AM', today: 0, previous: 0, pct: 0 },
  { hour: '4 AM', today: 0, previous: 0, pct: 0 },
  { hour: '5 AM', today: 0, previous: 0, pct: 0 },
  { hour: '6 AM', today: 60, previous: 120, pct: -50 },
  { hour: '7 AM', today: 360, previous: 540, pct: -33.3 },
  { hour: '8 AM', today: 1040, previous: 1410, pct: -26.2 },
  { hour: '9 AM', today: 120, previous: 540, pct: -77.7 },
  { hour: '10 AM', today: 30, previous: 240, pct: -87.5 },
  { hour: '11 AM', today: 60, previous: 800, pct: -92.5 },
  { hour: '12 PM', today: 80, previous: 820, pct: -90.2 },
  { hour: '1 PM', today: 60, previous: 460, pct: -86.9 },
  { hour: '2 PM', today: 40, previous: 280, pct: -85.7 },
  { hour: '3 PM', today: 30, previous: 360, pct: -91.6 },
  { hour: '4 PM', today: 20, previous: 420, pct: -95.2 },
  { hour: '5 PM', today: 10, previous: 220, pct: -95.4 },
  { hour: '6 PM', today: 0, previous: 180, pct: -100 },
  { hour: '7 PM', today: 0, previous: 280, pct: -100 },
  { hour: '8 PM', today: 0, previous: 320, pct: -100 },
  { hour: '9 PM', today: 0, previous: 120, pct: -100 },
  { hour: '10 PM', today: 0, previous: 40, pct: -100 },
  { hour: '11 PM', today: 0, previous: 0, pct: 0 },
]

type Props = {
  onBack: () => void
  onPickStores?: () => void
  onPickDate?: () => void
  storeLabel?: string
  dateLabel?: string
}

export function NetSales({
  onBack,
  onPickStores,
  onPickDate,
  storeLabel,
  dateLabel,
}: Props) {
  return (
    <DetailShell
      title="Net Sales"
      onBack={onBack}
      onPickStores={onPickStores}
      onPickDate={onPickDate}
      storeLabel={storeLabel}
      dateLabel={dateLabel}
    >
      <DetailCard title="Net Sales by hour" onExpand={() => undefined}>
        <Legend />
        <CompareLineChart
          data={DEMO_HOURS}
          xKey="hour"
          primaryKey="today"
          comparisonKey="previous"
          primaryLabel="Today"
          comparisonLabel="Previous Day"
        />
      </DetailCard>
      <HourTable rows={DEMO_HOURS} highlightIndex={1} />
    </DetailShell>
  )
}

function Legend() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 24,
        marginBottom: 12,
        fontFamily: "'Inter', sans-serif",
        fontSize: 14,
        color: '#000',
      }}
    >
      <LegendItem color={CHART_COLORS.today} label="Today" />
      <LegendItem color={CHART_COLORS.previous} label="Previous Day" />
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span
        aria-hidden
        style={{ width: 10, height: 10, borderRadius: '50%', background: color }}
      />
      {label}
    </span>
  )
}

function HourTable({
  rows,
  highlightIndex,
}: {
  rows: HourRow[]
  highlightIndex?: number
}) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        fontFamily: "'Inter', sans-serif",
        fontSize: 14,
      }}
    >
      <div
        role="row"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1.2fr 0.6fr',
          padding: '14px 16px',
          fontWeight: 700,
          color: '#000',
          borderBottom: '1px solid #EAEAEA',
        }}
      >
        <span>Hour</span>
        <span>Today</span>
        <span>Previous Day</span>
        <span style={{ textAlign: 'right' }}>%</span>
      </div>
      {rows.map((r, i) => {
        const isHighlight = i === highlightIndex
        return (
          <div
            key={r.hour}
            role="row"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr 1.2fr 0.6fr',
              padding: '14px 16px',
              color: isHighlight ? '#000' : '#000',
              background: isHighlight ? CHART_COLORS.today : '#FFFFFF',
              borderTop: i === 0 ? 'none' : '1px solid #EAEAEA',
              alignItems: 'center',
              fontWeight: isHighlight ? 600 : 400,
            }}
          >
            <span>{formatHourRange(r.hour)}</span>
            <span>{formatDollars(r.today)}</span>
            <span>{formatDollars(r.previous)}</span>
            <span style={{ textAlign: 'right' }}>
              {r.pct === null ? '-' : r.pct.toFixed(1)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function formatDollars(n: number) {
  return `$${n.toFixed(2)}`
}

const HOURS_24 = [
  '12 AM',
  '1 AM',
  '2 AM',
  '3 AM',
  '4 AM',
  '5 AM',
  '6 AM',
  '7 AM',
  '8 AM',
  '9 AM',
  '10 AM',
  '11 AM',
  '12 PM',
  '1 PM',
  '2 PM',
  '3 PM',
  '4 PM',
  '5 PM',
  '6 PM',
  '7 PM',
  '8 PM',
  '9 PM',
  '10 PM',
  '11 PM',
]

function formatHourRange(hour: string) {
  const idx = HOURS_24.indexOf(hour)
  if (idx < 0) return hour
  const next = HOURS_24[(idx + 1) % HOURS_24.length]
  return `${hour.toLowerCase()} - ${next.toLowerCase()}`
}
