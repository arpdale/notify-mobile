import type { ReactNode } from 'react'
import { Radio, Switcher, Toggle } from '@david-richard/notify-ds'
import { ChevronLeft } from '@david-richard/notify-ds/icons'
import {
  compareOptions,
  defaultCompareFor,
  defaultPeriodFor,
  primaryOptions,
  resolvePrimary,
  toIsoDateString,
  type DateFilter,
  type DateMode,
  type PeriodOption,
} from '../lib/dateFilter'

type Props = {
  /** Current filter — App owns the truth. */
  filter: DateFilter
  /** Live commit — every change writes back through this. */
  onChange: (next: DateFilter) => void
  /** Reference date used to compute option labels (today). Passed in for
   *  testability + so the picker is decoupled from the system clock. */
  today: Date
  onDismiss: () => void
  /** Optional saved-views surface rendered just under the header. App.tsx
   *  passes the SavedViewsStrip when the flag is on; otherwise undefined. */
  savedViewsSlot?: ReactNode
}

export function FilterByDate({ filter, onChange, today, onDismiss, savedViewsSlot }: Props) {
  const setMode = (next: DateMode) => {
    // When the user switches tabs, replace period + compare with sensible
    // defaults for the new mode rather than carrying over stale values.
    // (Tier-7 bug: 'yesterday' would orphan in Week mode and leave the radio
    // list with nothing selected.)
    onChange({
      ...filter,
      mode: next,
      period: defaultPeriodFor(next),
      compare: filter.compareOn ? defaultCompareFor(next) : filter.compare,
    })
  }

  const setPeriod = (id: string) =>
    onChange({ ...filter, period: id })

  const setCustomDate = (iso: string) =>
    onChange({ ...filter, customDate: iso })

  const setCompareOn = (next: boolean) =>
    onChange({
      ...filter,
      compareOn: next,
      // When turning on, default the compare id; when turning off, leave it
      // intact so toggling back restores the prior choice.
      compare: next && !filter.compare ? defaultCompareFor(filter.mode) : filter.compare,
    })

  const setCompare = (id: string) =>
    onChange({ ...filter, compare: id })

  const primary = primaryOptions(filter.mode, today)
  const primaryRange = resolvePrimary(filter, today)
  const compares = compareOptions(filter.mode, primaryRange)

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: '#FFFFFF',
        padding: '24px 24px 24px',
        overflowY: 'auto',
      }}
    >
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
          <ChevronLeft size={24} />
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

      {savedViewsSlot}

      <div style={{ marginBottom: 16 }}>
        <Switcher
          segments={['Day', 'Week', 'Month', 'Custom']}
          value={filter.mode}
          onValueChange={(v) => setMode(v as DateMode)}
          stretch
        />
      </div>

      {filter.mode === 'Custom' ? (
        <div style={{ marginBottom: 12 }}>
          <label
            htmlFor="filter-custom-date"
            style={{
              display: 'block',
              fontFamily: "'Red Hat Text', 'Inter', sans-serif",
              fontSize: 14,
              color: '#000',
              marginBottom: 6,
            }}
          >
            Date
          </label>
          <input
            id="filter-custom-date"
            type="date"
            value={filter.customDate ?? toIsoDateString(today)}
            onChange={(e) => setCustomDate(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1.5px solid var(--color-interactive-secondary,#339FB8)',
              borderRadius: 9999,
              fontFamily: "'Inter', sans-serif",
              fontSize: 16,
              color: '#000',
              outline: 'none',
              background: '#FFFFFF',
            }}
          />
        </div>
      ) : (
        <PeriodList
          listName="primary"
          options={primary}
          value={filter.period}
          onChange={setPeriod}
        />
      )}

      <div style={{ margin: '16px 0', borderTop: '1px solid #EAEAEA' }} />

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
        <Toggle checked={filter.compareOn} onChange={setCompareOn} />
      </div>

      {filter.compareOn && (
        <PeriodList
          listName="compare"
          options={compares}
          value={filter.compare}
          onChange={setCompare}
        />
      )}
    </div>
  )
}

function PeriodList({
  listName,
  options,
  value,
  onChange,
}: {
  /** Namespaces the radio name + each input id so multiple lists on a page
   *  don't collide on htmlFor lookups. */
  listName: string
  options: PeriodOption[]
  value: string | null
  onChange: (id: string) => void
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
            inputId={`${listName}-${opt.id}`}
            name={`filter-${listName}`}
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
  inputId,
  name,
  label,
  sub,
  selected,
  onSelect,
}: {
  inputId: string
  name: string
  label: string
  sub?: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '10px 0',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <label
        htmlFor={inputId}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          cursor: 'pointer',
          flex: 1,
        }}
      >
        <span style={{ fontSize: 16, color: '#000' }}>{label}</span>
        {sub ? <span style={{ fontSize: 12, color: '#6B7280' }}>{sub}</span> : null}
      </label>
      <Radio
        id={inputId}
        name={name}
        value={inputId}
        checked={selected}
        onChange={(e) => {
          if (e.target.checked) onSelect()
        }}
      />
    </div>
  )
}
