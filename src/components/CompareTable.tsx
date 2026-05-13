export type CompareColumn = {
  key: string
  header: string
  align?: 'left' | 'right'
}

export type CompareRow = {
  /** Stable React key */
  id: string
  /** First column label */
  label: string
  /** Primary metric values keyed by column.key */
  primary: Record<string, string>
  /** Optional "Previous" comparison row rendered beneath, gray */
  previous?: Record<string, string>
}

type Props = {
  /** Columns excluding the label column (which is always the first one) */
  columns: CompareColumn[]
  rows: CompareRow[]
  /** Label for the comparison sub-row (default: "Previous") */
  comparisonLabel?: string
}

export function CompareTable({ columns, rows, comparisonLabel = 'Previous' }: Props) {
  const gridTemplate = ['1fr', ...columns.map(() => '1fr')].join(' ')

  return (
    <div
      style={{
        background: '#FFFFFF',
        fontFamily: "'Inter', sans-serif",
        fontSize: 14,
      }}
    >
      <div
        role="row"
        style={{
          display: 'grid',
          gridTemplateColumns: gridTemplate,
          gap: 12,
          padding: '14px 16px',
          fontWeight: 700,
          color: '#000',
          borderBottom: '1px solid #EAEAEA',
        }}
      >
        <span>Type</span>
        {columns.map((c) => (
          <span key={c.key} style={{ textAlign: c.align ?? 'left' }}>
            {c.header}
          </span>
        ))}
      </div>

      {rows.map((row, i) => (
        <div
          key={row.id}
          style={{
            padding: '14px 16px',
            borderTop: i === 0 ? 'none' : '1px solid #EAEAEA',
          }}
        >
          <div
            role="row"
            style={{
              display: 'grid',
              gridTemplateColumns: gridTemplate,
              gap: 12,
              color: '#000',
              fontWeight: 600,
            }}
          >
            <span>{row.label}</span>
            {columns.map((c) => (
              <span key={c.key} style={{ textAlign: c.align ?? 'left' }}>
                {row.primary[c.key] ?? ''}
              </span>
            ))}
          </div>
          {row.previous ? (
            <div
              role="row"
              style={{
                display: 'grid',
                gridTemplateColumns: gridTemplate,
                gap: 12,
                color: '#9CA3AF',
                marginTop: 4,
              }}
            >
              <span>{comparisonLabel}</span>
              {columns.map((c) => (
                <span key={c.key} style={{ textAlign: c.align ?? 'left' }}>
                  {row.previous?.[c.key] ?? ''}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}
