import React, { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'

const EMPTY = { name: '', description: '', imageUrl: '', isActive: true }

/** AdminFacilities — full CRUD for gym facilities */
export default function AdminFacilities() {
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const fetchFacilities = () => {
    setLoading(true)
    api.get('/facilities')
      .then((res) => setFacilities(Array.isArray(res.data) ? res.data : (res.data?.data || [])))
      .catch(() => toast.error('Failed to load facilities'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchFacilities() }, [])

  const openCreate = () => {
    setEditTarget(null)
    setForm(EMPTY)
    setModalOpen(true)
  }

  const openEdit = (f) => {
    setEditTarget(f)
    setForm({
      name: f.name || '',
      description: f.description || '',
      imageUrl: f.imageUrl || '',
      isActive: f.isActive !== false,
    })
    setModalOpen(true)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Name is required'); return }
    setSaving(true)
    try {
      if (editTarget) {
        const res = await api.put(`/facilities/${editTarget._id}`, form)
        setFacilities((prev) => prev.map((f) => (f._id === editTarget._id ? res.data : f)))
        toast.success('Facility updated')
      } else {
        const res = await api.post('/facilities', form)
        setFacilities((prev) => [...prev, res.data])
        toast.success('Facility added')
      }
      setModalOpen(false)
    } catch {
      toast.error('Failed to save facility')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this facility?')) return
    setDeletingId(id)
    try {
      await api.delete(`/facilities/${id}`)
      setFacilities((prev) => prev.filter((f) => f._id !== id))
      toast.success('Facility deleted')
    } catch {
      toast.error('Failed to delete facility')
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
            Facility Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Gym Facilities</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-0.5">Manage areas, equipment rooms, and operational zones</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-950 font-bold px-6 py-2.5 rounded-full text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:scale-105 cursor-pointer shrink-0"
        >
          <Plus size={16} /> Add Facility
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-[#0b0c10] border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-[11px] uppercase tracking-wider bg-white/[0.02]">
                <th className="py-4 px-6 font-semibold">Name</th>
                <th className="py-4 px-6 font-semibold hidden md:table-cell">Description</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {facilities.length === 0 && (
                <tr><td colSpan={4} className="py-12 text-center text-gray-500 text-xs">No facilities added yet.</td></tr>
              )}
              {facilities.map((f) => (
                <tr key={f._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 text-white font-bold">{f.name}</td>
                  <td className="py-4 px-6 text-gray-400 hidden md:table-cell max-w-xs truncate text-xs">{f.description}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${
                      f.isActive ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-gray-400 border-white/10'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${f.isActive ? 'bg-emerald-400' : 'bg-gray-400'}`} />
                      {f.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button onClick={() => openEdit(f)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer" title="Edit"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(f._id)} disabled={deletingId === f._id} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 cursor-pointer" title="Delete"><Trash2 size={15} /></button>
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
              <h2 className="text-white font-bold text-lg">{editTarget ? 'Edit Facility' : 'Add Facility'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-300 text-xs font-semibold mb-1.5">Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className={inputCls} placeholder="Olympic Swimming Pool" required />
              </div>
              <div>
                <label className="block text-gray-300 text-xs font-semibold mb-1.5">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={inputCls} placeholder="Facility description..." />
              </div>
              <div>
                <label className="block text-gray-300 text-xs font-semibold mb-1.5">Image URL</label>
                <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className={inputCls} placeholder="https://..." />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" name="isActive" id="facilityActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 rounded border-white/20 bg-white/5 accent-white cursor-pointer" />
                <label htmlFor="facilityActive" className="text-gray-300 text-xs font-medium cursor-pointer">Active for Public View</label>
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
