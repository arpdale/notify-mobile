import { Button } from '@david-richard/notify-ds'
import logoQu from '@david-richard/notify-ds/assets/logo-qu.svg?url'
import { EmptyState } from '../components/EmptyState'
import { Info } from '@david-richard/notify-ds/icons'

type Props = {
  onRefresh: () => void
  onDevSkip?: () => void
}

export function NetworkError({ onRefresh, onDevSkip }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        background: '#FFFFFF',
      }}
    >
      <EmptyState
        icon={<Info size={48} />}
        title="Please check your network"
        description="and try again"
        action={
          <Button variant="primary" size="lg" onClick={onRefresh}>
            Refresh
          </Button>
        }
      />

      <div
        style={{
          marginTop: 'auto',
          paddingBottom: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <button
          type="button"
          onClick={onDevSkip}
          disabled={!onDevSkip}
          title={onDevSkip ? 'Skip to dashboard (dev)' : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 14,
            color: '#000',
            fontFamily: "'Inter', sans-serif",
            border: 0,
            background: 'transparent',
            padding: 0,
            cursor: onDevSkip ? 'pointer' : 'default',
            font: 'inherit',
          }}
        >
          <span>Powered by</span>
          <img src={logoQu} alt="Qu" style={{ height: 18 }} />
        </button>
        <span style={{ fontSize: 11, color: '#9CA3AF' }}>
          Version 3.6.222-build. 1483
        </span>
      </div>
    </div>
  )
}
