import { motion } from 'framer-motion'
import { Eye, Target, ArrowRight } from 'lucide-react'

export default function VisionMission() {
  return (
    <section className="relative py-24 lg:py-32 bg-light-gray overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute top-20 left-10 w-48 h-48 rounded-full bg-emerald/5 blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-gold/5 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #081C3A 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-gold">
            Strategic Direction
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-deep-navy tracking-tight">
            Our Purpose & Compass
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative overflow-hidden rounded-3xl bg-white border border-border-gray p-8 sm:p-10 hover:shadow-2xl hover:border-emerald/30 hover:-translate-y-1 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald via-emerald/50 to-transparent" />
            <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-gradient-to-bl from-emerald/5 to-transparent pointer-events-none" />

            <div className="relative flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald/10 to-emerald/5 text-emerald border border-emerald/15 mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald/10 transition-all duration-300">
                <Eye className="h-7 w-7" />
              </div>
              <ArrowRight className="h-5 w-5 text-emerald/30 group-hover:text-emerald/60 group-hover:translate-x-1 transition-all duration-300" />
            </div>
            
            <h3 className="text-2xl font-extrabold text-deep-navy group-hover:text-emerald transition-colors duration-300">Our Vision</h3>
            <p className="mt-4 text-sm text-medium-gray leading-relaxed">
              To build a globally trusted business ecosystem that empowers entrepreneurs, startups, and MSMEs through strategic guidance, financial knowledge, innovation, partnerships, and seamless capital connectivity.
            </p>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="group relative overflow-hidden rounded-3xl bg-white border border-border-gray p-8 sm:p-10 hover:shadow-2xl hover:border-gold/30 hover:-translate-y-1 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent" />
            <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-gradient-to-bl from-gold/5 to-transparent pointer-events-none" />

            <div className="relative flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/10 to-gold/5 text-gold border border-gold/15 mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-gold/10 transition-all duration-300">
                <Target className="h-7 w-7" />
              </div>
              <ArrowRight className="h-5 w-5 text-gold/30 group-hover:text-gold/60 group-hover:translate-x-1 transition-all duration-300" />
            </div>

            <h3 className="text-2xl font-extrabold text-deep-navy group-hover:text-gold transition-colors duration-300">Our Mission</h3>
            <p className="mt-4 text-sm text-medium-gray leading-relaxed">
              To help businesses strengthen their corporate foundations, improve funding readiness, access strategic partner opportunities, and achieve sustainable scale through advisor support, ecosystem collaboration, and secure investor networks.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
