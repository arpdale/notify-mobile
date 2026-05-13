import { useMemo, useState } from 'react'
import { Button, Checkbox, InputField } from '@david-richard/notify-ds'
import { ScreenHeader } from '../components/ScreenHeader'

type Store = {
  id: string
  name: string
  /** Whether this store is in the user's "preferred" set */
  preferred?: boolean
}

const DEMO_STORES: Store[] = [
  { id: 'admin-team', name: 'Milksha - Admin Team', preferred: true },
  { id: 'denver-lab', name: 'Milksha - Denver Lab' },
  { id: 'great-mall', name: 'Milksha - Great Mall CA' },
  { id: 'ontario-mills', name: 'Milksha - Ontario Mills, CA', preferred: true },
  { id: 'qu-hq-dev', name: 'Milksha - QU HQ Dev Lab Test', preferred: true },
  { id: 'westwood', name: 'Milksha - Westwood CA', preferred: true },
  { id: 'west-covina', name: 'Milksha HQ Lab (West Covina)', preferred: true },
  { id: 'qu-hq', name: 'Milksha Qu HQ', preferred: true },
  { id: 'smashburger-corp', name: 'Smashburger Corporate Lab', preferred: true },
  { id: 'smashburger-qu', name: 'Smashburger Qu HQ', preferred: true },
]

const DEFAULT_SELECTED = new Set(
  DEMO_STORES.filter((s) => s.preferred).map((s) => s.id),
)

type Props = {
  onBack: () => void
  onApply?: (selectedIds: string[]) => void
}

export function StoresPicker({ onBack, onApply }: Props) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Set<string>>(DEFAULT_SELECTED)

  const filtered = useMemo(() => {
    if (!query.trim()) return DEMO_STORES
    const q = query.trim().toLowerCase()
    return DEMO_STORES.filter((s) => s.name.toLowerCase().includes(q))
  }, [query])

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectPreferred = () => {
    setSelected(new Set(DEMO_STORES.filter((s) => s.preferred).map((s) => s.id)))
  }
  const selectAll = () => {
    setSelected(new Set(DEMO_STORES.map((s) => s.id)))
  }
  const removeAll = () => {
    setSelected(new Set())
  }

  const apply = () => onApply?.([...selected])

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
          Selected stores ({selected.size})
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
                checked={selected.has(store.id)}
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
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            selectPreferred()
            apply()
          }}
        >
          Select preferred
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            selectAll()
            apply()
          }}
        >
          Select All
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={() => {
            removeAll()
            apply()
          }}
        >
          Remove All
        </Button>
      </div>
    </div>
  )
}
