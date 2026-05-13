import { EmptyState } from '../components/EmptyState'
import { MenuTargetPage } from '../components/MenuTargetPage'
import { BoxIcon, MenuIcon } from '../icons'

/** Five thin menu-target pages that share a "coming soon" body. Each owns
 *  its title + bottom-nav handlers; the body fill-out happens screen-by-
 *  screen as design lands. Kept in one module so the file count doesn't
 *  balloon for what is still placeholder content. */

type CommonProps = {
  onDashboard: () => void
  onInventory: () => void
  onMenu: () => void
}

function Placeholder({
  title,
  description = 'Coming soon.',
  ...rest
}: CommonProps & { title: string; description?: string }) {
  return (
    <MenuTargetPage title={title} {...rest}>
      <EmptyState
        icon={<MenuIcon size={48} />}
        title={`${title} screen`}
        description={description}
      />
    </MenuTargetPage>
  )
}

export function Settings(props: CommonProps) {
  return <Placeholder title="Settings" {...props} />
}

export function DigitalChannels(props: CommonProps) {
  return <Placeholder title="Digital Channels" {...props} />
}

export function KitchenIntelligence(props: CommonProps) {
  return (
    <MenuTargetPage title="Kitchen Intelligence" {...props}>
      <EmptyState
        icon={<BoxIcon size={48} />}
        title="Kitchen Intelligence"
        description="Dark-surface dashboard with 72px score lands in a later tier."
      />
    </MenuTargetPage>
  )
}

export function Analyze(props: CommonProps) {
  return <Placeholder title="Analyze" {...props} />
}

export function ProductTour(props: CommonProps) {
  return <Placeholder title="Product Tour" {...props} />
}
