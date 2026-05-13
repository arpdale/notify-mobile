import type { ReactNode } from 'react'

export type DataTableColumn<T> = {
  /** Unique key — used for React keys + default cell accessor */
  key: string
  header: string
  align?: 'left' | 'right'
  /** When set, header shows a sort indicator and becomes clickable */
  sortDirection?: 'asc' | 'desc'
  onSort?: () => void
  /** Custom cell renderer; defaults to (row as any)[key] */
  render?: (row: T) => ReactNode
  /** Optional explicit width (px or fr); otherwise grid auto-sizes */
  width?: string
}

type Props<T> = {
  columns: DataTableColumn<T>[]
  rows: T[]
  getRowKey: (row: T) => string
  onRowClick?: (row: T) => void
}

function SortGlyph({ direction }: { direction: 'asc' | 'desc' }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        marginLeft: 4,
        fontSize: 10,
        transform: direction === 'asc' ? 'rotate(0deg)' : 'rotate(180deg)',
      }}
    >
      ▲
    </span>
  )
}

export function DataTable<T>({ columns, rows, getRowKey, onRowClick }: Props<T>) {
  const gridTemplate = columns
    .map((c) => c.width ?? (c.align === 'right' ? 'auto' : '1fr'))
    .join(' ')

  return (
    <div
      role="table"
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 4px rgba(0,0,0,0.04)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        role="row"
        style={{
          display: 'grid',
          gridTemplateColumns: gridTemplate,
          gap: 12,
          padding: '14px 16px',
          fontSize: 14,
          fontWeight: 500,
          color: '#6B7280',
          borderBottom: '1px solid #EAEAEA',
        }}
      >
        {columns.map((c) => (
          <div
            key={c.key}
            role="columnheader"
            onClick={c.onSort}
            style={{
              cursor: c.onSort ? 'pointer' : 'default',
              textAlign: c.align ?? 'left',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              justifyContent: c.align === 'right' ? 'flex-end' : 'flex-start',
              color: c.sortDirection ? '#000' : '#6B7280',
              userSelect: 'none',
            }}
          >
            {c.header}
            {c.sortDirection ? <SortGlyph direction={c.sortDirection} /> : null}
          </div>
        ))}
      </div>

      {rows.map((row, i) => (
        <div
          key={getRowKey(row)}
          role="row"
          onClick={() => onRowClick?.(row)}
          style={{
            display: 'grid',
            gridTemplateColumns: gridTemplate,
            gap: 12,
            padding: '14px 16px',
            fontSize: 14,
            color: '#000',
            cursor: onRowClick ? 'pointer' : 'default',
            borderTop: i === 0 ? 'none' : '1px solid #EAEAEA',
            alignItems: 'center',
            minHeight: 48,
          }}
        >
          {columns.map((c) => (
            <div
              key={c.key}
              role="cell"
              style={{
                textAlign: c.align ?? 'left',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: c.align === 'right' ? 'flex-end' : 'flex-start',
                gap: 6,
              }}
            >
              {c.render
                ? c.render(row)
                : String((row as Record<string, unknown>)[c.key] ?? '')}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
