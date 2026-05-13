import { useMemo, useState } from 'react'
import { Button, InputField } from '@david-richard/notify-ds'
import { ScreenHeader } from '../components/ScreenHeader'
import { STORES, type Store } from '../lib/stores'

type Props = {
  onBack: () => void
  /** Current selection — App owns the truth */
  selectedIds: Set<string>
  /** Selection changed (toggle / preset button) — App writes the truth */
  onChange: (next: Set<string>) => void
}

export function StoresPicker({ onBack, selectedIds, onChange }: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return STORES
    const q = query.trim().toLowerCase()
    return STORES.filter((s) => s.name.toLowerCase().includes(q))
  }, [query])

  const toggle = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onChange(next)
  }

  const selectPreferred = () =>
    onChange(new Set(STORES.filter((s) => s.preferred).map((s) => s.id)))
  const selectAll = () => onChange(new Set(STORES.map((s) => s.id)))
  const removeAll = () => onChange(new Set())

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <ScreenHeader title="Dashboard Stores" onBack={onBack} />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          background: 'var(--color-surface-app, #F4F4F4)',
          padding: '12px 16px 120px',
        }}
      >
        <p
          style={{
            margin: '0 0 12px',
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            color: '#6B7280',
          }}
        >
          Selected stores ({selectedIds.size})
        </p>

        <div style={{ marginBottom: 16 }}>
          <InputField
            type="search"
            placeholder="Search Store"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {filtered.map((store) => (
            <li key={store.id}>
              <CheckboxRow
                label={store.name}
                checked={selectedIds.has(store.id)}
                onChange={() => toggle(store.id)}
              />
            </li>
          ))}
        </ul>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '12px 16px 24px',
          background:
            'linear-gradient(180deg, rgba(244,244,244,0) 0%, rgba(244,244,244,0.95) 30%, #F4F4F4 100%)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 8,
        }}
      >
        <Button variant="primary" size="md" onClick={selectPreferred}>
          Select preferred
        </Button>
        <Button variant="primary" size="md" onClick={selectAll}>
          Select All
        </Button>
        <Button variant="secondary" size="md" onClick={removeAll}>
          Remove All
        </Button>
      </div>
    </div>
  )
}

// Type-only import to keep the named-export list narrow.
export type { Store }

/**
 * Stable checkbox row matched against the DS Checkbox visual spec — 18×18
 * rounded square, 4px corner radius, 1.5px teal stroke when unchecked, cyan
 * fill + white tick when checked. Uses box-shadow inset for the stroke so
 * toggling state has zero layout impact (DS Checkbox uses border-color
 * which produces a sub-pixel shift on transition because the rounded-rect
 * mask repaints).
 */
function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          border: 0,
        }}
      />
      <span
        aria-hidden
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 18,
          height: 18,
          borderRadius: 4,
          flexShrink: 0,
          background: checked ? '#40CCF2' : 'transparent',
          boxShadow: checked ? 'none' : 'inset 0 0 0 1.5px #339FB8',
          transition: 'background-color 120ms, box-shadow 120ms',
        }}
      >
        {checked ? (
          <svg
            width="11"
            height="8"
            viewBox="0 0 11 8"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="1,4 4,7 10,1" />
          </svg>
        ) : null}
      </span>
      <span
        style={{
          fontFamily: "'Red Hat Text', 'Inter', sans-serif",
          fontSize: 14,
          fontWeight: 400,
          color: '#000',
          lineHeight: 1.2,
        }}
      >
        {label}
      </span>
    </label>
  )
}
