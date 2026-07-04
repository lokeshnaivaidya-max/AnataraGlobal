import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Save, Building2, Receipt } from 'lucide-react'
import { useMsmeProfile, useUpdateMsmeProfile, useGstDetails, useUpdateGst } from '../../../lib/msme-hooks'
import { MSME_INDUSTRIES } from '../../../lib/msme-types'

export default function BusinessDetails() {
  const { data: msme, isLoading: msmeLoading } = useMsmeProfile()
  const updateProfile = useUpdateMsmeProfile()
  const { data: gst, isLoading: gstLoading } = useGstDetails()
  const updateGst = useUpdateGst()

  const [businessName, setBusinessName] = useState(msme?.businessName || '')
  const [description, setDescription] = useState(msme?.businessDescription || '')
  const [industry, setIndustry] = useState(msme?.industryId || '')
  const [phone, setPhone] = useState(msme?.phone || '')
  const [website, setWebsite] = useState(msme?.website || '')
  const [address, setAddress] = useState(msme?.address || '')
  const [city, setCity] = useState(msme?.city || '')
  const [state, setState] = useState(msme?.state || '')
  const [pincode, setPincode] = useState(msme?.pincode || '')

  const [gstNumber, setGstNumber] = useState(gst?.gstNumber || '')
  const [savingBusiness, setSavingBusiness] = useState(false)
  const [savingGst, setSavingGst] = useState(false)

  const handleSaveBusiness = async () => {
    setSavingBusiness(true)
    try {
      await updateProfile.mutateAsync({
        businessName,
        businessDescription: description,
        industryId: industry || undefined,
        phone,
        website: website || undefined,
        address,
        city,
        state,
        pincode,
      })
    } finally {
      setSavingBusiness(false)
    }
  }

  const handleSaveGst = async () => {
    setSavingGst(true)
    try {
      await updateGst.mutateAsync({ gstNumber })
    } finally {
      setSavingGst(false)
    }
  }

  if (msmeLoading || gstLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6 text-gold" />
          <div>
            <h1 className="text-2xl font-extrabold text-deep-navy">Business Details</h1>
            <p className="text-sm text-medium-gray">Manage your MSME business information.</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border-gray bg-white p-6 space-y-4"
      >
        <h2 className="text-lg font-bold text-deep-navy">General Information</h2>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Business Name *</label>
          <input value={businessName} onChange={e => setBusinessName(e.target.value)}
            className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
            placeholder="Your business name" />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
            className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
            placeholder="Brief description of your business..."
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Industry</label>
            <select value={industry} onChange={e => setIndustry(e.target.value)}
              className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
            >
              <option value="">Select industry</option>
              {MSME_INDUSTRIES.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              placeholder="+91 98765 43210" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Website</label>
            <input value={website} onChange={e => setWebsite(e.target.value)}
              className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              placeholder="https://example.com" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Address</label>
            <input value={address} onChange={e => setAddress(e.target.value)}
              className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              placeholder="Street address" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">City</label>
            <input value={city} onChange={e => setCity(e.target.value)}
              className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              placeholder="City" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">State</label>
            <input value={state} onChange={e => setState(e.target.value)}
              className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              placeholder="State" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Pincode</label>
            <input value={pincode} onChange={e => setPincode(e.target.value)}
              className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              placeholder="6-digit pincode" />
          </div>
        </div>

        <button onClick={handleSaveBusiness} disabled={savingBusiness || !businessName}
          className="flex items-center gap-2 rounded-xl bg-deep-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60"
        >
          {savingBusiness ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Changes</>}
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border-gray bg-white p-6 space-y-4"
      >
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-gold" />
          <h2 className="text-lg font-bold text-deep-navy">GST Details</h2>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">GST Number</label>
          <input value={gstNumber} onChange={e => setGstNumber(e.target.value)}
            className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
            placeholder="22AAAAA0000A1Z5" />
        </div>

        {gst?.gstStatus && (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-medium-gray">Status:</span>
            <span className={`font-bold ${
              gst.gstStatus === 'verified' ? 'text-success' :
              gst.gstStatus === 'pending' ? 'text-warning' : 'text-medium-gray'
            }`}>
              {gst.gstStatus.charAt(0).toUpperCase() + gst.gstStatus.slice(1)}
            </span>
          </div>
        )}

        <button onClick={handleSaveGst} disabled={savingGst || !gstNumber}
          className="flex items-center gap-2 rounded-xl bg-deep-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60"
        >
          {savingGst ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save GST</>}
        </button>
      </motion.div>
    </div>
  )
}
