import type { ReactNode } from 'react'
import { Toggle } from '@david-richard/notify-ds'
import { Refresh } from '@david-richard/notify-ds/icons'
import { MenuTargetPage } from '../components/MenuTargetPage'
import {
  EXPERIMENTS,
  useExperiments,
  type ExperimentKey,
} from '../lib/experiments'

/** Optional per-experiment helper action — usually a "reset / replay" for
 *  demoing first-launch experiences. Rendered as a small icon button to
 *  the right of the toggle, only when the experiment is currently on. */
export type ExperimentAction = {
  label: string
  icon?: ReactNode
  onClick: () => void
}

type Props = {
  onDashboard: () => void
  onInventory: () => void
  onMenu: () => void
  /** Map of optional helper actions keyed by experiment id. App.tsx wires
   *  these because the underlying handlers need router + hook access. */
  experimentActions?: Partial<Record<ExperimentKey, ExperimentAction>>
}

/** Backlog Ideas — the prototype's experiment toggle panel. Each row gates
 *  one IDEA's surfaces (entry points, routes, UI). Flip during a demo to
 *  show stakeholders the prototype with or without a given feature.
 *
 *  Flags persist to localStorage; URL params (?exp=key, ?exp-off=key)
 *  override on first load. See lib/experiments.ts. */
export function BacklogIdeas({
  onDashboard,
  onInventory,
  onMenu,
  experimentActions,
}: Props) {
  const { state, setExperiment, resetExperiments } = useExperiments()
  const keys = Object.keys(EXPERIMENTS) as ExperimentKey[]

  return (
    <MenuTargetPage
      title="Backlog Ideas"
      onDashboard={onDashboard}
      onInventory={onInventory}
      onMenu={onMenu}
    >
      <p
        style={{
          margin: '0 0 16px',
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          color: '#6B7280',
          lineHeight: 1.5,
        }}
      >
        Toggle experimental capabilities on or off. Changes apply
        immediately; the rest of the prototype updates in place.
      </p>

      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          background: '#FFFFFF',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        }}
      >
        {keys.map((key, i) => {
          const meta = EXPERIMENTS[key]
          const action = experimentActions?.[key]
          const isOn = state[key]
          return (
            <li
              key={key}
              style={{
                padding: '14px 16px',
                borderTop: i === 0 ? 'none' : '1px solid #EEE',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#000',
                    marginBottom: 2,
                  }}
                >
                  {meta.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    color: '#6B7280',
                    lineHeight: 1.4,
                  }}
                >
                  {meta.description}
                </div>
              </div>
              {action && isOn && (
                <button
                  type="button"
                  aria-label={action.label}
                  title={action.label}
                  onClick={action.onClick}
                  style={{
                    flex: '0 0 auto',
                    width: 36,
                    height: 36,
                    border: '1px solid #E5E7EB',
                    background: '#FFFFFF',
                    borderRadius: 999,
                    cursor: 'pointer',
                    color: '#1F2329',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {action.icon ?? <Refresh size={16} />}
                </button>
              )}
              <Toggle
                checked={isOn}
                onChange={(v) => setExperiment(key, v)}
              />
            </li>
          )
        })}
      </ul>

      <button
        type="button"
        onClick={resetExperiments}
        style={{
          marginTop: 20,
          alignSelf: 'flex-start',
          border: '1px solid #D1D5DB',
          background: '#FFFFFF',
          padding: '8px 14px',
          borderRadius: 999,
          cursor: 'pointer',
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          fontWeight: 500,
          color: '#374151',
        }}
      >
        Reset to defaults
      </button>
    </MenuTargetPage>
  )
}
