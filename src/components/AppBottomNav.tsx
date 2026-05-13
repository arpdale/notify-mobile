import {
  BottomNav,
  BottomNavContainer,
  type NavItem,
} from '@david-richard/notify-ds'
import { BoxIcon, DashboardIcon, MenuIcon } from '../icons'

export type AppNavValue = 'dashboard' | 'inventory' | 'menu'

const NAV_ITEMS: NavItem[] = [
  { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { value: 'inventory', label: 'Inventory', icon: <BoxIcon /> },
  { value: 'menu', label: 'Menu', icon: <MenuIcon /> },
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
