import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import {
  LayoutDashboard,
  User,
  Building2,
  Users,
  FileText,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  LogOut,
  BarChart3,
  ClipboardCheck,
  Store,
  Briefcase,
} from 'lucide-react'
import { useAuth } from '../../lib/auth-context'
import type { ReactNode } from 'react'

export interface DashboardNavItem {
  label: string
  href: string
  icon: typeof LayoutDashboard
}

export const founderNav: DashboardNavItem[] = [
  { label: 'Dashboard', href: '/dashboard/founder', icon: LayoutDashboard },
  { label: 'My Profile', href: '/dashboard/founder/profile', icon: User },
  { label: 'Startup', href: '/dashboard/founder/startup', icon: Building2 },
  { label: 'Team', href: '/dashboard/founder/team', icon: Users },
  { label: 'Documents', href: '/dashboard/founder/documents', icon: FileText },
  { label: 'KYC', href: '/dashboard/founder/kyc', icon: ShieldCheck },
]

export const msmeNav: DashboardNavItem[] = [
  { label: 'Dashboard', href: '/dashboard/msme', icon: LayoutDashboard },
  { label: 'Business Details', href: '/dashboard/msme/business', icon: Store },
  { label: 'Financial Health', href: '/dashboard/msme/financial-health', icon: BarChart3 },
  { label: 'Compliance', href: '/dashboard/msme/compliance', icon: ClipboardCheck },
  { label: 'Employees & Export', href: '/dashboard/msme/employees', icon: Briefcase },
  { label: 'Documents', href: '/dashboard/msme/documents', icon: FileText },
]

export default function DashboardLayout({ children, navItems }: { children: ReactNode; navItems: DashboardNavItem[] }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [location] = useLocation()
  const { user, logout } = useAuth()

  const dashboardName = location.startsWith('/dashboard/founder') ? 'Founder Dashboard' : 'MSME Dashboard'

  return (
    <div className="flex min-h-screen bg-light-gray">
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-border-gray transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-border-gray">
          <Link href="/" className="flex items-center gap-2 group">
            <Sparkles className="h-4.5 w-4.5 text-gold" />
            <span className="text-base font-black tracking-tight text-deep-navy">
              ANTARA{' '}
              <span className="font-light text-gold">GLOBAL</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-medium-gray hover:text-deep-navy hover:bg-light-gray transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = location === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-deep-navy text-white shadow-md shadow-deep-navy/15'
                    : 'text-medium-gray hover:bg-light-gray hover:text-deep-navy'
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {item.label}
                {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border-gray">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 text-gold text-xs font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-deep-navy truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-medium-gray/70 truncate">{user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-2.5 mt-1 rounded-xl text-sm font-semibold text-error hover:bg-error/5 transition-all duration-150"
          >
            <LogOut className="h-4.5 w-4.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-deep-navy/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 h-16 bg-white/90 border-b border-border-gray/60 backdrop-blur-xl flex items-center px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-medium-gray hover:text-deep-navy hover:bg-light-gray transition-all mr-3"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-medium-gray hover:text-deep-navy transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-medium-gray/50" />
            <span className="text-deep-navy font-semibold">{dashboardName}</span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
