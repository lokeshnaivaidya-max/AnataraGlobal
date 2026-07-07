import { Link } from 'wouter'
import { Mail, MapPin, Globe, Share2, Play } from 'lucide-react'

const socialLinks = [
  { icon: Globe, label: 'LinkedIn' },
  { icon: Share2, label: 'Twitter' },
  { icon: Play, label: 'YouTube' },
]

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Target Audience', href: '/target-audience' },
  { label: 'Ecosystem', href: '/ecosystem' },
  { label: 'Why Us', href: '/differentiator' },
  { label: 'Core Values', href: '/core-values' },
  { label: 'Knowledge', href: '/knowledge' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
      <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, #FD7C06, transparent)' }} />
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(253,124,6,0.06)' }} />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(253,124,6,0.06)' }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 group">
              <img
                src="/image.png"
                alt="Antara Global"
                className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-2xl font-bold tracking-tight" style={{ color: '#FFFFFF' }}>
                ANTARA{' '}
                <span className="font-light" style={{ color: '#FD7C06' }}>GLOBAL</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed max-w-md" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Strategic business advisory, venture readiness, and capital connectivity
              ecosystem helping businesses prepare, connect, and grow.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 hover:scale-110"
                  style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#FD7C06'; e.currentTarget.style.borderColor = 'rgba(253,124,6,0.3)'; e.currentTarget.style.backgroundColor = 'rgba(253,124,6,0.1)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.backgroundColor = 'transparent' }}
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm transition-all duration-200 inline-block"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#FD7C06'; e.currentTarget.style.transform = 'translateX(4px)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.transform = 'translateX(0)' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm group" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <Mail className="h-4 w-4 mt-0.5 shrink-0 transition-colors" style={{ color: 'rgba(253,124,6,0.5)' }} />
                <span className="transition-colors">hello@antaraglobal.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm group" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 transition-colors" style={{ color: 'rgba(253,124,6,0.5)' }} />
                <span className="transition-colors">Global Operations</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            &copy; {new Date().getFullYear()} Antara Global. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <a href="#" className="transition-all hover:underline" style={{ color: 'inherit' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FD7C06'} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>Privacy Policy</a>
            <a href="#" className="transition-all hover:underline" style={{ color: 'inherit' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FD7C06'} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
