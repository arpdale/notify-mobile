import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { sliceColor } from './colors'

export type PieSlice = {
  /** Display name shown in the legend below the chart */
  name: string
  value: number
  /** Override the auto-assigned color */
  color?: string
}

type Props = {
  data: PieSlice[]
  /** Diameter — width and height (px). Defaults to 240. */
  size?: number
  /** Optional formatter for the legend percentage (defaults to one decimal) */
  formatPercent?: (n: number) => string
}

const defaultPercent = (n: number) => `${(n * 100).toFixed(1)}%`

export function CategoryPieChart({
  data,
  size = 240,
  formatPercent = defaultPercent,
}: Props) {
  const total = data.reduce((sum, s) => sum + s.value, 0) || 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive={false}
            >
              {data.map((s, i) => (
                <Cell key={s.name} fill={s.color ?? sliceColor(i)} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          fontFamily: "'Inter', sans-serif",
          fontSize: 14,
          color: '#000',
        }}
      >
        {data.map((s, i) => (
          <li
            key={s.name}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: s.color ?? sliceColor(i),
              }}
            />
            <span>
              {s.name} ({formatPercent(s.value / total)})
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
