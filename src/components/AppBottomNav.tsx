import {
  BottomNav,
  BottomNavContainer,
  type NavItem,
} from '@david-richard/notify-ds'
import { Package, Dashboard, Menu } from '@david-richard/notify-ds/icons'

export type AppNavValue = 'dashboard' | 'inventory' | 'menu'

const NAV_ITEMS: NavItem[] = [
  { value: 'dashboard', label: 'Dashboard', icon: <Dashboard /> },
  { value: 'inventory', label: 'Inventory', icon: <Package /> },
  { value: 'menu', label: 'Menu', icon: <Menu /> },
]

type Props = {
  value: AppNavValue
  onNavigate: (value: AppNavValue) => void
}

export function AppBottomNav({ value, onNavigate }: Props) {
  return (
    <BottomNavContainer>
      <BottomNav
        items={NAV_ITEMS}
        value={value}
        onValueChange={(v) => onNavigate(v as AppNavValue)}
      />
    </BottomNavContainer>
  )
}
