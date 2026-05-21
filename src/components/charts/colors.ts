/**
 * DS-aligned chart palette per arpdale/qu-design-system reference shots.
 *
 * - Today series + primary pie slice: brand tech-blue (#40CCF2)
 * - Comparison series + secondary slice: stable-blue (#0D2A4B) family
 *   rendered against pies as a muted slate gray
 * - Tertiary slice: cool gray for the long tail
 */
export const CHART_COLORS = {
  today: 'var(--color-accent,#40CCF2)',
  previous: '#6B7280',
  primarySlice: 'var(--color-accent,#40CCF2)',
  secondarySlice: '#5B6975',
  tertiarySlice: '#D9D9D9',
  axis: '#9CA3AF',
  grid: '#EAEAEA',
} as const

/**
 * Returns the slice color for a given index. Falls back to the cool-gray
 * tertiary value after the top three so pies with many slices still read.
 */
export function sliceColor(index: number): string {
  return [
    CHART_COLORS.primarySlice,
    CHART_COLORS.secondarySlice,
    CHART_COLORS.tertiarySlice,
  ][index] ?? CHART_COLORS.tertiarySlice
}
