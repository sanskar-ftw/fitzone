import React, { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Star, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'

const EMPTY = { name: '', price: '', duration: '', features: '', isPopular: false }

/** AdminPlans — full CRUD for membership plans */
export default function AdminPlans() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const fetchPlans = () => {
    setLoading(true)
    api.get('/plans')
      .then((res) => setPlans(Array.isArray(res.data) ? res.data : (res.data?.data || [])))
      .catch(() => toast.error('Failed to load plans'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPlans() }, [])

  const openCreate = () => {
    setEditTarget(null)
    setForm(EMPTY)
    setModalOpen(true)
  }

  const openEdit = (plan) => {
    setEditTarget(plan)
    setForm({
      name: plan.name || '',
      price: plan.price ?? '',
      duration: plan.duration ?? '',
      features: Array.isArray(plan.features) ? plan.features.join(', ') : (plan.features || ''),
      isPopular: !!plan.isPopular,
    })
    setModalOpen(true)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Plan name is required'); return }
    setSaving(true)
    const payload = {
      ...form,
      price: Number(form.price) || 0,
      duration: Number(form.duration) || 30,
      features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
    }
    try {
      if (editTarget) {
        const res = await api.put(`/plans/${editTarget._id}`, payload)
        setPlans((prev) => prev.map((p) => (p._id === editTarget._id ? res.data : p)))
        toast.success('Plan updated')
      } else {
        const res = await api.post('/plans', payload)
        setPlans((prev) => [...prev, res.data])
        toast.success('Plan created')
      }
      setModalOpen(false)
    } catch {
      toast.error('Failed to save plan')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this plan?')) return
    setDeletingId(id)
    try {
      await api.delete(`/plans/${id}`)
      setPlans((prev) => prev.filter((p) => p._id !== id))
      toast.success('Plan deleted')
    } catch {
      toast.error('Failed to delete plan')
    } finally {
      setDeletingId(null)
    }
  }

  const inputCls =
    'w-full bg-[#101016] border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-white/30 placeholder-gray-500 transition-colors'

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            Pricing &amp; Subscriptions
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Membership Plans</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-0.5">Manage pricing tiers, billing durations, and featured benefits</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-950 font-bold px-6 py-2.5 rounded-full text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:scale-105 cursor-pointer shrink-0"
        >
          <Plus size={16} /> Add Plan
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-[#0b0c10] border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-[11px] uppercase tracking-wider bg-white/[0.02]">
                <th className="py-4 px-6 font-semibold">Plan Name</th>
                <th className="py-4 px-6 font-semibold">Price</th>
                <th className="py-4 px-6 font-semibold hidden md:table-cell">Duration</th>
                <th className="py-4 px-6 font-semibold hidden lg:table-cell">Popular</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {plans.length === 0 && (
                <tr><td colSpan={5} className="py-12 text-center text-gray-500 text-xs">No plans found.</td></tr>
              )}
              {plans.map((p) => (
                <tr key={p._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 text-white font-bold">{p.name}</td>
                  <td className="py-4 px-6 text-white font-mono font-semibold">₹{p.price}</td>
                  <td className="py-4 px-6 text-gray-400 hidden md:table-cell">{p.duration} days</td>
                  <td className="py-4 px-6 hidden lg:table-cell">
                    {p.isPopular ? (
                      <span className="inline-flex items-center gap-1 bg-white/10 text-white border border-white/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        <Star size={11} className="fill-white" /> Popular
                      </span>
                    ) : (
                      <span className="text-gray-500 text-xs">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer" title="Edit"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(p._id)} disabled={deletingId === p._id} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 cursor-pointer" title="Delete"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl" onClick={() => setModalOpen(false)}>
          <div className="bg-[#0b0c10] border border-white/15 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/[0.02]">
              <h2 className="text-white font-bold text-lg">{editTarget ? 'Edit Plan' : 'Add Plan'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-300 text-xs font-semibold mb-1.5">Plan Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className={inputCls} placeholder="Gold Membership" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-xs font-semibold mb-1.5">Price (₹)</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} className={inputCls} placeholder="2999" min="0" required />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs font-semibold mb-1.5">Duration (days)</label>
                  <input type="number" name="duration" value={form.duration} onChange={handleChange} className={inputCls} placeholder="30" min="1" required />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-xs font-semibold mb-1.5">Features (comma-separated)</label>
                <textarea name="features" value={form.features} onChange={handleChange} rows={3} className={inputCls} placeholder="Unlimited access, Olympic platform access, Personal coach session..." />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" name="isPopular" id="planPopular" checked={form.isPopular} onChange={handleChange} className="w-4 h-4 rounded border-white/20 bg-white/5 accent-white cursor-pointer" />
                <label htmlFor="planPopular" className="text-gray-300 text-xs font-medium cursor-pointer">Mark as Most Popular (Highlighted)</label>
              </div>
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 px-5 border border-white/15 hover:border-white/30 text-gray-300 hover:text-white rounded-full text-xs font-semibold transition-colors cursor-pointer">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 px-5 bg-white hover:bg-gray-100 text-gray-950 font-bold rounded-full text-xs transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:scale-105 disabled:opacity-60 cursor-pointer">
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
