import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, Play, Sparkles, TrendingUp, Shield, Users, Zap, 
  CheckCircle2
} from 'lucide-react'

const ecosystemSteps = [
  { 
    letter: 'B', 
    label: 'Business', 
    desc: 'Strategy & Foundation', 
    color: 'emerald', 
    icon: TrendingUp,
    accent: 'emerald-light',
    metrics: {
      title: 'Structural Validation',
      status: 'Ready',
      detail: 'GTM Strategy & Corporate Governance verified.',
      features: ['Entity Structure Setup', 'Model Canvas Validation', 'Moat Analysis'],
      stat: '98%',
      statLabel: 'Foundation Strength'
    }
  },
  { 
    letter: 'A', 
    label: 'Advisors', 
    desc: 'Expert Guidance', 
    color: 'gold', 
    icon: Users,
    accent: 'gold',
    metrics: {
      title: 'Advisor Matching',
      status: 'Active Match',
      detail: 'Assigned sector specialists for weekly sprints.',
      features: ['Ex-Founders Mentoring', 'Compliance Oversight', 'Pitch Deck Drilling'],
      stat: '24h',
      statLabel: 'Average Response'
    }
  },
  { 
    letter: 'I', 
    label: 'Investors', 
    desc: 'Capital & Networks', 
    color: 'white', 
    icon: Shield,
    accent: 'white',
    metrics: {
      title: 'Investor Matching',
      status: 'Connected',
      detail: 'Active matchmaking across 200+ partner network.',
      features: ['Warm VC Introductions', 'Angel Syndicate Access', 'Secure Deal Room'],
      stat: '220+',
      statLabel: 'Investor Networks'
    }
  },
  { 
    letter: 'G', 
    label: 'Growth', 
    desc: 'Sustainable Success', 
    color: 'emerald', 
    icon: Zap,
    accent: 'emerald',
    metrics: {
      title: 'Scale & Metric Hub',
      status: 'Operational',
      detail: 'Scalable processes to achieve financial targets.',
      features: ['Unit Economics Audit', 'Market Expansion Prep', 'Hiring Frameworks'],
      stat: '3.4x',
      statLabel: 'Avg Revenue Growth'
    }
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function HeroSection() {
  const [activeStep, setActiveStep] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Auto-cycle through steps unless hovered/clicked
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % ecosystemSteps.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  // Network background animation
  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    if (!ctx) return

    const ACCENT = '#FD7C06'
    const BG = '#FFF8F2'
    const NODE_BASE_RADIUS = 2.2
    const NODE_MAX_RADIUS = 5.5
    const CONNECTION_MAX_DIST = 220
    const TRAVELER_SPEED_BASE = 0.004
    const FLOAT_AMPLITUDE = 0.3
    const FLOAT_SPEED = 0.0006
    const MOUSE_RADIUS = 200
    const NODE_COUNT = 250
    const ORBITAL_COUNT = 3

    let dpr = 1
    let W = 0
    let H = 0
    let mouse = { x: -9999, y: -9999, active: false }
    let nodes: any[] = []
    let travelers: any[] = []
    let orbitalCircles: any[] = []
    let animationId: number

    function resize() {
      dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      W = rect.width
      H = rect.height
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.scale(dpr, dpr)
      buildOrbitals()
    }

    function buildOrbitals() {
      const count = ORBITAL_COUNT
      const baseRadius = Math.min(W, H) * 0.28
      orbitalCircles = []
      for (let i = 0; i < count; i++) {
        orbitalCircles.push({
          cx: W * (0.3 + i * 0.2),
          cy: H * (0.4 + i * 0.1),
          radius: baseRadius * (0.6 + i * 0.25),
          speed: 0.0003 + i * 0.00015,
          phase: (i / count) * Math.PI * 2,
          lineWidth: 0.4 + i * 0.15,
          opacity: 0.06 + i * 0.03,
        })
      }
    }

    function createNode() {
      const margin = 10
      const x = margin + Math.random() * (W - margin * 2)
      const y = margin + Math.random() * (H - margin * 2)
      const radius = NODE_BASE_RADIUS + Math.random() * 2.5
      const floatOffsetX = Math.random() * 1000
      const floatOffsetY = Math.random() * 1000
      const pulseSpeed = 0.002 + Math.random() * 0.004
      const pulsePhase = Math.random() * Math.PI * 2
      const isImportant = Math.random() < 0.12
      return {
        x, y, baseX: x, baseY: y,
        radius: isImportant ? NODE_MAX_RADIUS : radius,
        baseRadius: isImportant ? NODE_MAX_RADIUS : radius,
        floatOffsetX, floatOffsetY, pulseSpeed, pulsePhase, isImportant,
        opacity: 0.6 + Math.random() * 0.4,
        currentPulse: 1,
      }
    }

    function buildNodes() {
      nodes = []
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push(createNode())
      }
    }

    function createTraveler(source: any, target: any) {
      return {
        source, target,
        t: Math.random(),
        speed: TRAVELER_SPEED_BASE * (0.6 + Math.random() * 0.8),
        size: 1.2 + Math.random() * 2.2,
        phase: Math.random() * 100,
      }
    }

    function spawnTravelers(count: number) {
      const available = nodes.length
      if (available < 2) return
      for (let i = 0; i < count; i++) {
        let a = Math.floor(Math.random() * available)
        let b = Math.floor(Math.random() * available)
        let attempts = 0
        while (b === a && attempts < 20) { b = Math.floor(Math.random() * available); attempts++ }
        if (a !== b) travelers.push(createTraveler(nodes[a], nodes[b]))
      }
    }

    function updateNodes(time: number) {
      for (const n of nodes) {
        const fx = Math.sin(time * FLOAT_SPEED + n.floatOffsetX) * FLOAT_AMPLITUDE
        const fy = Math.cos(time * FLOAT_SPEED * 0.7 + n.floatOffsetY) * FLOAT_AMPLITUDE
        n.x = n.baseX + fx
        n.y = n.baseY + fy
        const pulse = Math.sin(time * n.pulseSpeed + n.pulsePhase) * 0.15 + 0.85
        n.radius = n.baseRadius * pulse
        n.currentPulse = pulse
      }
    }

    function updateTravelers() {
      for (const t of travelers) {
        t.t += t.speed
        if (t.t >= 1) {
          const available = nodes.length
          let newTarget = Math.floor(Math.random() * available)
          let attempts = 0
          while (newTarget === nodes.indexOf(t.source) && attempts < 20) { newTarget = Math.floor(Math.random() * available); attempts++ }
          if (newTarget !== nodes.indexOf(t.source)) {
            t.source = t.target
            t.target = nodes[newTarget]
            t.t = 0
            t.speed = TRAVELER_SPEED_BASE * (0.6 + Math.random() * 0.8)
          } else {
            t.t = 0
          }
        }
      }
    }

    function drawGrid() {
      ctx.save()
      ctx.strokeStyle = '#f0f0f0'
      ctx.lineWidth = 0.5
      const step = 60
      for (let x = step; x < W; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
      for (let y = step; y < H; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }
      ctx.restore()
    }

    function drawOrbitals(time: number) {
      for (const o of orbitalCircles) {
        ctx.save()
        ctx.globalAlpha = o.opacity
        ctx.strokeStyle = ACCENT
        ctx.lineWidth = o.lineWidth
        ctx.setLineDash([4, 8])
        ctx.beginPath()
        ctx.arc(o.cx, o.cy, o.radius, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
        const angle = time * o.speed + o.phase
        const dotX = o.cx + o.radius * Math.cos(angle)
        const dotY = o.cy + o.radius * Math.sin(angle)
        ctx.save()
        ctx.globalAlpha = 0.2
        ctx.fillStyle = ACCENT
        ctx.beginPath()
        ctx.arc(dotX, dotY, 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    function drawConnections() {
      const maxDist = CONNECTION_MAX_DIST
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]; const b = nodes[j]
          const dx = a.x - b.x; const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.35
            ctx.save()
            ctx.globalAlpha = opacity
            ctx.strokeStyle = ACCENT
            ctx.lineWidth = 0.6
            const midX = (a.x + b.x) / 2; const midY = (a.y + b.y) / 2
            const perpX = -(dy) * 0.3; const perpY = (dx) * 0.3
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.quadraticCurveTo(midX + perpX, midY + perpY, b.x, b.y)
            ctx.stroke()
            ctx.restore()
          }
        }
      }
    }

    function drawNodes(time: number) {
      for (const n of nodes) {
        const depthFactor = 0.7 + 0.3 * (1 - (n.y / H))
        const finalOpacity = n.opacity * depthFactor
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius * 4)
        grad.addColorStop(0, `rgba(253, 124, 6, ${0.15 * finalOpacity})`)
        grad.addColorStop(1, 'rgba(253, 124, 6, 0)')
        ctx.save()
        ctx.globalAlpha = finalOpacity
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.radius * 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowColor = `rgba(253, 124, 6, ${0.2 * finalOpacity})`
        ctx.shadowBlur = 12
        ctx.fillStyle = ACCENT
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.radius * 0.9, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
        if (n.isImportant) {
          const ringSize = n.radius * (2.2 + 0.6 * Math.sin(time * 0.003 + n.pulsePhase))
          ctx.strokeStyle = `rgba(253, 124, 6, ${0.15 * finalOpacity})`
          ctx.lineWidth = 0.8
          ctx.beginPath()
          ctx.arc(n.x, n.y, ringSize, 0, Math.PI * 2)
          ctx.stroke()
        }
        ctx.restore()
      }
    }

    function drawTravelers() {
      for (const t of travelers) {
        const sx = t.source.x; const sy = t.source.y
        const tx = t.target.x; const ty = t.target.y
        const midX = (sx + tx) / 2; const midY = (sy + ty) / 2
        const perpX = -(ty - sy) * 0.3; const perpY = (tx - sx) * 0.3
        const t1 = t.t; const u = 1 - t1
        const px = u * u * sx + 2 * u * t1 * (midX + perpX) + t1 * t1 * tx
        const py = u * u * sy + 2 * u * t1 * (midY + perpY) + t1 * t1 * ty
        const glow = ctx.createRadialGradient(px, py, 0, px, py, t.size * 3)
        glow.addColorStop(0, 'rgba(253, 124, 6, 0.6)')
        glow.addColorStop(1, 'rgba(253, 124, 6, 0)')
        ctx.save()
        ctx.globalAlpha = 0.7
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(px, py, t.size * 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowColor = 'rgba(253, 124, 6, 0.3)'
        ctx.shadowBlur = 14
        ctx.fillStyle = '#FD7C06'
        ctx.beginPath()
        ctx.arc(px, py, t.size * 0.8, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.restore()
      }
    }

    function applyMouseInfluence() {
      if (!mouse.active) return
      const mr = MOUSE_RADIUS
      for (const n of nodes) {
        const dx = n.x - mouse.x; const dy = n.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < mr) {
          const force = (1 - dist / mr) * 4
          const angle = Math.atan2(dy, dx)
          n.x += Math.cos(angle) * force * 0.5
          n.y += Math.sin(angle) * force * 0.5
          n.radius = n.baseRadius * (1 + 0.2 * (1 - dist / mr))
        } else {
          n.radius = n.baseRadius * (n.currentPulse || 1)
        }
      }
    }

    function easeNodesBack() {
      for (const n of nodes) {
        n.x += (n.baseX - n.x) * 0.02
        n.y += (n.baseY - n.y) * 0.02
      }
    }

    function render(timestamp: number) {
      const time = timestamp || 0
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = BG
      ctx.fillRect(0, 0, W, H)
      updateNodes(time)
      updateTravelers()
      if (mouse.active) { applyMouseInfluence() } else { easeNodesBack() }
      drawGrid()
      drawOrbitals(time)
      drawConnections()
      drawNodes(time)
      drawTravelers()
      animationId = requestAnimationFrame(render)
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.active = true
    }

    function onMouseLeave() {
      mouse.active = false
      mouse.x = -9999
      mouse.y = -9999
    }

    function onTouchMove(e: TouchEvent) {
      e.preventDefault()
      const touch = e.touches[0]
      if (!touch) return
      const rect = canvas.getBoundingClientRect()
      mouse.x = touch.clientX - rect.left
      mouse.y = touch.clientY - rect.top
      mouse.active = true
    }

    function onTouchEnd() {
      mouse.active = false
      mouse.x = -9999
      mouse.y = -9999
    }

    resize()
    buildNodes()
    travelers = []
    spawnTravelers(25)

    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd)
    animationId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  const currentStep = ecosystemSteps[activeStep]
  const StepIcon = currentStep.icon

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16 pb-16">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-none" style={{ zIndex: 0 }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline */}
          <div className="lg:col-span-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col"
            >


              <motion.div 
                variants={itemVariants} 
                className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold text-gold-light border border-gold/20 mb-6 shadow-lg shadow-gold/5 w-fit"
              >
                <Sparkles className="h-3.5 w-3.5 text-gold animate-spin-slow" />
                <span>Antara Global Advisory Platform</span>
              </motion.div>

              <motion.h1 
                variants={itemVariants} 
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
                style={{ color: '#FD7C06' }}
              >
                Building Growth-Ready &{' '}
                Investment-Ready Businesses
              </motion.h1>

              <motion.p 
                variants={itemVariants} 
                className="mt-6 text-base sm:text-lg text-black leading-relaxed max-w-xl"
              >
                Antara Global is a strategic business advisory, venture readiness, fundraising
                support, and capital connectivity ecosystem helping startups, MSMEs, entrepreneurs,
                and growth-stage businesses prepare, connect, and grow.
              </motion.p>

              <motion.div 
                variants={itemVariants} 
                className="mt-8 flex flex-wrap gap-4"
              >
                <a
                  href="#services"
                  className="group inline-flex items-center gap-2.5 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold border border-black shadow-lg hover:scale-105 transition-all duration-300"
                  style={{ color: '#FC9E00' }}
                >
                  Explore Services
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" style={{ color: '#FC9E00' }} />
                </a>
                <a
                  href="#consultation"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold border border-black hover:scale-105 transition-all duration-300"
                  style={{ color: '#FC9E00' }}
                >
                  <Play className="h-4 w-4" style={{ color: '#FC9E00' }} />
                  Book Strategy Session
                </a>
              </motion.div>

              {/* Trusted Indicators */}
              <motion.div 
                variants={itemVariants} 
                className="mt-12 flex items-center gap-6 text-white/50 text-xs"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-9 w-9 rounded-full border-2 border-white bg-[#FC9E00] flex items-center justify-center text-[10px] font-bold shadow-lg text-white"
                    >
                      {['IN', 'EU', 'US', 'ME'][i-1]}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-black">Global Connectivity</span>
                  <span className="tracking-wide text-[10px] mt-0.5 text-black/60">Serving Founders & Investors Worldwide</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: Interactive Ecosystem Dashboard */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full max-w-xl mx-auto"
            >
              {/* Premium Glow Aura */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-gold/20 via-emerald/10 to-transparent blur-md pointer-events-none" />

              <div className="relative rounded-3xl backdrop-blur-md border border-black p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row gap-6 items-stretch bg-white">
                
                {/* Steps Selector Column */}
                <div className="flex md:flex-col justify-between md:justify-center gap-3">
                  {ecosystemSteps.map((step, idx) => {
                    const Icon = step.icon
                    const isSelected = activeStep === idx
                    return (
                      <button
                        key={step.letter}
                        onClick={() => setActiveStep(idx)}
                        className={`h-14 w-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-500 relative ${
                          isSelected
                            ? 'text-white scale-110'
                            : 'bg-white border-2 border-black text-black hover:bg-black/5 hover:scale-105 hover:shadow-md'
                        }`}
                        style={isSelected ? {
                          background: 'radial-gradient(circle at 30% 30%, #000000, #333333)',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
                          border: 'none'
                        } : undefined}
                      >
                        {isSelected && (
                          <>
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-black/30 via-black/10 to-transparent blur-sm -z-10" />
                            <div className="absolute inset-0 rounded-2xl ring-2 ring-white/20 ring-offset-2 ring-offset-black/10" />
                          </>
                        )}
                        <div className={`relative flex flex-col items-center justify-center ${isSelected ? 'animate-pulse-glow' : ''}`}>
                          <Icon className="h-5 w-5" />
                          <span className="text-[9px] font-bold mt-0.5">{step.letter}</span>
                        </div>
                        {isSelected && (
                          <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center">
                            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-black shadow-lg shadow-black/20">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m9 18 6-6-6-6" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Dashboard Details Screen */}
                <div className="flex-1 rounded-2xl border border-black p-6 flex flex-col justify-between relative overflow-hidden" style={{ backgroundColor: '#FD7C06' }}>
                  <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-white/10 blur-xl" />
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                          {currentStep.label} Node Status
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                          <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse-glow" />
                          {currentStep.metrics.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-white flex items-center gap-2">
                          <StepIcon className="h-5 w-5 text-white/90" />
                          {currentStep.metrics.title}
                        </h4>
                        <p className="text-xs text-white/70 mt-1 leading-relaxed">
                          {currentStep.metrics.detail}
                        </p>
                      </div>

                      <div className="space-y-2 border-t border-white/20 pt-4">
                        {currentStep.metrics.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-white/80">
                            <CheckCircle2 className="h-4 w-4 text-white/90 shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-white/20 pt-4 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-white/80">{currentStep.metrics.statLabel}</p>
                          <p className="text-2xl font-black text-white">{currentStep.metrics.stat}</p>
                        </div>
                        <a 
                          href="#services"
                          className="inline-flex items-center gap-1.5 text-xs text-white font-semibold hover:text-white/70 transition-colors"
                        >
                          Unlock Node
                          <ArrowRight className="h-3 w-3" />
                        </a>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

              </div>

              {/* Decorative Glow Dots */}
              <div className="absolute -top-3 -right-3 h-24 w-24 rounded-2xl bg-gradient-to-br from-[#FD7C06]/20 to-[#FC9E00]/10 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-2 -left-2 h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#FD7C06]/10 to-transparent blur-xl pointer-events-none" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
