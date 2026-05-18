import { ScreenHeader } from '@david-richard/notify-ds'
import { Menu } from '@david-richard/notify-ds/icons'
import { MenuTargetPage } from '../components/MenuTargetPage'
import { EmptyState } from '../components/EmptyState'

/** Backlog Ideas — a temporary holding pen for experimental pages reached
 *  from the menu drawer. The index page lists each Idea as a link; each
 *  Idea is a thin placeholder until its real home is decided. */

export type BacklogIdeaId = 'idea1' | 'idea2' | 'idea3'

type IndexProps = {
  onDashboard: () => void
  onInventory: () => void
  onMenu: () => void
  onOpenIdea: (id: BacklogIdeaId) => void
}

const IDEAS: { id: BacklogIdeaId; label: string }[] = [
  { id: 'idea1', label: 'Idea 1' },
  { id: 'idea2', label: 'Idea 2' },
  { id: 'idea3', label: 'Idea 3' },
]

export function BacklogIdeas({
  onDashboard,
  onInventory,
  onMenu,
  onOpenIdea,
}: IndexProps) {
  return (
    <MenuTargetPage
      title="Backlog Ideas"
      onDashboard={onDashboard}
      onInventory={onInventory}
      onMenu={onMenu}
    >
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          background: '#FFFFFF',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        {IDEAS.map((idea, i) => (
          <li
            key={idea.id}
            style={{
              borderTop: i === 0 ? 'none' : '1px solid #EEE',
            }}
          >
            <button
              type="button"
              onClick={() => onOpenIdea(idea.id)}
              style={{
                width: '100%',
                border: 0,
                background: 'transparent',
                padding: '16px 20px',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                fontSize: 17,
                fontWeight: 500,
                color: '#000',
                textAlign: 'left',
              }}
            >
              {idea.label}
            </button>
          </li>
        ))}
      </ul>
    </MenuTargetPage>
  )
}

function IdeaPlaceholder({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <ScreenHeader title={title} onBack={onBack} />
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          background: 'var(--color-surface-app, #F4F4F4)',
          padding: '12px 16px 24px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <EmptyState
          icon={<Menu size={48} />}
          title={title}
          description="Experimental page. Final placement TBD."
        />
      </div>
    </div>
  )
}

export function Idea1({ onBack }: { onBack: () => void }) {
  return <IdeaPlaceholder title="Idea 1" onBack={onBack} />
}

export function Idea2({ onBack }: { onBack: () => void }) {
  return <IdeaPlaceholder title="Idea 2" onBack={onBack} />
}

export function Idea3({ onBack }: { onBack: () => void }) {
  return <IdeaPlaceholder title="Idea 3" onBack={onBack} />
}
