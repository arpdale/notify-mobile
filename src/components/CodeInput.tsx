import {
  useEffect,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react'

type Props = {
  value: string
  onChange: (next: string) => void
  /** Number of input boxes (default 6) */
  length?: number
  autoFocus?: boolean
  /** Mark every box red — pairs with an error toast above the CTA */
  error?: boolean
  /** Accepts non-digits (default false — restricts to 0-9) */
  allowAlphanumeric?: boolean
  /** ARIA label applied to each box ("Digit 1 of 6", etc.) */
  ariaLabel?: string
  id?: string
}

const BOX_SIZE = 48

export function CodeInput({
  value,
  onChange,
  length = 6,
  autoFocus,
  error,
  allowAlphanumeric,
  ariaLabel = 'Digit',
  id,
}: Props) {
  const refs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus()
  }, [autoFocus])

  const sanitize = (raw: string) =>
    allowAlphanumeric ? raw.replace(/[^0-9a-zA-Z]/g, '') : raw.replace(/[^0-9]/g, '')

  const writeAt = (index: number, char: string) => {
    const chars = value.padEnd(length, ' ').split('')
    chars[index] = char || ' '
    const next = chars.join('').replace(/ +$/g, '')
    onChange(next.slice(0, length))
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const cleaned = sanitize(e.target.value).slice(-1)
    if (!cleaned) return
    writeAt(index, cleaned)
    refs.current[Math.min(index + 1, length - 1)]?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const current = value[index]
      if (current) {
        writeAt(index, '')
      } else if (index > 0) {
        writeAt(index - 1, '')
        refs.current[index - 1]?.focus()
      }
      e.preventDefault()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      refs.current[index - 1]?.focus()
      e.preventDefault()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      refs.current[index + 1]?.focus()
      e.preventDefault()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>, index: number) => {
    const pasted = sanitize(e.clipboardData.getData('text')).slice(0, length - index)
    if (!pasted) return
    e.preventDefault()
    const chars = value.padEnd(length, ' ').split('')
    for (let i = 0; i < pasted.length; i++) {
      chars[index + i] = pasted[i]
    }
    const next = chars.join('').replace(/ +$/g, '').slice(0, length)
    onChange(next)
    const focusTarget = Math.min(index + pasted.length, length - 1)
    refs.current[focusTarget]?.focus()
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${length}, 1fr)`,
        gap: 8,
      }}
      role="group"
      aria-label={ariaLabel}
    >
      {Array.from({ length }).map((_, i) => {
        const char = value[i] ?? ''
        const isFilled = char.length > 0
        return (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el
            }}
            id={id ? `${id}-${i}` : undefined}
            aria-label={`${ariaLabel} ${i + 1} of ${length}`}
            value={char}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={(e) => handlePaste(e, i)}
            inputMode={allowAlphanumeric ? 'text' : 'numeric'}
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            style={{
              width: '100%',
              height: BOX_SIZE,
              textAlign: 'center',
              fontFamily: "'Inter', sans-serif",
              fontSize: 22,
              fontWeight: 600,
              color: '#000',
              background: '#FFFFFF',
              borderRadius: 12,
              border: `1.5px solid ${
                error
                  ? 'var(--color-destructive,#EF2149)'
                  : isFilled
                  ? '#000000'
                  : 'var(--color-interactive-secondary,#339FB8)'
              }`,
              outline: 'none',
              padding: 0,
            }}
            onFocus={(e) => {
              if (!error) e.currentTarget.style.borderColor = 'var(--color-accent,#40CCF2)'
            }}
            onBlur={(e) => {
              if (!error)
                e.currentTarget.style.borderColor = isFilled ? '#000000' : 'var(--color-interactive-secondary,#339FB8)'
            }}
          />
        )
      })}
    </div>
  )
}
