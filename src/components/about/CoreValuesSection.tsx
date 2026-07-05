import { motion } from 'framer-motion'
import {
  ShieldCheck, BookOpen, Sparkles, Users, Award, TrendingUp, ArrowRight
} from 'lucide-react'

const values = [
  {
    icon: ShieldCheck,
    title: 'Integrity',
    desc: 'Building relationships based on trust, transparency, and ethical business practices.',
    points: ['Honest communication', 'Transparent approach', 'Trust-based partnerships'],
  },
  {
    icon: BookOpen,
    title: 'Knowledge',
    desc: 'Empowering informed decision-making through financial awareness and business understanding.',
    points: ['Business education', 'Financial awareness', 'Better decision-making'],
  },
  {
    icon: Sparkles,
    title: 'Innovation',
    desc: 'Encouraging forward-thinking ideas, modern solutions, and progressive business growth.',
    points: ['New opportunities', 'Creative thinking', 'Future-focused approach'],
  },
  {
    icon: Users,
    title: 'Collaboration',
    desc: 'Creating meaningful opportunities through partnerships, networks, and ecosystem connections.',
    points: ['Strategic partnerships', 'Expert networks', 'Shared growth'],
  },
  {
    icon: Award,
    title: 'Excellence',
    desc: 'Delivering structured, professional, and value-driven support to businesses.',
    points: ['Quality execution', 'Professional approach', 'Continuous improvement'],
  },
  {
    icon: TrendingUp,
    title: 'Growth',
    desc: 'Enabling sustainable and scalable business success through strategic support.',
    points: ['Long-term value creation', 'Business expansion', 'Sustainable progress'],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

export default function CoreValuesSection() {
  return (
    <section className="relative py-24 lg:py-32 bg-light-gray overflow-hidden">
      <div className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 right-0 w-1/2 h-px bg-gradient-to-l from-transparent via-emerald/20 to-transparent" />
      <div className="absolute top-1/3 right-10 w-48 h-48 rounded-full bg-gold/5 blur-3xl animate-float" />
      <div className="absolute bottom-1/3 left-10 w-48 h-48 rounded-full bg-emerald/5 blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-gold">Our Core Values</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-deep-navy tracking-tight">
            Principles That Drive Us
          </h2>
          <p className="mt-4 text-medium-gray text-base leading-relaxed">
            Our values define how we build relationships, support businesses, and create meaningful growth
            opportunities through trust, knowledge, collaboration, and excellence.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {values.map((value, idx) => {
            const Icon = value.icon
            const isGold = idx % 2 === 0
            return (
              <motion.div
                key={value.title}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="group relative rounded-3xl bg-white border border-border-gray p-7 shadow-md hover:shadow-2xl transition-all duration-500"
              >
                <div className={`absolute top-0 left-0 w-full h-1 rounded-t-3xl bg-gradient-to-r ${
                  isGold ? 'from-gold via-gold/40' : 'from-emerald via-emerald/40'
                } to-transparent`} />

                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border mb-5 transition-all duration-300 group-hover:scale-110 ${
                  isGold
                    ? 'bg-gradient-to-br from-gold/15 to-gold/5 text-gold border-gold/15 group-hover:shadow-lg group-hover:shadow-gold/20'
                    : 'bg-gradient-to-br from-emerald/15 to-emerald/5 text-emerald border-emerald/15 group-hover:shadow-lg group-hover:shadow-emerald/20'
                }`}>
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className={`text-lg font-extrabold text-deep-navy transition-colors duration-300 ${
                  isGold ? 'group-hover:text-gold' : 'group-hover:text-emerald'
                }`}>
                  {value.title}
                </h3>
                <p className="mt-2 text-xs text-medium-gray leading-relaxed">{value.desc}</p>

                <ul className="mt-5 pt-5 border-t border-border-gray space-y-2">
                  {value.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-xs text-deep-navy/70 font-medium">
                      <span className={`h-1.5 w-1.5 rounded-full ${isGold ? 'bg-gold' : 'bg-emerald'}`} />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Brand Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="relative inline-block max-w-3xl w-full">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-gold/20 via-emerald/10 to-gold/20 blur-md" />
            <div className="relative rounded-3xl bg-gradient-to-r from-deep-navy via-deep-navy to-deep-navy-dark p-8 sm:p-10 border border-white/5 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
              <p className="text-base sm:text-lg font-semibold text-white/90 leading-relaxed max-w-xl mx-auto">
                At Antara Global, growth is not only measured by scale but by the strength of relationships,
                knowledge, partnerships, and sustainable impact created along the journey.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-dark px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md hover:shadow-lg hover:shadow-gold/30 hover:scale-105 transition-all duration-300"
            >
              Connect With Us
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/solutions"
              className="inline-flex items-center gap-2 rounded-xl border border-deep-navy/20 px-6 py-3 text-sm font-bold uppercase tracking-wider text-deep-navy hover:bg-deep-navy/5 transition-all duration-300"
            >
              Start Your Journey
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
