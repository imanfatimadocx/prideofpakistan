'use client'
import { useState } from 'react'

interface Profile {
  id: number
  title: string
  Profession: string
  City: string
  Country: string
  Email: string
  status: number
  image: string | null
  shortdesc: string
  description?: string
  facebook?: string
  twitter?: string
  linkedin?: string
}

const STATUS_STYLES: Record<number, string> = {
  0: 'bg-amber-50 text-amber-700 border border-amber-200',
  1: 'bg-green/10 text-green border border-green/20',
  2: 'bg-red-50 text-red-700 border border-red-200',
}

const STATUS_LABELS: Record<number, string> = { 0: 'Pending', 1: 'Approved', 2: 'Rejected' }

function resolveImage(image: string | null): string | null {
  if (!image) return null
  if (image.startsWith('http')) return image
  if (image.startsWith('/')) return image
  return `/uploads/${image}`
}

export default function ProfilesAdminClient({ profiles: initial }: { profiles: Profile[] }) {
  const [profiles, setProfiles] = useState(initial)
  const [editing, setEditing] = useState<Profile | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [filter, setFilter] = useState<0 | 1 | 2 | 'all'>('all')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const filtered = filter === 'all' ? profiles : profiles.filter((p) => p.status === filter)
  const pendingCount = profiles.filter((p) => p.status === 0).length

  function openEdit(p: Profile) {
    setEditing({ ...p })
    setImageFile(null)
    setImagePreview(resolveImage(p.image))
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
          imagePath = uploadJson.url ?? uploadJson.path ?? imagePath
        }
      }

      const res = await fetch(`/api/admin/profiles/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editing, image: imagePath }),
      })

      if (!res.ok) { setError('Failed to save.'); return }

      setProfiles((prev) => prev.map((p) =>
        p.id === editing.id ? { ...editing, image: imagePath } : p
      ))
      setEditing(null)
      setImageFile(null)
      setImagePreview(null)
    } catch {
      setError('Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this profile permanently? This cannot be undone.')) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/profiles/${id}`, { method: 'DELETE' })
      setProfiles((prev) => prev.filter((p) => p.id !== id))
      if (editing?.id === id) setEditing(null)
    } finally {
      setDeleting(null)
    }
  }

  async function updateStatus(id: number, status: number) {
    await fetch(`/api/admin/profiles/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setProfiles((prev) => prev.map((p) => p.id === id ? { ...p, status } : p))
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
          {filtered.map((p) => (
            <div
              key={p.id}
              className={`bg-white border rounded-xl p-4 flex items-center gap-3 transition-all ${
                editing?.id === p.id ? 'border-gold shadow-md' : 'border-border'
              }`}
            >
              {resolveImage(p.image) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resolveImage(p.image)!}
                  alt={p.title}
                  className="flex-shrink-0 object-top w-10 h-10 rounded-full object-fit"
                />
              ) : (
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 font-bold text-white rounded-full bg-green font-display">
                  {p.title.charAt(0)}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-ink-dark font-body">{p.title}</p>
                <p className="text-xs text-ink-muted font-body">{p.Profession} {p.City && `· ${p.City}`}</p>
              </div>

              <span className={`text-[11px] font-bold px-2 py-0.5 rounded font-body flex-shrink-0 ${STATUS_STYLES[p.status]}`}>
                {STATUS_LABELS[p.status]}
              </span>

              <div className="flex items-center flex-shrink-0 gap-2">
                {p.status === 0 && (
                  <>
                    <button onClick={() => updateStatus(p.id, 1)} className="text-xs font-semibold text-green font-body hover:underline">Approve</button>
                    <button onClick={() => updateStatus(p.id, 2)} className="text-xs text-red-500 font-body hover:underline">Reject</button>
                  </>
                )}
                {p.status === 1 && (
                  <button onClick={() => updateStatus(p.id, 2)} className="text-xs transition-colors text-ink-muted font-body hover:text-red-500">Revoke</button>
                )}
                {p.status === 2 && (
                  <button onClick={() => updateStatus(p.id, 1)} className="text-xs text-green font-body hover:underline">Re-approve</button>
                )}
                <button onClick={() => openEdit(p)} className="text-xs font-semibold text-gold font-body hover:underline">Edit</button>
                <button
                  onClick={() => handleDelete(p.id)}
                  disabled={deleting === p.id}
                  className="text-xs text-red-500 font-body hover:underline disabled:opacity-50"
                >
                  {deleting === p.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit panel */}
      {editing && (
        <div className="w-[420px] flex-shrink-0 bg-white border border-border rounded-xl p-6 sticky top-6 space-y-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-green">Edit Profile</h3>
            <button onClick={() => setEditing(null)} className="text-xl text-ink-muted hover:text-ink-dark">×</button>
          </div>

          {/* Image upload */}
          <div>
            <label className="block mb-2 text-xs font-semibold tracking-wide uppercase text-ink-muted font-body">Photo</label>
            <div className="flex items-center gap-3">
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="object-top w-16 h-16 border rounded-lg object-fit border-border"
                />
              ) : (
                <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold border rounded-lg bg-cream border-border text-green font-display">
                  {editing.title.charAt(0)}
                </div>
              )}
              <label className="px-3 py-2 text-xs font-semibold transition-colors border rounded-md cursor-pointer bg-cream border-border text-ink-dark font-body hover:border-gold">
                Change Photo
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

          {/* Text fields */}
          {[
            { label: 'Full Name',    key: 'title' },
            { label: 'Profession',   key: 'Profession' },
            { label: 'City',         key: 'City' },
            { label: 'Country',      key: 'Country' },
            { label: 'Email',        key: 'Email' },
            { label: 'Facebook URL', key: 'facebook' },
            { label: 'Twitter URL',  key: 'twitter' },
            { label: 'LinkedIn URL', key: 'linkedin' },
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

          {/* Short description */}
          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
              Short Description
            </label>
            <textarea
              value={editing.shortdesc ?? ''}
              onChange={(e) => setEditing({ ...editing, shortdesc: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 text-sm transition-colors border rounded-md resize-none border-border font-body focus:outline-none focus:border-gold"
              placeholder="Brief summary shown on profile cards"
            />
          </div>

          {/* Full description */}
          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
              Full Description
            </label>
            <textarea
              value={(editing.description ?? '').replace(/<[^>]*>/g, '')}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              rows={10}
              className="w-full px-3 py-2 text-sm leading-relaxed transition-colors border rounded-md resize-none border-border font-body focus:outline-none focus:border-gold"
              placeholder="Full profile description"
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