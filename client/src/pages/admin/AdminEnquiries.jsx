import React, { useEffect, useState } from 'react'
import { Trash2, RefreshCw, Download, Search, CheckCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'
import { exportToCsv } from '../../utils/csvExport'

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

/** AdminEnquiries — status toggle, search, filter and CSV export for contact enquiries */
export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'new' | 'resolved'
  const [searchQuery, setSearchQuery] = useState('')

  const fetchEnquiries = () => {
    setLoading(true)
    api.get('/enquiries')
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : (res.data?.data || [])
        const sorted = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setEnquiries(sorted)
      })
      .catch(() => toast.error('Failed to load enquiries'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchEnquiries() }, [])

  const handleToggleStatus = async (enquiry) => {
    const newStatus = enquiry.status === 'new' ? 'resolved' : 'new'
    setTogglingId(enquiry._id)
    try {
      const res = await api.put(`/enquiries/${enquiry._id}`, { status: newStatus })
      setEnquiries((prev) =>
        prev.map((e) => (e._id === enquiry._id ? { ...e, status: res.data.status } : e))
      )
      toast.success(`Marked as ${newStatus}`)
    } catch {
      toast.error('Failed to update status')
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry record?')) return
    setDeletingId(id)
    try {
      await api.delete(`/enquiries/${id}`)
      setEnquiries((prev) => prev.filter((e) => e._id !== id))
      toast.success('Enquiry deleted')
    } catch {
      toast.error('Failed to delete enquiry')
    } finally {
      setDeletingId(null)
    }
  }

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      (e.name || '').toLowerCase().includes(q) ||
      (e.email || '').toLowerCase().includes(q) ||
      (e.message || '').toLowerCase().includes(q) ||
      (e.phone || '').includes(q)
    return matchesStatus && matchesSearch
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Customer Enquiries & Leads</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage contact inquiries, update resolution status, and export CRM leads</p>
        </div>

        <button
          onClick={() =>
            exportToCsv('fitzone_enquiries', filteredEnquiries, [
              { label: 'Name', accessor: 'name' },
              { label: 'Email', accessor: 'email' },
              { label: 'Phone', accessor: (e) => e.phone || 'N/A' },
              { label: 'Message', accessor: 'message' },
              { label: 'Status', accessor: 'status' },
              { label: 'Submitted Date', accessor: (e) => fmt(e.createdAt) },
            ])
          }
          className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors shadow-sm"
        >
          <Download size={13} className="text-purple-400" /> Export Leads (CSV)
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search inquiries by name, email, phone, or question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0b0c10] border border-white/10 rounded-full pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:border-white/30 focus:outline-none"
          />
          <Search size={14} className="absolute left-3.5 top-3 text-gray-500" />
        </div>

        <div className="flex items-center gap-1.5 bg-[#0b0c10] p-1 rounded-full border border-white/10 text-xs">
          {['all', 'new', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-1.5 rounded-full capitalize font-medium transition-all ${
                statusFilter === st
                  ? 'bg-white text-gray-950 font-bold shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card overflow-x-auto p-0 border border-white/10 bg-[#0b0c10] rounded-3xl shadow-xl backdrop-blur-xl">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.02] border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-4 px-5 text-left">Prospect</th>
                <th className="py-4 px-5 text-left">Email</th>
                <th className="py-4 px-5 text-left hidden md:table-cell">Phone</th>
                <th className="py-4 px-5 text-left hidden lg:table-cell">Message</th>
                <th className="py-4 px-5 text-left">Status</th>
                <th className="py-4 px-5 text-left hidden xl:table-cell">Received</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 text-xs">
                    No enquiries found matching your search.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((e) => (
                  <tr key={e._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-5 text-white font-semibold">{e.name}</td>
                    <td className="py-4 px-5 text-gray-400 text-xs">{e.email}</td>
                    <td className="py-4 px-5 text-gray-400 text-xs hidden md:table-cell">{e.phone || '—'}</td>
                    <td className="py-4 px-5 text-gray-300 text-xs hidden lg:table-cell max-w-xs truncate">
                      {e.message}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${
                          e.status === 'new'
                            ? 'bg-white/10 text-white border border-white/20'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {e.status === 'new' ? <Clock size={11} /> : <CheckCircle size={11} />}
                        {e.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-gray-500 text-xs hidden xl:table-cell font-mono">{fmt(e.createdAt)}</td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleStatus(e)}
                          disabled={togglingId === e._id}
                          className="px-3 py-1 text-xs text-white hover:text-gray-200 hover:bg-white/10 border border-white/15 rounded-full transition-colors font-medium disabled:opacity-50 cursor-pointer"
                          title="Toggle between New and Resolved"
                        >
                          {e.status === 'new' ? 'Mark Resolved' : 'Mark New'}
                        </button>
                        <button
                          onClick={() => handleDelete(e._id)}
                          disabled={deletingId === e._id}
                          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete enquiry"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
