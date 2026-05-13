import { Button } from '@david-richard/notify-ds'
import { Modal } from '../components/Modal'
import { DownloadIcon } from '../icons'

type Props = {
  open: boolean
  onUpdate: () => void
  onLater: () => void
}

export function NewVersionAvailable({ open, onUpdate, onLater }: Props) {
  return (
    <Modal open={open} onDismiss={onLater}>
      <div
        style={{
          color: '#FFFFFF',
          display: 'inline-flex',
          justifyContent: 'center',
        }}
      >
        <DownloadIcon size={36} strokeWidth={1.5} />
      </div>
      <p
        style={{
          margin: '12px 0 20px',
          fontFamily: "'Inter', sans-serif",
          fontSize: 15,
          color: 'rgba(255,255,255,0.85)',
          lineHeight: 1.45,
        }}
      >
        A new version is available.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="primary" size="lg" onClick={onUpdate}>
          Update Now
        </Button>
      </div>
      <button
        type="button"
        onClick={onLater}
        style={{
          marginTop: 16,
          border: 0,
          background: 'transparent',
          padding: 0,
          cursor: 'pointer',
          color: '#40CCF2',
          fontFamily: "'Inter', sans-serif",
          fontSize: 16,
          fontWeight: 500,
          textDecoration: 'underline',
        }}
      >
        Do it later
      </button>
    </Modal>
  )
}
