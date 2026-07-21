'use client'
import { useState } from 'react'

interface Video {
  video_id: number
  title: string
  video_embed_code: string
  thumb_url: string
  status: string
  featured: string
  views: number
  datetime: string
}

function extractYoutubeId(input: string): string | null {
  const patterns = [
    /youtube\.com\/embed\/([^"?&/\s]+)/,
    /youtu\.be\/([^"?&/\s]+)/,
    /youtube\.com\/watch\?v=([^"?&/\s]+)/,
    /youtube\.com\/v\/([^"?&/\s]+)/,
    /youtube\.com\/shorts\/([^"?&/\s]+)/,
  ]
  for (const p of patterns) {
    const m = input.match(p)
    if (m?.[1]) return m[1]
  }
  return null
}

function getEmbedUrl(input: string): string {
  const id = extractYoutubeId(input)
  if (id) return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`
  // If already an embed URL, return as-is
  if (input.includes('youtube.com/embed/') || input.includes('vimeo.com/video/')) return input
  return input
}

function getThumbnail(input: string): string {
  const id = extractYoutubeId(input)
  if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
  return ''
}

const EMPTY_FORM = { title: '', url: '', featured: false }

export default function MediaAdminClient({ videos: initial }: { videos: Video[] }) {
  const [videos, setVideos] = useState(initial)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  // When URL changes — show thumbnail preview
  function handleUrlChange(val: string) {
    setForm((f) => ({ ...f, url: val }))
    const thumb = getThumbnail(val)
    setPreview(thumb || null)
  }

  function openEdit(v: Video) {
    setForm({ title: v.title, url: v.video_embed_code, featured: v.featured === 'feature' })
    setEditingId(v.video_id)
    setPreview(getThumbnail(v.video_embed_code) || v.thumb_url || null)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setPreview(null)
    setError(null)
  }

  async function handleSave() {
    if (!form.title.trim()) { setError('Caption is required.'); return }
    if (!form.url.trim())   { setError('YouTube URL or embed code is required.'); return }

    const embedUrl = getEmbedUrl(form.url)
    const thumb    = getThumbnail(form.url) || ''

    setSaving(true)
    setError(null)

    try {
      if (editingId !== null) {
        const res = await fetch('/api/admin/videos', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            video_id: editingId,
            title: form.title.trim(),
            video_embed_code: embedUrl,
            thumb_url: thumb,
            featured: form.featured,
          }),
        })
        if (!res.ok) throw new Error()

        setVideos((prev) => prev.map((v) =>
          v.video_id === editingId
            ? { ...v, title: form.title.trim(), video_embed_code: embedUrl, thumb_url: thumb, featured: form.featured ? 'feature' : 'no' }
            : v
        ))
      } else {
        const res = await fetch('/api/admin/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.title.trim(),
            video_embed_code: embedUrl,
            thumb_url: thumb,
            featured: form.featured,
            description: '',
            tags: '',
            category: 1,
          }),
        })
        if (!res.ok) throw new Error()

        const json = await res.json()
        setVideos((prev) => [{
          video_id: json.video_id,
          title: form.title.trim(),
          video_embed_code: embedUrl,
          thumb_url: thumb,
          status: 'active',
          featured: form.featured ? 'feature' : 'no',
          views: 0,
          datetime: new Date().toISOString(),
        }, ...prev])
      }
      resetForm()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleStatus(v: Video) {
    const newStatus = v.status === 'active' ? 'inactive' : 'active'
    await fetch('/api/admin/videos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ video_id: v.video_id, status: newStatus }),
    })
    setVideos((prev) => prev.map((vid) =>
      vid.video_id === v.video_id ? { ...vid, status: newStatus } : vid
    ))
  }

  async function toggleFeatured(v: Video) {
    const featured = v.featured !== 'feature'
    await fetch('/api/admin/videos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ video_id: v.video_id, featured }),
    })
    setVideos((prev) => prev.map((vid) =>
      vid.video_id === v.video_id ? { ...vid, featured: featured ? 'feature' : 'no' } : vid
    ))
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this video? This cannot be undone.')) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/videos?id=${id}`, { method: 'DELETE' })
      setVideos((prev) => prev.filter((v) => v.video_id !== id))
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-8">

      {/* Add / Edit form */}
      <div className="p-6 space-y-5 bg-white border border-border rounded-xl">
        <h2 className="text-lg font-bold font-display text-green">
          {editingId !== null ? 'Edit Video' : 'Add a New Video'}
        </h2>

        {/* Caption */}
        <div>
          <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
            Caption <span className="text-gold">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
            placeholder="e.g. Pakistan National Day Celebrations 2024"
          />
        </div>

        {/* YouTube URL */}
        <div>
          <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
            YouTube URL <span className="text-gold">*</span>
          </label>
          <input
            type="text"
            value={form.url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <p className="text-xs text-ink-muted font-body mt-1.5">
            Paste any YouTube URL — watch page, short, or share link. Thumbnail is auto-extracted.
          </p>
        </div>

        {/* Thumbnail preview */}
        {preview && (
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide uppercase text-ink-muted font-body">Thumbnail Preview</p>
            <div className="w-48 overflow-hidden border rounded-lg border-border aspect-video">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Video thumbnail" className="object-cover w-full h-full" />
            </div>
          </div>
        )}

        {/* Featured toggle */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
            className={`w-10 h-5 rounded-full transition-colors flex items-center flex-shrink-0 ${form.featured ? 'bg-gold' : 'bg-border'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${form.featured ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
          <div>
            <p className="text-sm font-semibold text-ink-dark font-body">Featured</p>
            <p className="text-xs text-ink-muted font-body">Featured videos appear prominently on the homepage</p>
          </div>
        </label>

        {error && <p className="text-sm text-red-500 font-body">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gold text-white px-6 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : editingId !== null ? 'Update Video' : 'Add Video'}
          </button>
          {editingId !== null && (
            <button
              onClick={resetForm}
              className="border border-border text-ink-mid px-6 py-2.5 rounded-md text-sm font-semibold font-body hover:border-green hover:text-green transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Video list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-display text-green">
            All Videos <span className="text-base font-normal text-ink-muted">({videos.length})</span>
          </h2>
        </div>

        {videos.length === 0 ? (
          <div className="py-16 text-center bg-white border border-border rounded-xl">
            <p className="text-sm text-ink-muted font-body">No videos added yet. Add your first one above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {videos.map((v) => (
              <div key={v.video_id} className="overflow-hidden bg-white border border-border rounded-xl">
                <div className="flex items-center gap-4 p-4">

                  {/* Thumbnail */}
                  <div className="w-32 h-[72px] rounded-lg overflow-hidden bg-cream border border-border flex-shrink-0 relative">
                    {v.thumb_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={v.thumb_url} alt={v.title} className="object-cover w-full h-full" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-green/10">
                        <div className="w-6 h-6 border-2 rounded-sm border-green/30" />
                      </div>
                    )}
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="flex items-center justify-center rounded-full w-7 h-7 bg-white/90">
                        <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-l-[9px] border-t-transparent border-b-transparent border-l-green ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-sm font-semibold truncate text-ink-dark font-body">{v.title}</p>
                      {v.featured === 'feature' && (
                        <span className="text-[10px] font-bold text-gold bg-gold-pale px-2 py-0.5 rounded font-body flex-shrink-0">Featured</span>
                      )}
                    </div>
                    <p className="text-xs text-ink-muted font-body">
                      Added {new Date(v.datetime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {' · '}{v.views.toLocaleString()} views
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-end flex-shrink-0 gap-3">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded border font-body ${
                      v.status === 'active'
                        ? 'bg-green/10 text-green border-green/20'
                        : 'bg-gray-50 text-gray-400 border-gray-200'
                    }`}>
                      {v.status}
                    </span>
                    <button onClick={() => toggleFeatured(v)} className="text-xs transition-colors text-ink-muted font-body hover:text-gold">
                      {v.featured === 'feature' ? 'Unfeature' : 'Feature'}
                    </button>
                    <button onClick={() => toggleStatus(v)} className="text-xs transition-colors text-ink-muted font-body hover:text-green">
                      {v.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => openEdit(v)} className="text-xs font-semibold text-gold font-body hover:underline">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(v.video_id)}
                      disabled={deleting === v.video_id}
                      className="text-xs text-red-500 font-body hover:underline disabled:opacity-50"
                    >
                      {deleting === v.video_id ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}