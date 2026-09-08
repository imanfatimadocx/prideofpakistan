'use client'
import { useState } from 'react'

interface Banner {
  id: number
  type: string
  title: string | null
  message: string
  image: string | null
  ctaLabel: string | null
  ctaLink: string | null
  color: string
  active: boolean
  startDate: string
  endDate: string
  createdAt: string
}

const EMPTY: Omit<Banner, 'id' | 'createdAt'> = {
  type:      'strip',
  title:     '',
  message:   '',
  image:     null,
  ctaLabel:  '',
  ctaLink:   '',
  color:     'green',
  active:    true,
  startDate: new Date().toISOString().slice(0, 16),
  endDate:   new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16),
}

const TYPE_LABELS = { modal: 'Full-screen Modal', strip: 'Dismissible Strip' }
const COLOR_STYLES: Record<string, string> = {
  green: 'bg-green text-white',
  gold:  'bg-gold text-white',
  red:   'bg-red-600 text-white',
}

function toLocalDatetime(iso: string) {
  return iso.slice(0, 16)
}

export default function BannersClient({ banners: initial }: { banners: Banner[] }) {
  const [banners, setBanners]     = useState(initial)
  const [showForm, setShowForm]   = useState(false)
  const [form, setForm]           = useState(EMPTY)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [saving, setSaving]       = useState(false)
  const [deleting, setDeleting]   = useState<number | null>(null)
  const [error, setError]         = useState<string | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [imagePreview, setImagePreview]     = useState<string | null>(null)

  function openNew() {
    setForm(EMPTY)
    setEditingId(null)
    setImagePreview(null)
    setError(null)
    setShowForm(true)
  }

  function openEdit(b: Banner) {
    setForm({
      type:      b.type,
      title:     b.title ?? '',
      message:   b.message,
      image:     b.image,
      ctaLabel:  b.ctaLabel ?? '',
      ctaLink:   b.ctaLink ?? '',
      color:     b.color,
      active:    b.active,
      startDate: toLocalDatetime(b.startDate),
      endDate:   toLocalDatetime(b.endDate),
    })
    setEditingId(b.id)
    setImagePreview(b.image)
    setError(null)
    setShowForm(true)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res  = await fetch('/api/upload', { method: 'POST', body: formData })
      const json = await res.json()
      const url  = json.url ?? json.path ?? ''
      setForm((f) => ({ ...f, image: url }))
      setImagePreview(url)
    } finally { setImageUploading(false) }
  }

  async function handleSave() {
    if (!form.message.trim()) { setError('Message is required.'); return }
    if (!form.startDate || !form.endDate) { setError('Start and end dates required.'); return }
    setSaving(true); setError(null)
    try {
      const payload = {
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        endDate:   new Date(form.endDate).toISOString(),
      }
      if (editingId) {
        await fetch(`/api/admin/banners/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        setBanners((prev) => prev.map((b) => b.id === editingId ? { ...b, ...form, id: editingId, createdAt: b.createdAt } : b))
      } else {
        const res  = await fetch('/api/admin/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const json = await res.json()
        setBanners((prev) => [{ ...form, id: json.id, createdAt: new Date().toISOString() }, ...prev])
      }
      setShowForm(false)
    } catch { setError('Something went wrong.') }
    finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this banner?')) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' })
      setBanners((prev) => prev.filter((b) => b.id !== id))
    } finally { setDeleting(null) }
  }

  async function toggleActive(b: Banner) {
    await fetch(`/api/admin/banners/${b.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !b.active }),
    })
    setBanners((prev) => prev.map((x) => x.id === b.id ? { ...x, active: !x.active } : x))
  }

  const now = new Date()
  function isLive(b: Banner) {
    return b.active && new Date(b.startDate) <= now && new Date(b.endDate) >= now
  }

  return (
    <div className="space-y-5">
      {/* Create button */}
      {!showForm && (
        <button
          onClick={openNew}
          className="bg-gold text-white px-5 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors"
        >
          + Create Banner
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="overflow-hidden bg-white border border-border rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-cream">
            <h2 className="text-base font-bold font-display text-green">
              {editingId ? 'Edit Banner' : 'New Banner'}
            </h2>
            <button onClick={() => setShowForm(false)} className="text-xs text-ink-muted font-body hover:text-ink-dark">Cancel</button>
          </div>

          <div className="p-5 space-y-4">
            {error && <p className="text-sm text-red-500 font-body">{error}</p>}

            {/* Type */}
            <div className="grid grid-cols-2 gap-3">
              {(['strip', 'modal'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: t }))}
                  className={`border rounded-xl p-4 text-left transition-colors ${form.type === t ? 'border-gold bg-gold-pale' : 'border-border hover:border-gold/50'}`}
                >
                  <p className="text-sm font-bold text-ink-dark font-body">{TYPE_LABELS[t]}</p>
                  <p className="text-xs text-ink-muted font-body mt-0.5">
                    {t === 'strip' ? 'Bar below navbar, dismissible' : 'Full-screen popup on first visit'}
                  </p>
                </button>
              ))}
            </div>

            {/* Title (modal only) */}
            {form.type === 'modal' && (
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">Title</label>
                <input
                  type="text"
                  value={form.title ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Happy Independence Day!"
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold"
                />
              </div>
            )}

            {/* Message */}
            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
                Message <span className="text-gold">*</span>
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                rows={form.type === 'modal' ? 4 : 2}
                placeholder={form.type === 'strip' ? 'Short announcement…' : 'Your event message…'}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold resize-none"
              />
            </div>

            {/* Image (modal only) */}
            {form.type === 'modal' && (
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">Image</label>
                {imagePreview && (
                  <div className="w-full mb-3 overflow-hidden border rounded-lg border-border" style={{ aspectRatio: '540/280' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Banner" className="object-cover w-full h-full" />
                  </div>
                )}
                <label className={`w-full cursor-pointer bg-cream border border-border rounded-md px-4 py-2.5 text-xs font-semibold text-ink-dark font-body hover:border-gold transition-colors text-center block ${imageUploading ? 'opacity-50' : ''}`}>
                  {imageUploading ? 'Uploading…' : imagePreview ? 'Change Image' : 'Upload Image'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={imageUploading} />
                </label>
                {imagePreview && (
                  <button onClick={() => { setForm((f) => ({ ...f, image: null })); setImagePreview(null) }} className="block mt-1 text-xs text-red-500 font-body hover:underline">Remove</button>
                )}
              </div>
            )}

            {/* CTA */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">CTA Button Label</label>
                <input
                  type="text"
                  value={form.ctaLabel ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, ctaLabel: e.target.value }))}
                  placeholder="e.g. Learn More"
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">CTA Link</label>
                <input
                  type="text"
                  value={form.ctaLink ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, ctaLink: e.target.value }))}
                  placeholder="/events or https://…"
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            {/* Color (strip only) */}
            {form.type === 'strip' && (
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">Strip Color</label>
                <div className="flex gap-3">
                  {['green', 'gold', 'red'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, color: c }))}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold font-body border-2 transition-all ${COLOR_STYLES[c]} ${form.color === c ? 'border-ink-dark scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    >
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">Start Date & Time</label>
                <input
                  type="datetime-local"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">End Date & Time</label>
                <input
                  type="datetime-local"
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            {/* Active toggle */}
            <div className="flex items-center justify-between px-4 py-3 bg-cream rounded-xl">
              <div>
                <p className="text-sm font-semibold text-ink-dark font-body">Active</p>
                <p className="text-xs text-ink-muted font-body">Inactive banners are saved but never shown</p>
              </div>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                className={`w-11 h-6 rounded-full transition-colors flex items-center ${form.active ? 'bg-gold' : 'bg-border'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${form.active ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 text-sm font-semibold text-white transition-colors rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark disabled:opacity-50"
            >
              {saving ? 'Saving…' : editingId ? 'Update Banner' : 'Create Banner'}
            </button>
          </div>
        </div>
      )}

      {/* Banners list */}
      {banners.length === 0 ? (
        <div className="p-10 text-center bg-white border border-border rounded-xl">
          <p className="text-sm text-ink-muted font-body">No banners yet. Create one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((b) => {
            const live = isLive(b)
            return (
              <div key={b.id} className={`bg-white border rounded-xl p-5 ${live ? 'border-gold/40' : 'border-border'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded font-body ${b.type === 'modal' ? 'bg-green/10 text-green' : `${COLOR_STYLES[b.color]} opacity-90`}`}>
                        {TYPE_LABELS[b.type as keyof typeof TYPE_LABELS]}
                      </span>
                      {live && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-green font-body">
                          <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                          Live
                        </span>
                      )}
                      {!b.active && (
                        <span className="text-[10px] font-bold text-ink-muted font-body bg-cream px-2 py-0.5 rounded">Inactive</span>
                      )}
                    </div>
                    {b.title && <p className="text-sm font-bold text-ink-dark font-body">{b.title}</p>}
                    <p className="text-sm text-ink-muted font-body line-clamp-2 mt-0.5">{b.message}</p>
                    <p className="mt-2 text-xs text-ink-muted font-body">
                      {new Date(b.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {' → '}
                      {new Date(b.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0 gap-2">
                    <button
                      onClick={() => toggleActive(b)}
                      className={`text-xs font-semibold font-body hover:underline ${b.active ? 'text-amber-600' : 'text-green'}`}
                    >
                      {b.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => openEdit(b)} className="text-xs font-semibold text-gold font-body hover:underline">Edit</button>
                    <button onClick={() => handleDelete(b.id)} disabled={deleting === b.id} className="text-xs text-red-500 font-body hover:underline disabled:opacity-50">
                      {deleting === b.id ? '…' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}