import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Save, Users, Globe, Plus, X } from 'lucide-react'
import { useEmployeeInfo, useUpdateEmployees, useExportStatus, useUpdateExportStatus } from '../../../lib/msme-hooks'

export default function EmployeesExport() {
  const { data: employees, isLoading: empLoading } = useEmployeeInfo()
  const updateEmployees = useUpdateEmployees()
  const { data: exportStatus, isLoading: exportLoading } = useExportStatus()
  const updateExport = useUpdateExportStatus()

  const [totalCount, setTotalCount] = useState(employees?.totalCount?.toString() || '')
  const [permanentCount, setPermanentCount] = useState(employees?.permanentCount?.toString() || '')
  const [contractCount, setContractCount] = useState(employees?.contractCount?.toString() || '')
  const [asOfDate, setAsOfDate] = useState(employees?.asOfDate?.split('T')[0] || '')

  const [isExporting, setIsExporting] = useState(exportStatus?.isExporting ?? false)
  const [exportCountries, setExportCountries] = useState<string[]>(exportStatus?.exportCountries || [])
  const [newCountry, setNewCountry] = useState('')
  const [exportRevenue, setExportRevenue] = useState(exportStatus?.exportRevenue?.toString() || '')
  const [startedYear, setStartedYear] = useState(exportStatus?.startedYear?.toString() || '')

  const [savingEmp, setSavingEmp] = useState(false)
  const [savingExport, setSavingExport] = useState(false)

  const handleSaveEmployees = async () => {
    setSavingEmp(true)
    try {
      await updateEmployees.mutateAsync({
        totalCount: parseInt(totalCount) || 0,
        permanentCount: parseInt(permanentCount) || 0,
        contractCount: parseInt(contractCount) || 0,
        asOfDate: asOfDate || new Date().toISOString().split('T')[0],
      })
    } finally {
      setSavingEmp(false)
    }
  }

  const handleSaveExport = async () => {
    setSavingExport(true)
    try {
      await updateExport.mutateAsync({
        isExporting,
        exportCountries: isExporting ? exportCountries : undefined,
        exportRevenue: isExporting && exportRevenue ? parseFloat(exportRevenue) : undefined,
        startedYear: isExporting && startedYear ? parseInt(startedYear) : undefined,
      })
    } finally {
      setSavingExport(false)
    }
  }

  const addCountry = () => {
    const trimmed = newCountry.trim()
    if (trimmed && !exportCountries.includes(trimmed)) {
      setExportCountries([...exportCountries, trimmed])
      setNewCountry('')
    }
  }

  const removeCountry = (country: string) => {
    setExportCountries(exportCountries.filter(c => c !== country))
  }

  if (empLoading || exportLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-gold" />
          <div>
            <h1 className="text-2xl font-extrabold text-deep-navy">Employees & Export</h1>
            <p className="text-sm text-medium-gray">Manage workforce details and export activity.</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border-gray bg-white p-6 space-y-4"
      >
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gold" />
          <h2 className="text-lg font-bold text-deep-navy">Employee Information</h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Total Employees</label>
            <input value={totalCount} onChange={e => setTotalCount(e.target.value)} type="number"
              className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              placeholder="0" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Permanent</label>
            <input value={permanentCount} onChange={e => setPermanentCount(e.target.value)} type="number"
              className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              placeholder="0" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Contract</label>
            <input value={contractCount} onChange={e => setContractCount(e.target.value)} type="number"
              className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              placeholder="0" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">As of Date</label>
          <input value={asOfDate} onChange={e => setAsOfDate(e.target.value)} type="date"
            className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
        </div>

        <button onClick={handleSaveEmployees} disabled={savingEmp || !totalCount}
          className="flex items-center gap-2 rounded-xl bg-deep-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60"
        >
          {savingEmp ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Employees</>}
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border-gray bg-white p-6 space-y-4"
      >
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-gold" />
          <h2 className="text-lg font-bold text-deep-navy">Export Status</h2>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <div className={`relative w-11 h-6 rounded-full transition-colors ${isExporting ? 'bg-success' : 'bg-medium-gray/30'}`}>
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isExporting ? 'translate-x-5' : ''}`} />
            <input type="checkbox" checked={isExporting} onChange={e => setIsExporting(e.target.checked)} className="sr-only" />
          </div>
          <span className="text-sm font-bold text-deep-navy">Currently exporting</span>
        </label>

        {isExporting && (
          <>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Export Countries</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {exportCountries.map(country => (
                  <span key={country} className="inline-flex items-center gap-1 rounded-full bg-gold/10 text-gold-dark px-3 py-1.5 text-xs font-semibold">
                    {country}
                    <button onClick={() => removeCountry(country)} className="hover:text-error transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newCountry} onChange={e => setNewCountry(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCountry())}
                  placeholder="Add country..." className="flex-1 rounded-xl border border-border-gray bg-light-gray/50 px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
                <button onClick={addCountry} disabled={!newCountry.trim()}
                  className="flex items-center gap-1 rounded-xl bg-deep-navy px-4 py-2.5 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60"
                >
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Export Revenue (INR)</label>
                <input value={exportRevenue} onChange={e => setExportRevenue(e.target.value)} type="number"
                  className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                  placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Started Year</label>
                <input value={startedYear} onChange={e => setStartedYear(e.target.value)} type="number"
                  className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                  placeholder="2020" />
              </div>
            </div>
          </>
        )}

        <button onClick={handleSaveExport} disabled={savingExport}
          className="flex items-center gap-2 rounded-xl bg-deep-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60"
        >
          {savingExport ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Export Status</>}
        </button>
      </motion.div>
    </div>
  )
}
