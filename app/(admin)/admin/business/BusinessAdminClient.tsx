'use client'
import { useState } from 'react'

interface Biz {
  id: number
  company_name: string
  name: string
  email: string
  city: string
  country: string
  shortdesc: string
  status: number
  image: string | null
  phone?: string
  address?: string
  site_url?: string
  busniss_id?: number
}

const STATUS_STYLES: Record<number, string> = {
  0: 'bg-amber-50 text-amber-700 border border-amber-200',
  1: 'bg-green/10 text-green border border-green/20',
  2: 'bg-red-50 text-red-700 border border-red-200',
}

const STATUS_LABELS: Record<number, string> = { 0: 'Pending', 1: 'Approved', 2: 'Rejected' }

const CATEGORIES: Record<number, string> = {
  1: 'Property', 2: 'Importers & Exporters', 3: 'Hospitality',
  4: 'Furniture & Furnishings', 5: 'Cash & Carries', 6: 'Accountants',
  7: 'IT / Computing', 8: 'Electrical Goods', 9: 'Travel & Tourism',
  10: 'Jobs', 11: 'Hajj & Umrah', 12: 'Photography & Videography',
  13: 'Restaurants / Take Aways', 14: 'Charities', 15: 'Driving Schools',
  16: 'Education', 17: 'Hospitals',
}

export default function BusinessAdminClient({ businesses: initial }: { businesses: Biz[] }) {
  const [businesses, setBusinesses] = useState(initial)
  const [editing, setEditing] = useState<Biz | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [filter, setFilter] = useState<0 | 1 | 2 | 'all'>('all')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const filtered = filter === 'all' ? businesses : businesses.filter((b) => b.status === filter)
  const pendingCount = businesses.filter((b) => b.status === 0).length

  function openEdit(b: Biz) {
    setEditing({ ...b })
    setImageFile(null)
    setImagePreview(b.image)
    setError(null)
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    setError(null)

    try {
      let imagePath = editing.image

      if (imageFile) {
        const formData = new FormData()
        formData.append('file', imageFile)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        if (uploadRes.ok) {
          const uploadJson = await uploadRes.json()
          imagePath = uploadJson.path ?? imagePath
        }
      }

      const res = await fetch(`/api/admin/business/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editing, image: imagePath }),
      })

      if (!res.ok) { setError('Failed to save.'); return }

      setBusinesses((prev) => prev.map((b) =>
        b.id === editing.id ? { ...editing, image: imagePath } : b
      ))
      setEditing(null)
    } catch {
      setError('Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this business permanently?')) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/business/${id}`, { method: 'DELETE' })
      setBusinesses((prev) => prev.filter((b) => b.id !== id))
      if (editing?.id === id) setEditing(null)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="flex items-start gap-6">

      {/* List */}
      <div className="flex-1 min-w-0">
        <div className="flex gap-2 pb-4 mb-5 border-b border-border">
          {([0, 1, 2, 'all'] as const).map((f) => (
            <button
              key={String(f)}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium font-body border transition-colors ${
                filter === f ? 'bg-green text-white border-green' : 'border-border text-ink-mid hover:border-green'
              }`}
            >
              {f === 'all' ? 'All' : STATUS_LABELS[f as number]}
              {f === 0 && pendingCount > 0 && (
                <span className="ml-1.5 bg-gold text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map((b) => (
            <div
              key={b.id}
              className={`bg-white border rounded-xl p-4 flex items-center gap-3 transition-all ${
                editing?.id === b.id ? 'border-gold shadow-md' : 'border-border'
              }`}
            >
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 overflow-hidden border rounded-lg bg-cream border-border">
                {b.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.image} alt={b.company_name} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-5 h-5 border-2 rounded-sm border-border" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-ink-dark font-body">{b.company_name}</p>
                <p className="text-xs text-ink-muted font-body">{b.city}, {b.country}</p>
              </div>

              <span className={`text-[11px] font-bold px-2 py-0.5 rounded font-body flex-shrink-0 ${STATUS_STYLES[b.status]}`}>
                {STATUS_LABELS[b.status]}
              </span>

              <div className="flex items-center flex-shrink-0 gap-2">
                <button onClick={() => openEdit(b)} className="text-xs font-semibold text-gold font-body hover:underline">Edit</button>
                <button
                  onClick={() => handleDelete(b.id)}
                  disabled={deleting === b.id}
                  className="text-xs text-red-500 font-body hover:underline disabled:opacity-50"
                >
                  {deleting === b.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit panel */}
      {editing && (
        <div className="w-[380px] flex-shrink-0 bg-white border border-border rounded-xl p-6 sticky top-6 space-y-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-green">Edit Business</h3>
            <button onClick={() => setEditing(null)} className="text-xl text-ink-muted hover:text-ink-dark">×</button>
          </div>

          {/* Image upload */}
          <div>
            <label className="block mb-2 text-xs font-semibold tracking-wide uppercase text-ink-muted font-body">Logo / Image</label>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-16 h-16 overflow-hidden border rounded-lg bg-cream border-border">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
                ) : (
                  <div className="w-6 h-6 border-2 rounded-sm border-border" />
                )}
              </div>
              <label className="px-3 py-2 text-xs font-semibold transition-colors border rounded-md cursor-pointer bg-cream border-border text-ink-dark font-body hover:border-gold">
                Change Image
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">Status</label>
            <select
              value={editing.status}
              onChange={(e) => setEditing({ ...editing, status: Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm border rounded-md border-border font-body focus:outline-none focus:border-gold"
            >
              <option value={0}>Pending</option>
              <option value={1}>Approved</option>
              <option value={2}>Rejected</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">Category</label>
            <select
              value={editing.busniss_id ?? 0}
              onChange={(e) => setEditing({ ...editing, busniss_id: Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm border rounded-md border-border font-body focus:outline-none focus:border-gold"
            >
              <option value={0}>Uncategorised</option>
              {Object.entries(CATEGORIES).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>

          {/* Fields */}
          {[
            { label: 'Company Name', key: 'company_name' },
            { label: 'Contact Name', key: 'name' },
            { label: 'Email', key: 'email' },
            { label: 'Phone', key: 'phone' },
            { label: 'City', key: 'city' },
            { label: 'Country', key: 'country' },
            { label: 'Address', key: 'address' },
            { label: 'Website URL', key: 'site_url' },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">{label}</label>
              <input
                type="text"
          value={(editing as unknown as Record<string, string>)[key] ?? ''}
                onChange={(e) => setEditing({ ...editing, [key]: e.target.value })}
                className="w-full px-3 py-2 text-sm transition-colors border rounded-md border-border font-body focus:outline-none focus:border-gold"
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">Short Description</label>
            <textarea
              value={editing.shortdesc ?? ''}
              onChange={(e) => setEditing({ ...editing, shortdesc: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 text-sm transition-colors border rounded-md resize-none border-border font-body focus:outline-none focus:border-gold"
            />
          </div>

          {error && <p className="text-sm text-red-500 font-body">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-gold text-white rounded-md py-2.5 text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => handleDelete(editing.id)}
              disabled={deleting === editing.id}
              className="bg-red-50 text-red-700 border border-red-200 rounded-md px-4 py-2.5 text-sm font-semibold font-body hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}