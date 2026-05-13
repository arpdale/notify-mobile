import type { ReactNode } from 'react'

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        background:
          'linear-gradient(180deg, #1f1f23 0%, #0c0c0f 100%) fixed',
        padding: '24px 0',
      }}
    >
      <div
        style={{
          width: 'min(390px, 100vw)',
          minHeight: 'min(844px, calc(100svh - 48px))',
          background: 'var(--color-surface-app, #F4F4F4)',
          borderRadius: 32,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </div>
    </div>
  )
}
