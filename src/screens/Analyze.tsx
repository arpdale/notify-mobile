import { useState, useEffect, useRef } from 'react'
import { MenuTargetPage } from '../components/MenuTargetPage'

type Message =
  | { kind: 'bot'; text: string; time?: string }
  | { kind: 'user'; text: string; time?: string }
  | { kind: 'date'; label: string }

const USER_BUBBLE_BG = 'var(--color-info,#4A8FE7)'
const BOT_BUBBLE_BG = '#FFFFFF'

const INITIAL: Message[] = [
  {
    kind: 'bot',
    text:
      'Hi, I\'m QuBot! For all your questions I\'ll be using your "preferred stores". If you want to change those stores, please go to \'Configure\'.',
  },
  { kind: 'date', label: 'May 12, 2026' },
  { kind: 'user', text: 'tell me sales today', time: '11:11 AM' },
  { kind: 'bot', text: 'today Net Sales are $0.00.', time: '11:11 AM' },
]

type Props = {
  onDashboard: () => void
  onInventory: () => void
  onMenu: () => void
}

export function Analyze({ onDashboard, onInventory, onMenu }: Props) {
  const [messages, setMessages] = useState<Message[]>(INITIAL)
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement | null>(null)

  // Keep the latest message in view as new ones arrive.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages])

  const send = () => {
    const text = draft.trim()
    if (!text) return
    const now = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
    setMessages((prev) => [
      ...prev,
      { kind: 'user', text, time: now },
      {
        kind: 'bot',
        text: `Sorry, I don't have a real backend yet — try asking me again once Tier 9 lands.`,
        time: now,
      },
    ])
    setDraft('')
  }

  return (
    <MenuTargetPage
      title="Analyze"
      onDashboard={onDashboard}
      onInventory={onInventory}
      onMenu={onMenu}
    >
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          margin: '0 -16px',
          padding: '8px 16px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
          <button
            type="button"
            onClick={() => undefined}
            style={{
              border: 0,
              padding: '8px 18px',
              borderRadius: 9999,
              background: '#9CA3AF',
              color: '#FFFFFF',
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Load earlier messages
          </button>
        </div>

        {messages.map((msg, i) => {
          if (msg.kind === 'date') {
            return (
              <div
                key={i}
                style={{
                  textAlign: 'center',
                  color: '#9CA3AF',
                  fontSize: 12,
                  padding: '8px 0',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {msg.label}
              </div>
            )
          }
          return <Bubble key={i} message={msg} />
        })}
      </div>

      <div
        style={{
          padding: '8px 16px 12px',
          margin: '0 -16px',
          background: 'var(--color-surface-app, #F4F4F4)',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') send()
          }}
          placeholder="Type or ask me something"
          style={{
            flex: 1,
            padding: '12px 16px',
            border: 0,
            borderRadius: 9999,
            background: '#FFFFFF',
            fontFamily: "'Inter', sans-serif",
            fontSize: 15,
            color: '#000',
            outline: 'none',
            boxShadow: 'inset 0 0 0 1px #DEDEDE',
          }}
        />
        <button
          type="button"
          onClick={send}
          aria-label="Send"
          disabled={!draft.trim()}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: 0,
            background: USER_BUBBLE_BG,
            opacity: draft.trim() ? 1 : 0.45,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: draft.trim() ? 'pointer' : 'default',
            color: '#FFFFFF',
            flexShrink: 0,
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="13 6 19 12 13 18" />
          </svg>
        </button>
      </div>
    </MenuTargetPage>
  )
}

function Bubble({ message }: { message: Extract<Message, { kind: 'bot' | 'user' }> }) {
  const isUser = message.kind === 'user'
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        gap: 4,
        maxWidth: '100%',
      }}
    >
      <div
        style={{
          maxWidth: '78%',
          padding: '12px 16px',
          borderRadius: 18,
          background: isUser ? USER_BUBBLE_BG : BOT_BUBBLE_BG,
          color: isUser ? '#FFFFFF' : '#000',
          fontFamily: "'Inter', sans-serif",
          fontSize: 15,
          lineHeight: 1.4,
          boxShadow: isUser ? 'none' : '0 1px 2px rgba(0,0,0,0.06)',
        }}
      >
        {message.text}
      </div>
      {message.time ? (
        <span
          style={{
            fontSize: 11,
            color: '#9CA3AF',
            fontFamily: "'Inter', sans-serif",
            padding: '0 4px',
          }}
        >
          {message.time}
        </span>
      ) : null}
    </div>
  )
}
