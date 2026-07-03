// =============================================================================
// navConfig.ts — Antara Global Navigation Data Structure
// =============================================================================

export interface NavItem {
  label: string
  href: string
}

export interface NavGroup {
  heading: string
  items: NavItem[]
}

export interface NavDropdown {
  type: 'flat' | 'grouped'
  flat?: NavItem[]
  groups?: NavGroup[]
}

export interface NavLink {
  label: string
  href?: string
  dropdown?: NavDropdown
}

export const navConfig: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Ecosystem', href: '/ecosystem' },
  { label: 'Knowledge Hub', href: '/knowledge' },
  { label: 'Contact', href: '/contact' },
]

// Phase 2 / 3 portals — hidden until implemented
export const futureLinks: NavItem[] = [
  { label: 'Founder Dashboard', href: '/dashboard/founder' },
  { label: 'Investor Portal',   href: '/portal/investor' },
  { label: 'Partner Portal',    href: '/portal/partner' },
  { label: 'Login / Sign In',   href: '/login' },
]
