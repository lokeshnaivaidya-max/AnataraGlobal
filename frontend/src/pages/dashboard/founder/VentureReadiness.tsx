import { motion } from 'framer-motion'
import {
  Loader2,
  Gauge,
  Users,
  Package,
  TrendingUp,
  Rocket,
  BarChart3,
  ShieldCheck,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react'
import {
  useVentureReadiness,
  useRequestReassessment,
} from '../../../lib/venture-readiness-hooks'
import {
  DIMENSION_LABELS,
  DIMENSION_ICONS,
  getReadinessLevel,
} from '../../../lib/venture-readiness-types'
import type { ReadinessDimension } from '../../../lib/venture-readiness-types'

const iconMap: Record<string, typeof Users> = {
  Users, Package, TrendingUp, Rocket, BarChart3, ShieldCheck,
}

export default function VentureReadiness() {
  const { data: readiness, isLoading, refetch } = useVentureReadiness()
  const reassess = useRequestReassessment()

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  }

  const level = readiness ? getReadinessLevel(readiness.overallScore) : null

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <Gauge className="h-6 w-6 text-gold" />
          <div>
            <h1 className="text-2xl font-extrabold text-deep-navy">Venture Readiness</h1>
            <p className="text-sm text-medium-gray">Assess your startup's readiness for investment.</p>
          </div>
        </div>
      </motion.div>

      {!readiness && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border-gray bg-white p-12 text-center"
        >
          <Gauge className="h-16 w-16 text-medium-gray/20 mx-auto mb-4" />
          <h2 className="text-xl font-extrabold text-deep-navy mb-2">No Assessment Yet</h2>
          <p className="text-sm text-medium-gray mb-6 max-w-md mx-auto">
            Complete your startup profile and submit key information to get your Venture Readiness score.
          </p>
          <button onClick={() => reassess.mutateAsync().then(() => refetch())} disabled={reassess.isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-light px-6 py-3 text-sm font-bold text-white shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30 transition-all disabled:opacity-60"
          >
            {reassess.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Assessing...</> : <><RefreshCw className="h-4 w-4" /> Start Assessment</>}
          </button>
        </motion.div>
      )}

      {readiness && level && (
        <>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border-gray bg-white p-8"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className={`relative flex h-28 w-28 items-center justify-center rounded-full ${level.bg}`}>
                <div className="absolute inset-2 rounded-full border-4 border-white" />
                <span className={`text-3xl font-extrabold ${level.color}`}>
                  {readiness.overallScore}
                </span>
              </div>
              <div className="text-center sm:text-left">
                <p className={`text-lg font-extrabold ${level.color}`}>{level.label}</p>
                <p className="text-sm text-medium-gray mt-1">Overall Venture Readiness Score</p>
                <div className="mt-3 h-2.5 w-full sm:w-64 rounded-full bg-light-gray overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${readiness.overallScore}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {readiness.dimensionScores.map((dim, i) => {
              const Icon = iconMap[DIMENSION_ICONS[dim.dimension as ReadinessDimension]] || Gauge
              const dimLevel = getReadinessLevel(dim.percentage)
              return (
                <div key={dim.dimension}
                  className="rounded-2xl border border-border-gray bg-white p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 text-gold">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold text-deep-navy">
                      {DIMENSION_LABELS[dim.dimension as ReadinessDimension]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-lg font-extrabold ${dimLevel.color}`}>
                      {Math.round(dim.percentage)}%
                    </span>
                    <span className="text-xs text-medium-gray">
                      {dim.score}/{dim.maxScore}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-light-gray overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dim.percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                      className={`h-full rounded-full ${
                        dim.percentage >= 75 ? 'bg-success' :
                        dim.percentage >= 50 ? 'bg-gold' :
                        dim.percentage >= 25 ? 'bg-warning' : 'bg-error'
                      }`}
                    />
                  </div>
                </div>
              )
            })}
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {readiness.strengths.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="rounded-2xl border border-success/20 bg-success/5 p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <h2 className="text-lg font-bold text-deep-navy">Strengths</h2>
                </div>
                <ul className="space-y-2">
                  {readiness.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-medium-gray">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                      {s}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {readiness.gaps.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                className="rounded-2xl border border-warning/20 bg-warning/5 p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <h2 className="text-lg font-bold text-deep-navy">Gaps</h2>
                </div>
                <ul className="space-y-2">
                  {readiness.gaps.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-medium-gray">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                      {g}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {readiness.recommendations.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="rounded-2xl border border-border-gray bg-white p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-gold" />
                <h2 className="text-lg font-bold text-deep-navy">Recommendations</h2>
              </div>
              <div className="space-y-3">
                {readiness.recommendations.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl bg-light-gray/50 p-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/10 text-xs font-bold text-gold">
                      {i + 1}
                    </span>
                    <p className="text-sm text-medium-gray">{r}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="text-center"
          >
            <button onClick={() => reassess.mutateAsync().then(() => refetch())} disabled={reassess.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-deep-navy px-6 py-3 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60"
            >
              {reassess.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Reassessing...</> : <><RefreshCw className="h-4 w-4" /> Request Reassessment</>}
            </button>
          </motion.div>
        </>
      )}
    </div>
  )
}
