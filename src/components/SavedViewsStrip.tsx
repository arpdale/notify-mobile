import { Close } from '@david-richard/notify-ds/icons'
import type { SavedView } from '../lib/savedViews'

type Props = {
  views: SavedView[]
  /** True when this row's filter combo matches the currently-applied state.
   *  Drives the active highlight + default-pin readout. */
  isMatchById: (id: string) => boolean
  onApply: (view: SavedView) => void
  onDelete: (id: string) => void
  onSetDefault: (id: string) => void
}

/** Strip of saved-view chips shown at the top of the stores and date
 *  pickers. Each row is tap-to-apply; trailing controls let the user
 *  promote one as default or delete it.
 *
 *  Renders nothing when there are no saves — discoverability lives on the
 *  ContextBar star, not on an empty placeholder row. */
export function SavedViewsStrip({
  views,
  isMatchById,
  onApply,
  onDelete,
  onSetDefault,
}: Props) {
  if (views.length === 0) return null

  return (
    <section
      aria-label="Saved views"
      style={{
        marginBottom: 16,
        background: '#FFFFFF',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      <header
        style={{
          padding: '10px 14px',
          fontFamily: "'Inter', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 0.4,
          textTransform: 'uppercase',
          color: '#6B7280',
          background: '#F8F8F8',
        }}
      >
        Saved Views
      </header>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {views.map((view, i) => {
          const active = isMatchById(view.id)
          return (
            <li
              key={view.id}
              style={{
                borderTop: i === 0 ? 'none' : '1px solid #EEE',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: active ? 'rgba(64,204,242,0.08)' : 'transparent',
              }}
            >
              <button
                type="button"
                onClick={() => onApply(view)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: 0,
                  background: 'transparent',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 15,
                  fontWeight: active ? 600 : 500,
                  color: '#000',
                }}
              >
                <span style={{ display: 'block' }}>{view.name}</span>
              </button>
              <button
                type="button"
                aria-label={view.isDefault ? 'Remove default' : 'Set as default'}
                onClick={() => onSetDefault(view.id)}
                style={{
                  flex: '0 0 auto',
                  border: 0,
                  background: 'transparent',
                  padding: 8,
                  cursor: 'pointer',
                  color: view.isDefault ? '#40CCF2' : '#9CA3AF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <StarIcon filled={view.isDefault} />
              </button>
              <button
                type="button"
                aria-label="Delete saved view"
                onClick={() => onDelete(view.id)}
                style={{
                  flex: '0 0 auto',
                  border: 0,
                  background: 'transparent',
                  padding: 8,
                  marginRight: 6,
                  cursor: 'pointer',
                  color: '#9CA3AF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Close size={14} />
              </button>
            </li>
          )
        })}
      </ul>
      <footer
        style={{
          padding: '8px 14px',
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          color: '#9CA3AF',
          background: '#FAFAFA',
        }}
      >
        Tap a row to apply · star marks the default
      </footer>
    </section>
  )
}

/** Inline star — kept local rather than added as a DS export. Filled state
 *  signals "this is the default view." */
export function StarIcon({
  filled = false,
  size = 16,
}: {
  filled?: boolean
  size?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
    </svg>
  )
}
