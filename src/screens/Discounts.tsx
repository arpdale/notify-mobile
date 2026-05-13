import { DetailCard, DetailShell } from '../components/DetailShell'
import { CategoryPieChart, type PieSlice } from '../components/charts/CategoryPieChart'
import {
  CompareTable,
  type CompareColumn,
  type CompareRow,
} from '../components/CompareTable'

const AMOUNT_SLICES: PieSlice[] = [
  { name: 'Anit Auto %', value: 63.5 },
  { name: 'EZC Open $ Discount', value: 26.0 },
  { name: 'Anit Auto $', value: 10.4 },
]

const COUNT_SLICES: PieSlice[] = [
  { name: 'Anit Auto $', value: 40.0 },
  { name: 'Anit Auto %', value: 40.0 },
  { name: 'EZC Open % Discount', value: 20.0 },
]

const COLUMNS: CompareColumn[] = [
  { key: 'count', header: 'Count (% Total)', align: 'left' },
  { key: 'amount', header: 'Amount (% Total)', align: 'left' },
]

const ROWS: CompareRow[] = [
  {
    id: 'anit-auto-dollar',
    label: 'Anit Auto $',
    primary: { count: '$8.00 (40.0%)', amount: '$8.00 (10.4%)' },
    previous: { count: '$37.00 (39.4%)', amount: '$37.00 (10.3%)' },
  },
  {
    id: 'anit-auto-percent',
    label: 'Anit Auto %',
    primary: { count: '$8.00 (40.0%)', amount: '$48.80 (63.5%)' },
    previous: { count: '$37.00 (39.4%)', amount: '$221.80 (61.6%)' },
  },
  {
    id: 'ezc-open-dollar',
    label: 'EZC Open $ Discount',
    primary: { count: '$4.00 (20.0%)', amount: '$20.00 (26.0%)' },
    previous: { count: '$18.00 (19.1%)', amount: '$90.00 (25.0%)' },
  },
  {
    id: 'dt-1-dollar',
    label: 'DT 1$ Discount',
    primary: { count: '$0.00 (0.0%)', amount: '$80.48 (0.0%)' },
    previous: { count: '$1.00 (1.1%)', amount: '$4.00 (1.1%)' },
  },
  {
    id: 'dt-50-percent',
    label: 'DT 50% Discount',
    primary: { count: '$0.00 (0.0%)', amount: '$0.00 (0.0%)' },
    previous: { count: '$1.00 (1.1%)', amount: '$7.00 (1.9%)' },
  },
]

type Props = {
  onBack: () => void
  onPickStores?: () => void
  onPickDate?: () => void
}

export function Discounts({ onBack, onPickStores, onPickDate }: Props) {
  return (
    <DetailShell
      title="Discounts"
      onBack={onBack}
      onPickStores={onPickStores}
      onPickDate={onPickDate}
    >
      <DetailCard title="Discounts Amounts by Title" onExpand={() => undefined}>
        <CategoryPieChart data={AMOUNT_SLICES} />
      </DetailCard>
      <DetailCard title="Discounts Count by Title">
        <CategoryPieChart data={COUNT_SLICES} />
      </DetailCard>
      <CompareTable columns={COLUMNS} rows={ROWS} />
    </DetailShell>
  )
}
