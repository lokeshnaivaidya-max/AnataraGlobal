import { motion } from 'framer-motion'
import {
  ShieldCheck, BookOpen, Sparkles, Users, Award, TrendingUp, ArrowRight, Play
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

export default function CoreValues() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-deep-navy via-deep-navy-dark to-deep-navy pt-28 pb-16">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-80 h-80 rounded-full bg-gold/10 blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-emerald/10 blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold via-emerald to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold text-gold-light border border-gold/20 mb-6"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Our Core Values
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight"
            >
              Principles<br />
              <span className="bg-gradient-to-r from-gold-light via-gold to-emerald bg-clip-text text-transparent">
                That Drive Us
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-white/70 leading-relaxed max-w-xl"
            >
              Our values define how we build relationships, support businesses, and create meaningful growth
              opportunities through trust, knowledge, collaboration, and excellence.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <a
                href="/contact"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-dark px-6 py-3.5 text-sm font-semibold text-deep-navy shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30 hover:scale-105 transition-all duration-300"
              >
                Connect With Us
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/services"
                className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/25 hover:scale-105 transition-all duration-300"
              >
                <Play className="h-4 w-4 fill-white/10" />
                Explore Services
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="relative py-24 lg:py-32 bg-light-gray overflow-hidden">
        <div className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/2 h-px bg-gradient-to-l from-transparent via-emerald/20 to-transparent" />
        <div className="absolute top-1/3 right-10 w-48 h-48 rounded-full bg-gold/5 blur-3xl animate-float" />
        <div className="absolute bottom-1/3 left-10 w-48 h-48 rounded-full bg-emerald/5 blur-3xl animate-float" style={{ animationDelay: '3s' }} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-dark px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md hover:shadow-lg hover:shadow-gold/30 hover:scale-105 transition-all duration-300"
              >
                Connect With Us
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/target-audience"
                className="inline-flex items-center gap-2 rounded-xl border border-deep-navy/20 px-6 py-3 text-sm font-bold uppercase tracking-wider text-deep-navy hover:bg-deep-navy/5 transition-all duration-300"
              >
                Start Your Journey
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
