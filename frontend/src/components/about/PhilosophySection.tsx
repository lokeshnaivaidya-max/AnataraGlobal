import { motion } from 'framer-motion'
import { 
  Compass, BarChart3, ShieldCheck, Network, TrendingUp, Building2, Quote
} from 'lucide-react'

const problems = [
  { 
    icon: Compass, 
    label: 'Strategic Direction', 
    desc: 'Eliminating ambiguous vision and ad-hoc execution through structured 3-year strategic growth roadmaps.' 
  },
  { 
    icon: BarChart3, 
    label: 'Financial Preparedness', 
    desc: 'Correcting poor financial hygiene and lack of bookkeeping with investor-grade 3-statement models.' 
  },
  { 
    icon: ShieldCheck, 
    label: 'Investor Readiness', 
    desc: 'Solving lack of structured due diligence materials and weak narratives with secure deal rooms.' 
  },
  { 
    icon: Network, 
    label: 'Targeted Networks', 
    desc: 'Overcoming isolation by connecting founders with curated, vetted venture capitals and angels.' 
  },
  { 
    icon: TrendingUp, 
    label: 'Scalable Systems', 
    desc: 'Replacing founder-dependent systems with repeatable customer acquisition and operational workflows.' 
  },
  { 
    icon: Building2, 
    label: 'Governance Structure', 
    desc: 'Strengthening legal bylaws, clean cap tables, and board governance to eliminate transaction friction.' 
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function PhilosophySection() {
  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 right-0 w-1/2 h-px bg-gradient-to-l from-transparent via-gold/20 to-transparent" />
      <div className="absolute top-1/3 left-10 w-48 h-48 rounded-full bg-gold/5 blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-10 w-48 h-48 rounded-full bg-emerald/5 blur-3xl animate-float" style={{ animationDelay: '3.5s' }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Quote / Header Block */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-16 lg:mb-20">
          <div className="lg:col-span-6">
            <span className="text-xs font-semibold tracking-widest uppercase text-gold">
              Why We Exist
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-deep-navy tracking-tight leading-tight">
              Bridging the Gap Between Concept and Capital
            </h2>
            <p className="mt-4 text-medium-gray text-base leading-relaxed">
              We started Antara Global because we noticed a recurring tragedy: brilliant businesses with validated products failing to secure growth capital simply because they lacked the proper foundational governance and investor-readiness materials.
            </p>
          </div>
          
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl bg-light-gray border border-border-gray p-8 sm:p-10 shadow-xl overflow-hidden group hover:border-gold/30 transition-all duration-300">
              <Quote className="absolute -top-4 -left-2 h-16 w-16 text-gold/5 pointer-events-none" />
              <div className="relative">
                <p className="text-base sm:text-lg text-deep-navy italic leading-relaxed font-semibold pl-6 border-l-2 border-gold">
                  &ldquo;Many businesses do not struggle because they lack ideas or markets. They struggle because they lack the structure required to sustain growth.&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-2 pl-6">
                  <span className="h-0.5 w-4 bg-gold" />
                  <span className="text-xs font-bold text-deep-navy">Antara Founding Philosophy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Problems Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {problems.map((item) => (
            <motion.div
              key={item.label}
              variants={cardVariants}
              className="group relative rounded-2xl border border-border-gray bg-light-gray p-6 hover:border-gold/30 hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-gold/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm pointer-events-none" />
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold/15 to-gold/5 text-gold border border-gold/15 group-hover:from-gold group-hover:to-gold-dark group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-deep-navy text-sm group-hover:text-gold transition-colors duration-300">{item.label}</h3>
                <p className="mt-2 text-xs text-medium-gray leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="relative inline-block max-w-2xl w-full group">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-gold/20 via-emerald/10 to-gold/20 blur-md group-hover:blur-lg transition-all duration-500" />
            <div className="relative rounded-3xl bg-gradient-to-r from-deep-navy via-deep-navy to-deep-navy-dark p-8 sm:p-10 border border-white/5 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gold/5 blur-2xl animate-float" />
              <p className="text-sm sm:text-base font-semibold text-white/90 leading-relaxed max-w-lg mx-auto">
                We believe that structured, compliant, and transparent businesses will naturally attract capital. Our advisory acts as the catalyst to unlock that potential.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
