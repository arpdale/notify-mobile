import { DetailCard, DetailShell } from '../components/DetailShell'
import { CategoryPieChart, type PieSlice } from '../components/charts/CategoryPieChart'
import {
  CompareTable,
  type CompareColumn,
  type CompareRow,
} from '../components/CompareTable'

const AMOUNT_SLICES: PieSlice[] = [
  { name: 'Anit Tax', value: 96.9 },
  { name: 'DT Miami Tax', value: 2.7 },
  { name: 'DT Burger Tax', value: 0.4 },
]

const COUNT_SLICES: PieSlice[] = [
  { name: 'Anit Tax', value: 47.1 },
  { name: 'DT Miami Tax', value: 35.3 },
  { name: 'DT Burger Tax', value: 17.6 },
]

const COLUMNS: CompareColumn[] = [
  { key: 'count', header: 'Count (% Total)', align: 'left' },
  { key: 'amount', header: 'Amount (% Total)', align: 'left' },
]

const ROWS: CompareRow[] = [
  {
    id: 'anit-tax',
    label: 'Anit Tax',
    primary: { count: '$8.00 (47.0%)', amount: '$76.28 (10.4%)' },
    previous: { count: '$37.00 (71.2%)', amount: '$344.58 (10.3%)' },
  },
  {
    id: 'dt-burger-tax',
    label: 'DT Burger Tax',
    primary: { count: '$3.00 (17.6%)', amount: '$0.30 (0.4%)' },
    previous: { count: '$6.00 (11.5%)', amount: '$0.40 (0.1%)' },
  },
  {
    id: 'dt-miami-tax',
    label: 'DT Miami Tax',
    primary: { count: '$6.00 (35.3%)', amount: '$2.13 (2.7%)' },
    previous: { count: '$9.00 (17.3%)', amount: '$1.78 (0.5%)' },
  },
]

type Props = {
  onBack: () => void
  onPickStores?: () => void
  onPickDate?: () => void
  storeLabel?: string
  dateLabel?: string
}

export function Taxes({
  onBack,
  onPickStores,
  onPickDate,
  storeLabel,
  dateLabel,
}: Props) {
  return (
    <DetailShell
      title="Taxes"
      onBack={onBack}
      onPickStores={onPickStores}
      onPickDate={onPickDate}
      storeLabel={storeLabel}
      dateLabel={dateLabel}
    >
      <DetailCard title="Taxes Amount by Title" onExpand={() => undefined}>
        <CategoryPieChart data={AMOUNT_SLICES} />
      </DetailCard>
      <DetailCard title="Taxes Count by Title">
        <CategoryPieChart data={COUNT_SLICES} />
      </DetailCard>
      <CompareTable columns={COLUMNS} rows={ROWS} />
    </DetailShell>
  )
}
