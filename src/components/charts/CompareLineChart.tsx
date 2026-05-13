import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CHART_COLORS } from './colors'

type Point = Record<string, number | string>

type Props = {
  data: Point[]
  /** Field key on each point used as the X axis tick */
  xKey: string
  /** Field key for the primary (today) series */
  primaryKey: string
  /** Optional field key for the comparison series (previous day, etc.) */
  comparisonKey?: string
  /** Display labels (used by the legend in the parent screen) */
  primaryLabel?: string
  comparisonLabel?: string
  /** Currency-or-similar Y axis formatter; defaults to a dollar formatter */
  formatY?: (value: number) => string
  /** Height in px; defaults to 220 to match the reference shot */
  height?: number
}

const defaultFormatY = (n: number) =>
  `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export function CompareLineChart({
  data,
  xKey,
  primaryKey,
  comparisonKey,
  primaryLabel = 'Today',
  comparisonLabel = 'Previous Day',
  formatY = defaultFormatY,
  height = 220,
}: Props) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis
            dataKey={xKey}
            stroke={CHART_COLORS.axis}
            tick={{ fontSize: 11, fill: CHART_COLORS.axis }}
            tickMargin={6}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke={CHART_COLORS.axis}
            tick={{ fontSize: 11, fill: CHART_COLORS.axis }}
            tickMargin={6}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatY}
            width={64}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: `1px solid ${CHART_COLORS.grid}`,
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
            }}
            formatter={(value, name) => [
              formatY(Number(value)),
              name === primaryKey ? primaryLabel : comparisonLabel,
            ]}
          />
          {comparisonKey ? (
            <Line
              type="linear"
              dataKey={comparisonKey}
              stroke={CHART_COLORS.previous}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
          ) : null}
          <Line
            type="linear"
            dataKey={primaryKey}
            stroke={CHART_COLORS.today}
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
