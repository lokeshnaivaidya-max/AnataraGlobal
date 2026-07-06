import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

export default function CoreValues() {
  const [activeIdx, setActiveIdx] = useState(0)

  const next = useCallback(() => {
    setActiveIdx((i) => (i + 1) % values.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-screen overflow-hidden pt-28 pb-16" style={{ backgroundColor: '#FFF8F2' }}>
        <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, #FD7C06, transparent)' }} />
        <div className="mx-auto relative w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left: Content */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border text-white"
                style={{ backgroundColor: '#000000', borderColor: '#000000' }}>
                <Sparkles className="h-3.5 w-3.5" />
                Our Core Values
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight" style={{ color: '#000000' }}>
                Principles<br />
                <span style={{ color: '#FD7C06' }}>That Drive Us</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="mt-6 text-base sm:text-lg leading-relaxed max-w-xl min-h-[4.5rem]" style={{ color: 'rgba(0,0,0,0.6)' }}>
                Our values define how we build relationships, support businesses, and create meaningful growth opportunities through trust, knowledge, collaboration, and excellence. Every decision we make and every partnership we form is guided by these principles, ensuring long-term value creation for the businesses and ecosystems we serve. These core beliefs are the foundation upon which Antara Global was built and continues to grow.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 flex flex-wrap gap-4">
                <a href="/services"
                  className="group inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold border-2 border-black shadow-lg transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: '#FFFFFF', color: '#000000' }}>
                  Explore Services <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a href="/contact"
                  className="inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: '#000000' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FD7C06'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}>
                  Connect With Us
                </a>
              </motion.div>
            </div>

            {/* Right: Auto-rotating Values */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className="relative flex items-center justify-center">
              <div className="w-full max-w-md">
                <div className="relative min-h-[360px]">
                  <AnimatePresence mode="wait">
                    {values.map((value, idx) => {
                      const Icon = value.icon
                      const isOrange = idx % 2 === 0
                      if (idx !== activeIdx) return null
                      return (
                        <motion.div key={value.title}
                          initial={{ opacity: 0, y: 30, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -30, scale: 0.95 }}
                          transition={{ duration: 0.45 }}
                          className="relative rounded-3xl p-8 shadow-xl w-full"
                          style={{
                            backgroundColor: '#000000',
                            border: '1px solid rgba(255,255,255,0.06)',
                          }}>
                          {/* icon */}
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl mb-6"
                            style={{
                              backgroundColor: isOrange ? 'rgba(253,124,6,0.15)' : 'rgba(206,160,65,0.15)',
                              color: isOrange ? '#FD7C06' : '#CEA041',
                            }}>
                            <Icon className="h-7 w-7" />
                          </div>

                          <h3 className="text-xl font-extrabold" style={{ color: '#FFFFFF' }}>
                            {value.title}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                            {value.desc}
                          </p>

                          <ul className="mt-6 pt-6 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            {value.points.map((point) => (
                              <li key={point} className="flex items-center gap-3 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: isOrange ? '#FD7C06' : '#CEA041' }} />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>

                {/* Dot indicators */}
                <div className="flex items-center justify-center gap-2 mt-6">
                  {values.map((_, idx) => (
                    <button key={idx} onClick={() => setActiveIdx(idx)}
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: idx === activeIdx ? '24px' : '8px',
                        backgroundColor: idx === activeIdx ? '#FD7C06' : 'rgba(0,0,0,0.15)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Values Grid ── */}
      <section className="relative py-24 lg:py-32 overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, idx) => {
              const Icon = value.icon
              const isOrange = idx % 2 === 0
              return (
                <motion.div key={value.title} variants={cardVariants} whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className="group relative rounded-3xl p-7 shadow-md hover:shadow-2xl transition-all duration-500"
                  style={{ backgroundColor: '#FFF8F2', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div className="absolute top-0 left-0 w-full h-1 rounded-t-3xl"
                    style={{ background: isOrange ? 'linear-gradient(90deg, #FD7C06, rgba(253,124,6,0.3))' : 'linear-gradient(90deg, #CEA041, rgba(206,160,65,0.3))' }} />

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border mb-5 transition-all duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: isOrange ? 'rgba(253,124,6,0.08)' : 'rgba(206,160,65,0.08)',
                      borderColor: isOrange ? 'rgba(253,124,6,0.15)' : 'rgba(206,160,65,0.15)',
                      color: isOrange ? '#FD7C06' : '#CEA041',
                    }}>
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-lg font-extrabold transition-colors duration-300" style={{ color: '#000000' }}>
                    {value.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed" style={{ color: 'rgba(0,0,0,0.5)' }}>{value.desc}</p>

                  <ul className="mt-5 pt-5 space-y-2" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    {value.points.map((point) => (
                      <li key={point} className="flex items-center gap-2 text-xs font-medium" style={{ color: 'rgba(0,0,0,0.7)' }}>
                        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: isOrange ? '#FD7C06' : '#CEA041' }} />
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </motion.div>

          {/* ── Brand Statement ── */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }} className="mt-16 text-center">
            <div className="relative inline-block max-w-3xl w-full">
              <div className="absolute -inset-1 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(253,124,6,0.15), rgba(206,160,65,0.08))', filter: 'blur(8px)' }} />
              <div className="relative rounded-3xl p-8 sm:p-10 overflow-hidden" style={{ backgroundColor: '#000000', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, #FD7C06, transparent)' }} />
                <p className="text-base sm:text-lg font-semibold leading-relaxed max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.9)' }}>
                  At Antara Global, growth is not only measured by scale but by the strength of relationships, knowledge, partnerships, and sustainable impact created along the journey.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a href="/contact"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                style={{ backgroundColor: '#000000' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FD7C06'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}>
                Connect With Us <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/target-audience"
                className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-bold uppercase tracking-wider hover:scale-105 transition-all duration-300"
                style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.12)', color: 'rgba(0,0,0,0.6)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FD7C06'; e.currentTarget.style.color = '#FD7C06' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.color = 'rgba(0,0,0,0.6)' }}>
                Start Your Journey
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
