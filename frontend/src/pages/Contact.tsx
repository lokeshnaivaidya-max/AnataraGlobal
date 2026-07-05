import { motion } from 'framer-motion'
import { Sparkles, Mail, MapPin, Globe } from 'lucide-react'
import ContactSection from '../components/about/ContactSection'

export default function Contact() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-deep-navy via-deep-navy-dark to-deep-navy pt-28 pb-16">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-80 h-80 rounded-full bg-gold/10 blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-emerald/10 blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold text-gold-light border border-gold/20 mb-6"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Get In Touch
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight"
            >
              Let's Build<br />
              <span className="bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
                Something Great
              </span>
              <br />
              Together
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-white/70 leading-relaxed max-w-xl"
            >
              Ready to take your business to the next level? Reach out to us and let's discuss
              how Antara Global can support your growth journey.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="relative py-16 bg-white border-b border-border-gray">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Mail, label: 'Email', value: 'hello@antaraglobal.com', href: 'mailto:hello@antaraglobal.com' },
              { icon: MapPin, label: 'Location', value: 'Global Operations' },
              { icon: Globe, label: 'Connect', value: 'Follow us on LinkedIn' },
            ].map((item, idx) => {
              const ItemIcon = item.icon
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4 rounded-2xl border border-border-gray bg-light-gray/50 p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold/15 to-gold/5 text-gold border border-gold/15 shrink-0">
                    <ItemIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-medium-gray">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm font-bold text-deep-navy hover:text-gold transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-bold text-deep-navy">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  )
}
