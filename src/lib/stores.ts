export type Store = {
  id: string
  name: string
  /** Whether this store is part of the user's "preferred" default set */
  preferred?: boolean
}

export const STORES: Store[] = [
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

export const DEFAULT_SELECTED_STORE_IDS: string[] = STORES.filter(
  (s) => s.preferred,
).map((s) => s.id)

/** Resolve the context-bar pill label from a selection set:
 *  - 0 stores → "Select Store" (call-to-action / empty state)
 *  - 1 store  → the single store's name (e.g. "Milksha Qu HQ")
 *  - N stores → "N Stores" (e.g. "10 Stores")
 *
 *  Matches the walkthrough's three states (frames 0125 empty, 0084 single,
 *  0086 multi).
 */
export function formatStoreLabel(selectedIds: Set<string>): string {
  if (selectedIds.size === 0) return 'Select Store'
  if (selectedIds.size === 1) {
    const [id] = selectedIds
    const store = STORES.find((s) => s.id === id)
    return store?.name ?? '1 Store'
  }
  return `${selectedIds.size} Stores`
}
