'use client'
import { useState } from 'react'

interface Field {
  key: string
  label: string
  type: 'text' | 'textarea'
}

interface ImageItem {
  src: string
  caption: string
}

export default function PageContentClient({
  page,
  initial,
  fields,
  initialImages = [],
}: {
  page: string
  initial: Record<string, string>
  fields: Field[]
  initialImages?: ImageItem[]
}) {
  const [form, setForm]       = useState(initial)
  const [images, setImages]   = useState<ImageItem[]>(initialImages)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  async function handleAddImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) { setError('Upload failed.'); return }
      const json = await res.json()
      const url = json.url ?? json.path
      setImages((prev) => [...prev, { src: url, caption: '' }])
    } catch {
      setError('Upload failed.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  function updateCaption(index: number, caption: string) {
    setImages((prev) => prev.map((img, i) => i === index ? { ...img, caption } : img))
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  function moveUp(index: number) {
    if (index === 0) return
    setImages((prev) => {
      const next = [...prev]
      ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
      return next
    })
  }

  function moveDown(index: number) {
    setImages((prev) => {
      if (index === prev.length - 1) return prev
      const next = [...prev]
      ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
      return next
    })
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/pages/${page}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, _images: images }),
      })
      if (!res.ok) { setError('Failed to save.'); return }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {saved && (
        <div className="px-4 py-3 text-sm font-semibold border rounded-lg bg-green/10 border-green/20 text-green font-body">
          Saved successfully.
        </div>
      )}
      {error && (
        <div className="px-4 py-3 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50 font-body">
          {error}
        </div>
      )}

      {/* Text fields */}
      <div className="p-6 space-y-5 bg-white border border-border rounded-xl">
        <h2 className="text-base font-bold font-display text-green">Page Text</h2>
        {fields.map(({ key, label, type }) => (
          <div key={key}>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
              {label}
            </label>
            {type === 'textarea' ? (
              <textarea
                value={form[key] ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                rows={5}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold transition-colors resize-none"
              />
            ) : (
              <input
                type="text"
                value={form[key] ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold transition-colors"
              />
            )}
          </div>
        ))}
      </div>

      {/* Image management */}
      <div className="p-6 space-y-5 bg-white border border-border rounded-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold font-display text-green">Carousel Images</h2>
          <label className={`cursor-pointer bg-gold text-white px-4 py-2 rounded-md text-xs font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {uploading ? 'Uploading…' : '+ Add Image'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAddImage}
              disabled={uploading}
            />
          </label>
        </div>

        {images.length === 0 ? (
          <div className="py-10 text-center border-2 border-dashed border-border rounded-xl">
            <p className="text-sm text-ink-muted font-body">No images yet. Click "Add Image" to upload.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {images.map((img, i) => (
              <div key={i} className="flex items-start gap-4 p-4 border border-border rounded-xl bg-cream">
                {/* Preview */}
                <div className="flex-shrink-0 w-32 overflow-hidden border rounded-lg border-border" style={{ aspectRatio: '600/350' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt={img.caption} className="object-cover object-top w-full h-full" />
                </div>

                {/* Caption + controls */}
                <div className="flex-1 min-w-0 space-y-2">
                  <label className="block text-xs font-semibold tracking-wide uppercase text-ink-muted font-body">
                    Caption
                  </label>
                  <input
                    type="text"
                    value={img.caption}
                    onChange={(e) => updateCaption(i, e.target.value)}
                    placeholder="Enter image caption…"
                    className="w-full px-3 py-2 text-sm transition-colors border rounded-md border-border font-body focus:outline-none focus:border-gold"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => moveUp(i)}
                      disabled={i === 0}
                      className="text-xs transition-colors text-ink-muted font-body hover:text-green disabled:opacity-30"
                      title="Move up"
                    >
                      ↑ Up
                    </button>
                    <button
                      onClick={() => moveDown(i)}
                      disabled={i === images.length - 1}
                      className="text-xs transition-colors text-ink-muted font-body hover:text-green disabled:opacity-30"
                      title="Move down"
                    >
                      ↓ Down
                    </button>
                    <button
                      onClick={() => removeImage(i)}
                      className="ml-auto text-xs text-red-500 transition-colors font-body hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-[11px] text-ink-muted font-body">Images appear in the carousel on the public page. Best size: 600 × 350px.</p>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 text-sm font-semibold text-white transition-colors rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save All Changes'}
      </button>
    </div>
  )
}