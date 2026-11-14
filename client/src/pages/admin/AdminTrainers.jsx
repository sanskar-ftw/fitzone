import React, { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Dumbbell, Award, Briefcase, CheckCircle2, Sparkles, User } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'

const EMPTY = { name: '', specialization: '', experience: '', bio: '', imageUrl: '', isActive: true }

/** AdminTrainers — full luxury CRUD for gym coaches */
export default function AdminTrainers() {
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const fetchTrainers = () => {
    setLoading(true)
    api.get('/trainers')
      .then((res) => setTrainers(Array.isArray(res.data) ? res.data : (res.data?.data || [])))
      .catch(() => toast.error('Failed to load trainers'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTrainers() }, [])

  const openCreate = () => {
    setEditTarget(null)
    setForm(EMPTY)
    setModalOpen(true)
  }

  const openEdit = (trainer) => {
    setEditTarget(trainer)
    setForm({
      name: trainer.name || '',
      specialization: trainer.specialization || '',
      experience: trainer.experience ?? '',
      bio: trainer.bio || '',
      imageUrl: trainer.imageUrl || '',
      isActive: trainer.isActive !== false,
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
        const res = await api.put(`/trainers/${editTarget._id}`, form)
        setTrainers((prev) => prev.map((t) => (t._id === editTarget._id ? res.data : t)))
        toast.success('Trainer updated')
      } else {
        const res = await api.post('/trainers', form)
        setTrainers((prev) => [...prev, res.data])
        toast.success('Trainer added')
      }
      setModalOpen(false)
    } catch {
      toast.error('Failed to save trainer')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trainer?')) return
    setDeletingId(id)
    try {
      await api.delete(`/trainers/${id}`)
      setTrainers((prev) => prev.filter((t) => t._id !== id))
      toast.success('Trainer deleted')
    } catch {
      toast.error('Failed to delete trainer')
    } finally {
      setDeletingId(null)
    }
  }

  const inputCls =
    'w-full bg-[#101016] border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-white/30 placeholder-gray-500 transition-colors'

  const activeTrainersCount = trainers.filter((t) => t.isActive !== false).length

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ── Top Header ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Award size={12} className="text-white" /> Coach Roster
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Trainers &amp; Coaches</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Manage certified coaching staff, disciplines, and 1-on-1 session availability.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-950 font-bold px-6 py-2.5 rounded-full text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:scale-105 cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Add Trainer</span>
        </button>
      </div>

      {/* ── Quick Metric Pills ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0b0c10] border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
          <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block mb-1">Total Mentors</span>
          <div className="text-2xl font-black text-white">{trainers.length}</div>
        </div>
        <div className="bg-[#0b0c10] border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
          <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block mb-1">Active on Floor</span>
          <div className="text-2xl font-black text-emerald-400">{activeTrainersCount}</div>
        </div>
        <div className="bg-[#0b0c10] border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
          <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block mb-1">Elite Disciplines</span>
          <div className="text-2xl font-black text-white">
            {new Set(trainers.map((t) => t.specialization).filter(Boolean)).size || 4}
          </div>
        </div>
      </div>

      {/* ── Table / Cards Container ─────────────────────── */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-[#0b0c10] border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-[11px] uppercase tracking-wider bg-white/[0.02]">
                  <th className="py-4 px-6 font-semibold">Coach</th>
                  <th className="py-4 px-6 font-semibold">Specialization</th>
                  <th className="py-4 px-6 font-semibold hidden md:table-cell">Experience</th>
                  <th className="py-4 px-6 font-semibold hidden lg:table-cell">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {trainers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500 text-xs">
                      No coaches added yet. Click &quot;Add Trainer&quot; to create one.
                    </td>
                  </tr>
                )}
                {trainers.map((t) => (
                  <tr key={t._id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Name & Avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/15 overflow-hidden flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                          {t.imageUrl ? (
                            <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover" />
                          ) : (
                            t.name?.[0]?.toUpperCase() || 'T'
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{t.name}</div>
                          {t.bio && (
                            <div className="text-gray-400 text-[11px] line-clamp-1 max-w-xs">{t.bio}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Specialization */}
                    <td className="py-4 px-6">
                      <span className="inline-block bg-white/5 border border-white/10 text-gray-300 text-xs px-3 py-1 rounded-full font-medium">
                        {t.specialization || 'General Fitness'}
                      </span>
                    </td>

                    {/* Experience */}
                    <td className="py-4 px-6 text-gray-400 hidden md:table-cell font-mono">
                      {t.experience} yrs
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6 hidden lg:table-cell">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${
                          t.isActive !== false
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                            : 'bg-white/5 text-gray-400 border-white/10'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${t.isActive !== false ? 'bg-emerald-400' : 'bg-gray-400'}`} />
                        {t.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEdit(t)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                          title="Edit Coach"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(t._id)}
                          disabled={deletingId === t._id}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                          title="Delete Coach"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modal (Create / Edit) ───────────────────────── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl overflow-y-auto"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-[#0b0c10] border border-white/15 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/[0.02]">
              <div>
                <span className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">Coach Profile</span>
                <h2 className="text-xl font-bold text-white mt-0.5">
                  {editTarget ? 'Edit Trainer' : 'Add New Trainer'}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-300 text-xs font-semibold mb-1.5">Coach Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="e.g. Vikramaditya Singhania"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-xs font-semibold mb-1.5">Specialization</label>
                  <input
                    name="specialization"
                    value={form.specialization}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="e.g. Weight Training, Yoga"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs font-semibold mb-1.5">Experience (Years)</label>
                  <input
                    type="number"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="8"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-xs font-semibold mb-1.5">Image URL</label>
                <input
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              <div>
                <label className="block text-gray-300 text-xs font-semibold mb-1.5">Biography &amp; Certifications</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={3}
                  className={inputCls}
                  placeholder="Describe certifications, transformation specialties, and training approach..."
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  name="isActive"
                  id="trainerActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 accent-white cursor-pointer"
                />
                <label htmlFor="trainerActive" className="text-gray-300 text-xs font-medium cursor-pointer">
                  Active for Member Bookings &amp; Public Display
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 px-5 border border-white/15 hover:border-white/30 text-gray-300 hover:text-white rounded-full text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 px-5 bg-white hover:bg-gray-100 text-gray-950 font-bold rounded-full text-xs transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:scale-105 disabled:opacity-60 cursor-pointer"
                >
                  {saving ? 'Saving...' : editTarget ? 'Save Changes' : 'Create Coach'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
