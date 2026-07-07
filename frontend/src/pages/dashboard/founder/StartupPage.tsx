import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Save, Building2 } from 'lucide-react'
import {
  useStartup,
  useUpdateStartup,
  useBusinessStages,
  useFundingStages,
} from '../../../lib/founder-hooks'
import { INDUSTRIES } from '../../../lib/founder-types'

export default function StartupPage() {
  const { data: startup, isLoading, refetch } = useStartup()
  const updateStartup = useUpdateStartup()
  const { data: businessStages } = useBusinessStages()
  const { data: fundingStages } = useFundingStages()

  const [form, setForm] = useState({
    name: '',
    tagline: '',
    description: '',
    industry: '',
    sector: '',
    problem: '',
    solution: '',
    website: '',
    valuation: 0,
    revenue: 0,
    traction: '',
    customerCount: 0,
    employeeCount: 0,
    incorporationType: '',
    businessStageId: '',
    fundingStageId: '',
  })

  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (startup) {
      setForm({
        name: startup.name || '',
        tagline: startup.tagline || '',
        description: startup.description || '',
        industry: startup.industry || '',
        sector: startup.sector || '',
        problem: startup.problem || '',
        solution: startup.solution || '',
        website: startup.website || '',
        valuation: startup.valuation || 0,
        revenue: startup.revenue || 0,
        traction: startup.traction || '',
        customerCount: startup.customerCount || 0,
        employeeCount: startup.employeeCount || 0,
        incorporationType: startup.incorporationType || '',
        businessStageId: startup.businessStageId || '',
        fundingStageId: startup.fundingStageId || '',
      })
    }
  }, [startup])

  const handleSave = async () => {
    setSaveSuccess(false)
    setSaveError('')
    try {
      await updateStartup.mutateAsync(form)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      refetch()
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : 'Failed to save startup details.'
      setSaveError(msg)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6 text-gold" />
          <h1 className="text-2xl font-extrabold text-deep-navy">Startup Details</h1>
        </div>
        <p className="text-sm text-medium-gray mt-1">Tell us about your startup and its current stage.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border-gray bg-white p-6 space-y-5"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Startup Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              placeholder="Your startup name" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Tagline</label>
            <input value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })}
              className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              placeholder="A short tagline for your startup" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              placeholder="Describe your startup..." />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Industry</label>
            <select value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })}
              className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all">
              <option value="">Select industry</option>
              {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Sector</label>
            <input value={form.sector} onChange={e => setForm({ ...form, sector: e.target.value })}
              className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              placeholder="e.g., Fintech, HealthTech" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Problem</label>
            <textarea value={form.problem} onChange={e => setForm({ ...form, problem: e.target.value })} rows={2}
              className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              placeholder="What problem does your startup solve?" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Solution</label>
            <textarea value={form.solution} onChange={e => setForm({ ...form, solution: e.target.value })} rows={2}
              className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              placeholder="How does your startup solve this problem?" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Website</label>
            <input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })}
              className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              placeholder="https://..." />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Incorporation Type</label>
            <input value={form.incorporationType} onChange={e => setForm({ ...form, incorporationType: e.target.value })}
              className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              placeholder="Pvt. Ltd., LLP, etc." />
          </div>
        </div>

        <div className="border-t border-border-gray pt-5">
          <h3 className="text-sm font-bold text-deep-navy mb-4">Stage & Metrics</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Business Stage</label>
              <select value={form.businessStageId} onChange={e => setForm({ ...form, businessStageId: e.target.value })}
                className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all">
                <option value="">Select stage</option>
                {businessStages?.map(bs => <option key={bs.id} value={bs.id}>{bs.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Funding Stage</label>
              <select value={form.fundingStageId} onChange={e => setForm({ ...form, fundingStageId: e.target.value })}
                className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all">
                <option value="">Select stage</option>
                {fundingStages?.map(fs => <option key={fs.id} value={fs.id}>{fs.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Valuation (₹)</label>
              <input type="number" value={form.valuation} onChange={e => setForm({ ...form, valuation: Number(e.target.value) })}
                className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Annual Revenue (₹)</label>
              <input type="number" value={form.revenue} onChange={e => setForm({ ...form, revenue: Number(e.target.value) })}
                className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Customers</label>
              <input type="number" value={form.customerCount} onChange={e => setForm({ ...form, customerCount: Number(e.target.value) })}
                className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Employees</label>
              <input type="number" value={form.employeeCount} onChange={e => setForm({ ...form, employeeCount: Number(e.target.value) })}
                className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Traction / Key Milestones</label>
              <textarea value={form.traction} onChange={e => setForm({ ...form, traction: e.target.value })} rows={2}
                className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                placeholder="Key traction metrics, milestones achieved..." />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 pt-2">
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-success/20 bg-success/10 px-4 py-2.5 text-sm text-success font-medium"
            >
              Startup details saved successfully!
            </motion.div>
          )}

          {saveError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-error/20 bg-error/10 px-4 py-2.5 text-sm text-error font-medium"
            >
              {saveError}
            </motion.div>
          )}

          <button onClick={handleSave} disabled={updateStartup.isPending || !form.name}
            className="flex items-center gap-2 rounded-xl bg-deep-navy px-6 py-3 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60"
          >
            {updateStartup.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Startup</>}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
