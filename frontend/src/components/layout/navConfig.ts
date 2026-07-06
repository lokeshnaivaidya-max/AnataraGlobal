export interface NavItem {
  label: string
  href: string
}

export interface NavLink {
  label: string
  href?: string
}

export const navConfig: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Target Audience', href: '/target-audience' },
  { label: 'Ecosystem', href: '/ecosystem' },
  { label: 'Why Us', href: '/differentiator' },
  { label: 'Core Values', href: '/core-values' },
]

export const authLinks = {
  login: { label: 'Sign In', href: '/login' },
  register: { label: 'Get Started', href: '/register' },
}

export const userMenuLinks: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard/founder' },
  { label: 'MFA Settings', href: '/mfa/setup' },
  { label: 'Devices', href: '/devices' },
  { label: 'Sessions', href: '/sessions' },
]
