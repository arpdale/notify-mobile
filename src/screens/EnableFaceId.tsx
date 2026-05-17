import { Button } from '@david-richard/notify-ds'
import { Modal } from '../components/Modal'
import { FaceId } from '@david-richard/notify-ds/icons'

type Props = {
  open: boolean
  onEnable: () => void
  onSkip: () => void
}

export function EnableFaceId({ open, onEnable, onSkip }: Props) {
  return (
    <Modal open={open} onDismiss={onSkip}>
      <div style={{ color: '#FFFFFF', display: 'inline-flex', justifyContent: 'center' }}>
        <FaceId size={56} strokeWidth={1.5} />
      </div>
      <h2
        style={{
          margin: '12px 0 8px',
          fontFamily: "'Inter', sans-serif",
          fontSize: 22,
          fontWeight: 600,
          color: '#FFFFFF',
        }}
      >
        Enable Face ID
      </h2>
      <p
        style={{
          margin: '0 0 20px',
          fontFamily: "'Inter', sans-serif",
          fontSize: 14,
          color: 'rgba(255,255,255,0.7)',
          lineHeight: 1.5,
        }}
      >
        Enable Face ID for faster,
        <br />
        more secure access to Notify.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="primary" size="lg" onClick={onEnable}>
          Enable Face ID
        </Button>
      </div>
      <button
        type="button"
        onClick={onSkip}
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
