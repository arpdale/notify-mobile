import type { ReactNode } from 'react'

type Props = {
  icon: ReactNode
  title: string
  /** Optional second line shown beneath the title */
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        gap: 16,
        textAlign: 'center',
      }}
    >
      <div style={{ color: '#40CCF2', display: 'inline-flex' }}>{icon}</div>
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 16,
          color: '#6B7280',
          lineHeight: 1.4,
        }}
      >
        <div>{title}</div>
        {description ? <div>{description}</div> : null}
      </div>
      {action ? <div style={{ marginTop: 8 }}>{action}</div> : null}
    </div>
  )
}
