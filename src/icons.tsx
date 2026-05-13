import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function base({ size = 20, strokeWidth = 1.75, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...props,
  }
}

export function BellIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 8a6 6 0 1 1 12 0c0 4 2 5 2 7H4c0-2 2-3 2-7Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  )
}

export function StoreIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 9 5 4h14l2 5" />
      <path d="M4 9v10h16V9" />
      <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
    </svg>
  )
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </svg>
  )
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

export function DashboardIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" />
      <rect x="13" y="10" width="8" height="11" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
    </svg>
  )
}

export function BoxIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 7 12 3l9 4-9 4-9-4Z" />
      <path d="M3 7v10l9 4 9-4V7" />
      <path d="M12 11v10" />
    </svg>
  )
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

export function EyeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function InfoCircleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 7v6" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" />
    </svg>
  )
}

export function ArchiveXIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="4" width="18" height="4" rx="1" />
      <path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" />
      <path d="m10 13 4 4M14 13l-4 4" />
    </svg>
  )
}

export function FilterIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  )
}

export function ShareIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3v12M7 8l5-5 5 5" />
      <path d="M5 14v6h14v-6" />
    </svg>
  )
}

export function TicketIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-2Z" />
      <path d="M9 6v12" />
    </svg>
  )
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13Z" />
      <circle cx="12" cy="9" r="3" />
    </svg>
  )
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  )
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

export function FaceIdIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2" />
      <path d="M9 10v1M15 10v1M12 9v5l-1 1h1M9 16c1 1 2 1.5 3 1.5s2-.5 3-1.5" />
    </svg>
  )
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 20h14" />
    </svg>
  )
}

export function ArrowUpIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 20V4M5 11l7-7 7 7" />
    </svg>
  )
}
