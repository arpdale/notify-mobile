import { useMemo, useState } from 'react'
import { Button, Checkbox, InputField, ScreenHeader } from '@david-richard/notify-ds'
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
              <Checkbox
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
