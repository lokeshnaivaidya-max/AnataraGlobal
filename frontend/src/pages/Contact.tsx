import { motion } from 'framer-motion'
import { Sparkles, Mail, MapPin, Globe, ArrowRight } from 'lucide-react'
import ContactSection from '../components/about/ContactSection'

export default function Contact() {
  return (
    <>
      {/* ── Hero + Contact Info (two-column, full-screen) ── */}
      <section className="relative min-h-screen overflow-hidden pt-28 pb-16" style={{ backgroundColor: '#FFF8F2' }}>
        <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, #FD7C06, transparent)' }} />
        <div className="mx-auto relative w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20">
            {/* Left: Heading */}
            <div className="lg:pr-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border text-white"
                style={{ backgroundColor: '#000000', borderColor: '#000000' }}>
                <Sparkles className="h-3.5 w-3.5" />
                Get In Touch
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="mt-6 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-none" style={{ color: '#000000' }}>
                Let's Build{' '}
                <span className="block sm:inline" style={{ color: '#FD7C06' }}>Something Great</span>{' '}
                Together
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="mt-6 text-sm sm:text-base leading-relaxed max-w-md min-h-[4.5rem]" style={{ color: 'rgba(0,0,0,0.6)' }}>
                Ready to take your business to the next level? Reach out to us and let's discuss how Antara Global can support your growth journey through strategic advisory, venture readiness, capital connectivity, and ecosystem partnerships. Our team works closely with founders and business owners to understand their unique needs and craft a tailored roadmap for sustainable growth and investment preparedness.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 flex flex-wrap gap-4">
                <a href="/services"
                  className="group inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold border-2 border-black shadow-lg transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: '#FFFFFF', color: '#000000' }}>
                  Explore Services <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a href="/target-audience"
                  className="inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: '#000000' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FD7C06'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}>
                  Start Your Journey
                </a>
              </motion.div>
            </div>

            {/* Right: Contact Info Cards */}
            <div className="space-y-5">
              {[
                { icon: Mail, label: 'Email', value: 'hello@antaraglobal.com', href: 'mailto:hello@antaraglobal.com' },
                { icon: MapPin, label: 'Location', value: 'Global Operations' },
                { icon: Globe, label: 'Connect', value: 'Follow us on LinkedIn' },
              ].map((item, idx) => {
                const ItemIcon = item.icon
                return (
                  <motion.div key={item.label} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex items-center gap-5 rounded-2xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl shrink-0"
                      style={{ backgroundColor: 'rgba(253,124,6,0.08)', border: '1px solid rgba(253,124,6,0.15)', color: '#FD7C06' }}>
                      <ItemIcon className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(0,0,0,0.4)' }}>{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-base font-bold transition-colors" style={{ color: '#000000' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#FD7C06'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#000000'}>
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-base font-bold" style={{ color: '#000000' }}>{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  )
}
