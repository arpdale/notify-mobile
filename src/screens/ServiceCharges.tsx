import { DetailCard, DetailShell } from '../components/DetailShell'
import { CategoryPieChart, type PieSlice } from '../components/charts/CategoryPieChart'
import {
  CompareTable,
  type CompareColumn,
  type CompareRow,
} from '../components/CompareTable'

const AMOUNT_SLICES: PieSlice[] = [
  { name: 'EZC Open $ Service Charge', value: 100 },
]

const COUNT_SLICES: PieSlice[] = [
  { name: 'EZC Open $ Service Charge', value: 100 },
]

const COLUMNS: CompareColumn[] = [
  { key: 'count', header: 'Count (% Total)', align: 'left' },
  { key: 'amount', header: 'Amount (% Total)', align: 'left' },
]

const ROWS: CompareRow[] = [
  {
    id: 'ezc-open-dollar',
    label: 'EZC Open $ Discount',
    primary: { count: '$4.00 (100%)', amount: '$40.00 (100%)' },
    previous: { count: '$18.00 (100%)', amount: '$180.00 (100%)' },
  },
]

type Props = {
  onBack: () => void
  onPickStores?: () => void
  onPickDate?: () => void
}

export function ServiceCharges({ onBack, onPickStores, onPickDate }: Props) {
  return (
    <DetailShell
      title="Service Charges"
      onBack={onBack}
      onPickStores={onPickStores}
      onPickDate={onPickDate}
    >
      <DetailCard title="Service Charges Amount by Title" onExpand={() => undefined}>
        <CategoryPieChart data={AMOUNT_SLICES} />
      </DetailCard>
      <DetailCard title="Service Charges Count by Title">
        <CategoryPieChart data={COUNT_SLICES} />
      </DetailCard>
      <CompareTable columns={COLUMNS} rows={ROWS} />
    </DetailShell>
  )
}
