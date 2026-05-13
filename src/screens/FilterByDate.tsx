import { useState } from 'react'
import { Switcher, Toggle } from '@david-richard/notify-ds'
import { BottomSheet } from '../components/BottomSheet'
import { ChevronLeftIcon } from '../icons'

type DateMode = 'Day' | 'Week' | 'Month' | 'Custom'

type PeriodOption = {
  id: string
  label: string
  /** Small date subtext under the label */
  sub?: string
}

const PRIMARY_OPTIONS: Record<DateMode, PeriodOption[]> = {
  Day: [
    { id: 'today', label: 'Today', sub: '(05/12/26)' },
    { id: 'yesterday', label: 'Yesterday', sub: '(05/11/26)' },
  ],
  Week: [
    { id: 'this-week', label: 'This Week', sub: '(05/11/26 – 05/17/26)' },
    { id: 'last-week', label: 'Last Week', sub: '(05/04/26 – 05/10/26)' },
  ],
  Month: [
    { id: 'this-month', label: 'This Month', sub: '(05/01/26 – 05/31/26)' },
    { id: 'last-month', label: 'Last Month', sub: '(04/01/26 – 04/30/26)' },
  ],
  Custom: [],
}

const COMPARE_OPTIONS: PeriodOption[] = [
  { id: 'previous-day', label: 'Previous Day', sub: '(05/11/26)' },
  { id: 'same-date-last-year', label: 'Same Date Last Year', sub: '(05/12/25)' },
  { id: 'same-day-last-week', label: 'Same Day Last Week', sub: '(05/05/26)' },
  { id: 'same-day-last-year', label: 'Same Day Last Year', sub: '(05/13/25)' },
]

type Props = {
  open: boolean
  onDismiss: () => void
  /** Optional confirm hook — called with current selection when sheet dismissed via confirm */
  onApply?: (sel: {
    mode: DateMode
    period: string | null
    compareOn: boolean
    compare: string | null
  }) => void
}

export function FilterByDate({ open, onDismiss }: Props) {
  const [mode, setMode] = useState<DateMode>('Day')
  const [period, setPeriod] = useState<string | null>('today')
  const [compareOn, setCompareOn] = useState(true)
  const [compare, setCompare] = useState<string | null>('previous-day')

  return (
    <BottomSheet open={open} onDismiss={onDismiss} heightPercent={88}>
      <header
        style={{
          display: 'grid',
          gridTemplateColumns: '44px 1fr 44px',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <button
          type="button"
          aria-label="Back"
          onClick={onDismiss}
          style={{
            border: 0,
            background: 'transparent',
            padding: 4,
            cursor: 'pointer',
            color: '#000',
            justifySelf: 'flex-start',
          }}
        >
          <ChevronLeftIcon size={24} />
        </button>
        <h2
          style={{
            margin: 0,
            fontFamily: "'Inter', sans-serif",
            fontSize: 18,
            fontWeight: 600,
            color: '#000',
            textAlign: 'center',
          }}
        >
          Filter by date
        </h2>
        <span />
      </header>

      <div style={{ marginBottom: 16 }}>
        <Switcher
          segments={['Day', 'Week', 'Month', 'Custom']}
          value={mode}
          onValueChange={(v) => setMode(v as DateMode)}
          stretch
        />
      </div>

      {mode === 'Custom' ? (
        <p
          style={{
            margin: '24px 0',
            textAlign: 'center',
            fontFamily: "'Inter', sans-serif",
            color: '#6B7280',
          }}
        >
          Custom range picker — coming in a later tier.
        </p>
      ) : (
        <PeriodList
          options={PRIMARY_OPTIONS[mode]}
          value={period}
          onChange={setPeriod}
          name="filter-period"
        />
      )}

      <div
        style={{
          margin: '16px 0',
          borderTop: '1px solid #EAEAEA',
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '4px 0',
          fontFamily: "'Inter', sans-serif",
          fontSize: 16,
          color: '#000',
        }}
      >
        <span>Compare to</span>
        <Toggle checked={compareOn} onChange={setCompareOn} />
      </div>

      {compareOn && (
        <PeriodList
          options={COMPARE_OPTIONS}
          value={compare}
          onChange={setCompare}
          name="compare-period"
        />
      )}
    </BottomSheet>
  )
}

function PeriodList({
  options,
  value,
  onChange,
  name,
}: {
  options: PeriodOption[]
  value: string | null
  onChange: (id: string) => void
  name: string
}) {
  return (
    <ul
      style={{
        margin: 0,
        padding: 0,
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {options.map((opt) => (
        <li key={opt.id}>
          <PeriodRow
            id={opt.id}
            name={name}
            label={opt.label}
            sub={opt.sub}
            selected={value === opt.id}
            onSelect={() => onChange(opt.id)}
          />
        </li>
      ))}
    </ul>
  )
}

function PeriodRow({
  id,
  name,
  label,
  sub,
  selected,
  onSelect,
}: {
  id: string
  name: string
  label: string
  sub?: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <label
      htmlFor={id}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '10px 0',
        cursor: 'pointer',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 16, color: '#000' }}>{label}</span>
        {sub ? (
          <span style={{ fontSize: 12, color: '#6B7280' }}>{sub}</span>
        ) : null}
      </div>
      <span
        style={{
          position: 'relative',
          display: 'inline-block',
          width: 22,
          height: 22,
          borderRadius: '50%',
          border: selected ? 'none' : '1.5px solid #339FB8',
          background: selected ? '#40CCF2' : 'transparent',
          flexShrink: 0,
        }}
      >
        {selected ? (
          <span
            aria-hidden
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#FFFFFF',
            }}
          />
        ) : null}
        <input
          id={id}
          type="radio"
          name={name}
          value={id}
          checked={selected}
          onChange={onSelect}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            cursor: 'pointer',
            margin: 0,
          }}
        />
      </span>
    </label>
  )
}
