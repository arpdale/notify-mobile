import { Selector } from '@david-richard/notify-ds'
import { EmptyState } from '../components/EmptyState'
import { MenuTargetPage } from '../components/MenuTargetPage'
import { ArchiveXIcon, StoreIcon } from '../icons'
import { STORES } from '../lib/stores'

type Props = {
  onDashboard: () => void
  onInventory: () => void
  onMenu: () => void
  /** First selected store id — Forecast is always per-store */
  selectedStoreIds: Set<string>
  onPickStore?: () => void
}

export function Forecast({
  onDashboard,
  onInventory,
  onMenu,
  selectedStoreIds,
  onPickStore,
}: Props) {
  // Forecast is per-store — the context bar shows just one wide store pill,
  // no date filter. Pick the first selected store (or "Select Store" if
  // nothing is picked) — full picker still wires from the pill tap.
  const firstSelectedId = [...selectedStoreIds][0]
  const firstStore = firstSelectedId
    ? STORES.find((s) => s.id === firstSelectedId)
    : undefined
  const label = firstStore?.name ?? 'Select Store'

  return (
    <MenuTargetPage
      title="Forecast"
      contextBar={
        <div
          style={{
            padding: '8px 16px 12px',
            background: '#FFFFFF',
            flexShrink: 0,
          }}
        >
          <Selector
            label={label}
            variant="primary"
            state="active"
            icon={<StoreIcon size={16} />}
            onClick={onPickStore}
            style={{ width: '100%', justifyContent: 'center' }}
          />
        </div>
      }
      onDashboard={onDashboard}
      onInventory={onInventory}
      onMenu={onMenu}
    >
      <EmptyState
        icon={<ArchiveXIcon size={48} />}
        title="There's not enough data to make a"
        description="forecast"
      />
    </MenuTargetPage>
  )
}
