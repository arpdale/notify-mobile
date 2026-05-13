import { DetailCard, DetailShell } from '../components/DetailShell'
import { CategoryPieChart, type PieSlice } from '../components/charts/CategoryPieChart'
import { CompareTable, type CompareColumn, type CompareRow } from '../components/CompareTable'

const SLICES: PieSlice[] = [
  { name: 'EZCater', value: 1085 },
  { name: 'UberEats', value: 80.48 },
  { name: 'Cash2', value: 44.91 },
]

const COLUMNS: CompareColumn[] = [
  { key: 'amount', header: 'Amount (% Total)', align: 'right' },
]

const ROWS: CompareRow[] = [
  {
    id: 'cash2',
    label: 'Cash2',
    primary: { amount: '$44.91 (3.7%)' },
    previous: { amount: '$37.67 (0.7%)' },
  },
  {
    id: 'ezcater',
    label: 'EZCater',
    primary: { amount: '$1,085 (89.6%)' },
    previous: { amount: '$4,882.50 (91.7%)' },
  },
  {
    id: 'ubereats',
    label: 'UberEats',
    primary: { amount: '$80.48 (6.6%)' },
    previous: { amount: '$382.28 (7.2%)' },
  },
  {
    id: 'doordash',
    label: 'Doordash',
    primary: { amount: '$0.00 (0%)' },
    previous: { amount: '$22.00 (0.4%)' },
  },
  {
    id: 'offline-credit',
    label: 'Offline Credit',
    primary: { amount: '$0.00 (0%)' },
  },
]

type Props = {
  onBack: () => void
  onPickStores?: () => void
  onPickDate?: () => void
  storeLabel?: string
  dateLabel?: string
}

export function Payments({
  onBack,
  onPickStores,
  onPickDate,
  storeLabel,
  dateLabel,
}: Props) {
  return (
    <DetailShell
      title="Payments"
      onBack={onBack}
      onPickStores={onPickStores}
      onPickDate={onPickDate}
      storeLabel={storeLabel}
      dateLabel={dateLabel}
    >
      <DetailCard title="Payments Amounts by Title" onExpand={() => undefined}>
        <CategoryPieChart data={SLICES} />
      </DetailCard>
      <CompareTable columns={COLUMNS} rows={ROWS} />
    </DetailShell>
  )
}
