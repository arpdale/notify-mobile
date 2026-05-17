import { type ReactNode, useState } from 'react'
import { Toggle } from '@david-richard/notify-ds'
import { MenuTargetPage } from '../components/MenuTargetPage'
import { ChevronRight } from '@david-richard/notify-ds/icons'

type Row = {
  label: string
  /** Right-side text value, e.g. "10 selected" or "15 Min" */
  value?: string
  /** Right-side custom slot — overrides `value` and the chevron */
  rightSlot?: ReactNode
  /** Tap handler. When set, the chevron shows and the row is clickable. */
  onClick?: () => void
}

type Section = {
  title: string
  rows: Row[]
}

type Props = {
  onDashboard: () => void
  onInventory: () => void
  onMenu: () => void
  /** Count of selected stores — shown next to "Preferred Stores" */
  preferredStoreCount: number
  onPickStores?: () => void
}

export function Settings({
  onDashboard,
  onInventory,
  onMenu,
  preferredStoreCount,
  onPickStores,
}: Props) {
  const [textToSpeech, setTextToSpeech] = useState(true)

  const sections: Section[] = [
    {
      title: 'Stores',
      rows: [
        {
          label: 'Preferred Stores',
          value: `${preferredStoreCount} selected`,
          onClick: onPickStores,
        },
        {
          label: 'Preferred Alert Stores',
          value: '0 selected',
          onClick: () => undefined,
        },
      ],
    },
    {
      title: 'Operations',
      rows: [
        {
          label: 'Consider Terminals Offline after',
          value: '15 Min',
        },
      ],
    },
    {
      title: 'Dashboard',
      rows: [
        { label: 'Employee Required to Clock In?', value: 'Yes', onClick: () => undefined },
        { label: 'Edit Sales Metrics', onClick: () => undefined },
        { label: 'Edit Labor Metrics', onClick: () => undefined },
      ],
    },
    {
      title: 'Analyze',
      rows: [
        {
          label: 'Text To Speech',
          rightSlot: (
            <Toggle checked={textToSpeech} onChange={setTextToSpeech} />
          ),
        },
      ],
    },
  ]

  return (
    <MenuTargetPage
      title="Settings"
      onDashboard={onDashboard}
      onInventory={onInventory}
      onMenu={onMenu}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          margin: '0 -16px',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {sections.map((section) => (
          <section key={section.title}>
            <h2
              style={{
                margin: 0,
                padding: '10px 16px',
                background: '#DEDEDE',
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: '#000',
              }}
            >
              {section.title}
            </h2>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                background: '#FFFFFF',
              }}
            >
              {section.rows.map((row, i) => (
                <li
                  key={row.label}
                  style={{
                    borderTop: i === 0 ? 'none' : '1px solid #EAEAEA',
                  }}
                >
                  <SettingsRow row={row} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </MenuTargetPage>
  )
}

function SettingsRow({ row }: { row: Row }) {
  const interactive = Boolean(row.onClick)
  return (
    <button
      type="button"
      onClick={row.onClick}
      disabled={!interactive && !row.rightSlot}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '14px 16px',
        background: 'transparent',
        border: 0,
        cursor: interactive ? 'pointer' : 'default',
        fontFamily: "'Inter', sans-serif",
        fontSize: 15,
        color: '#000',
        textAlign: 'left',
      }}
    >
      <span>{row.label}</span>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: '#6B7280',
          fontSize: 14,
        }}
      >
        {row.rightSlot ?? (
          <>
            {row.value ? <span>{row.value}</span> : null}
            {interactive ? <ChevronRight size={16} /> : null}
          </>
        )}
      </span>
    </button>
  )
}
