'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TipTapLink from '@tiptap/extension-link'
import NextLink from 'next/link'

interface Profile {
  id: number
  title: string
  Profession: string
  City: string
  Country: string
  Email: string
  shortdesc: string
  description: string
  image: string | null
  status: number
  featured: number
  categoryid: number | null
  facebook: string
  twitter: string
  linkedin: string
  meta_title: string
  meta_keywords: string
  meta_description: string
}

interface Category {
  categoryid: number
  categoryname: string
}

function resolveImage(image: string | null): string | null {
  if (!image) return null
  if (image.startsWith('http')) return image
  if (image.startsWith('/')) return image
  if (image.startsWith('uploads/')) return `/${image}`
  return `/uploads/${image}`
}

export default function ProfileEditClient({
  profile: initial,
  categories,
  isNew = false,
}: {
  profile: Profile
  categories: Category[]
  isNew?: boolean
}) {
  const router = useRouter()
  const [form, setForm] = useState(initial)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(resolveImage(initial.image))
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [imgUploading, setImgUploading] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      TipTapLink.configure({ openOnClick: false }),
    ],
    content: initial.description,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-neutral max-w-none min-h-[300px] focus:outline-none font-body text-ink-dark leading-relaxed p-4 text-sm',
      },
    },
  })

  function toolbar(action: () => void) {
    return (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      action()
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function insertImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !editor) return

    setImgUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) return
      const json = await res.json()
      const url = json.url ?? json.path
      if (url) {
        editor.chain().focus().insertContent(
          `<img src="${url}" alt="Image" style="max-width:100%;height:auto;margin:8px 0;border-radius:6px;" />`
        ).run()
      }
    } catch (err) {
      console.error('Image upload failed:', err)
    } finally {
      setImgUploading(false)
      e.target.value = ''
    }
  }

  function autoFillMeta() {
    setForm((f) => ({
      ...f,
      meta_title: f.meta_title || `${f.title} | Pride of Pakistan`,
      meta_keywords: f.meta_keywords || [f.title, f.Profession, f.City, f.Country, 'Pride of Pakistan', 'Pakistan'].filter(Boolean).join(', '),
      meta_description: f.meta_description || f.shortdesc.replace(/<[^>]*>/g, '').slice(0, 255),
    }))
  }

async function handleSave() {
  if (!form.title.trim()) { setError('Name is required.'); return }
  setSaving(true)
  setError(null)

  try {
    let imagePath = form.image

    if (imageFile) {
      const formData = new FormData()
      formData.append('file', imageFile)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      if (uploadRes.ok) {
        const json = await uploadRes.json()
        imagePath = json.url ?? json.path ?? imagePath
      }
    }

    const description = editor?.getHTML() ?? form.description

    if (isNew) {
      const res = await fetch('/api/admin/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, image: imagePath, description }),
      })
      if (!res.ok) { setError('Failed to create profile.'); return }
      const json = await res.json()
      router.push(`/admin/profiles/${json.id}/edit`)
      return
    }

    const res = await fetch(`/api/admin/profiles/${form.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, image: imagePath, description }),
    })

    if (!res.ok) { setError('Failed to save.'); return }

    setForm((f) => ({ ...f, image: imagePath }))
    setImageFile(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  } catch {
    setError('Something went wrong.')
  } finally {
    setSaving(false)
  }
}

  async function handleDelete() {
    if (!confirm('Delete this profile permanently? This cannot be undone.')) return
    setDeleting(true)
    try {
      await fetch(`/api/admin/profiles/${form.id}`, { method: 'DELETE' })
      router.push('/admin/profiles')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-[900px]">
     {/* Header */}
<div className="flex flex-wrap items-center justify-between gap-3 m-6">
  <div className="flex items-center gap-3">
    <NextLink href="/admin/profiles" className="text-sm no-underline text-gold font-body hover:underline">
      ← Profiles
    </NextLink>
    <span className="text-ink-muted">/</span>
    <h1 className="text-xl font-bold font-display text-green">
      {isNew ? 'Add New Profile' : (form.title || 'Edit Profile')}
    </h1>
  </div>
  <div className="flex gap-3">
    <button
      onClick={handleSave}
      disabled={saving}
      className="bg-gold text-white px-6 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors disabled:opacity-50"
    >
      {saving ? 'Saving...' : isNew ? 'Create Profile' : 'Save Changes'}
    </button>
    {!isNew && (
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="bg-red-50 text-red-700 border border-red-200 px-5 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-red-100 transition-colors disabled:opacity-50"
      >
        {deleting ? '...' : 'Delete'}
      </button>
    )}
  </div>
</div>

      {saved && (
        <div className="px-4 py-3 mb-5 text-sm font-semibold border rounded-lg bg-green/10 border-green/20 text-green font-body">
          Saved successfully.
        </div>
      )}
      {error && (
        <div className="px-4 py-3 mb-5 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50 font-body">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">

        {/* Left column */}
        <div className="space-y-5">

          {/* Basic info */}
          <div className="p-6 space-y-4 bg-white border border-border rounded-xl">
            <h2 className="text-base font-bold font-display text-green">Basic Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { label: 'Full Name *', key: 'title' },
                { label: 'Profession', key: 'Profession' },
                { label: 'Email', key: 'Email' },
                { label: 'City', key: 'City' },
                { label: 'Country', key: 'Country' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">{label}</label>
                  <input
                    type="text"
                    value={(form as unknown as Record<string, string>)[key] ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">Category</label>
                <select
                  value={form.categoryid ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, categoryid: e.target.value ? Number(e.target.value) : null }))}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold"
                >
                  <option value="">— Select category —</option>
                  {categories.map((c) => (
                    <option key={c.categoryid} value={c.categoryid}>{c.categoryname}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Short description */}
          <div className="p-6 space-y-3 bg-white border border-border rounded-xl">
            <h2 className="text-base font-bold font-display text-green">Short Description</h2>
            <p className="text-xs text-ink-muted font-body">Shown on profile cards and as the introduction on the profile page.</p>
            <textarea
              value={form.shortdesc.replace(/<[^>]*>/g, '')}
              onChange={(e) => setForm((f) => ({ ...f, shortdesc: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold transition-colors resize-none"
              placeholder="Brief introduction shown on profile cards…"
            />
          </div>

          {/* Full description — TipTap */}
          <div className="p-6 space-y-3 bg-white border border-border rounded-xl">
            <h2 className="text-base font-bold font-display text-green">Full Description</h2>
            <p className="text-xs text-ink-muted font-body">
              Full profile content. Use the toolbar to format text and insert images inline.
            </p>
            <div className="overflow-hidden border border-border rounded-xl">

              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-border bg-cream">
                {/* Headings */}
                <button
                  onClick={toolbar(() => editor?.chain().focus().toggleHeading({ level: 2 }).run())}
                  className={`px-2.5 py-1 rounded text-xs font-bold font-body transition-colors ${editor?.isActive('heading', { level: 2 }) ? 'bg-green text-white' : 'text-ink-mid hover:bg-border'}`}
                >H2</button>
                <button
                  onClick={toolbar(() => editor?.chain().focus().toggleHeading({ level: 3 }).run())}
                  className={`px-2.5 py-1 rounded text-xs font-bold font-body transition-colors ${editor?.isActive('heading', { level: 3 }) ? 'bg-green text-white' : 'text-ink-mid hover:bg-border'}`}
                >H3</button>

                <div className="w-px h-4 mx-1 bg-border" />

                {/* Format */}
                <button
                  onClick={toolbar(() => editor?.chain().focus().toggleBold().run())}
                  className={`px-2.5 py-1 rounded text-xs font-bold font-body transition-colors ${editor?.isActive('bold') ? 'bg-green text-white' : 'text-ink-mid hover:bg-border'}`}
                >B</button>
                <button
                  onClick={toolbar(() => editor?.chain().focus().toggleItalic().run())}
                  className={`px-2.5 py-1 rounded text-xs italic font-body transition-colors ${editor?.isActive('italic') ? 'bg-green text-white' : 'text-ink-mid hover:bg-border'}`}
                >I</button>
                <button
                  onClick={toolbar(() => editor?.chain().focus().toggleStrike().run())}
                  className={`px-2.5 py-1 rounded text-xs line-through font-body transition-colors ${editor?.isActive('strike') ? 'bg-green text-white' : 'text-ink-mid hover:bg-border'}`}
                >S</button>

                <div className="w-px h-4 mx-1 bg-border" />

                {/* Lists */}
                <button
                  onClick={toolbar(() => editor?.chain().focus().toggleBulletList().run())}
                  className={`px-2.5 py-1 rounded text-xs font-body transition-colors ${editor?.isActive('bulletList') ? 'bg-green text-white' : 'text-ink-mid hover:bg-border'}`}
                >• List</button>
                <button
                  onClick={toolbar(() => editor?.chain().focus().toggleOrderedList().run())}
                  className={`px-2.5 py-1 rounded text-xs font-body transition-colors ${editor?.isActive('orderedList') ? 'bg-green text-white' : 'text-ink-mid hover:bg-border'}`}
                >1. List</button>
                <button
                  onClick={toolbar(() => editor?.chain().focus().toggleBlockquote().run())}
                  className={`px-2.5 py-1 rounded text-xs font-body transition-colors ${editor?.isActive('blockquote') ? 'bg-green text-white' : 'text-ink-mid hover:bg-border'}`}
                >Quote</button>

                <div className="w-px h-4 mx-1 bg-border" />

                {/* Image insert */}
                <label className={`px-2.5 py-1 rounded text-xs font-body transition-colors cursor-pointer select-none ${imgUploading ? 'text-ink-muted' : 'text-ink-mid hover:bg-border'}`}>
                  {imgUploading ? 'Uploading…' : '📷 Image'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={insertImage}
                    disabled={imgUploading}
                  />
                </label>

                <div className="w-px h-4 mx-1 bg-border" />

                {/* Undo / Redo */}
                <button onClick={toolbar(() => editor?.chain().focus().undo().run())} className="px-2.5 py-1 rounded text-xs text-ink-muted font-body hover:bg-border transition-colors">↩</button>
                <button onClick={toolbar(() => editor?.chain().focus().redo().run())} className="px-2.5 py-1 rounded text-xs text-ink-muted font-body hover:bg-border transition-colors">↪</button>
              </div>

              {/* Editor area */}
              <EditorContent editor={editor} />
            </div>

            <p className="text-[11px] text-ink-muted font-body">
              Click "Image" in the toolbar to insert a photo inline. Images will appear where your cursor is positioned and text will wrap below them.
            </p>
          </div>

          {/* Social links */}
          <div className="p-6 space-y-4 bg-white border border-border rounded-xl">
            <h2 className="text-base font-bold font-display text-green">Social Links</h2>
            {[
              { label: 'Facebook URL', key: 'facebook', placeholder: 'https://facebook.com/...' },
              { label: 'Twitter / X URL', key: 'twitter', placeholder: 'https://twitter.com/...' },
              { label: 'LinkedIn URL', key: 'linkedin', placeholder: 'https://linkedin.com/in/...' },
              { label: 'Threads URL', key: 'threads', placeholder: 'https://www.threads.net/@username' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">{label}</label>
                <input
                  type="text"
                  value={(form as unknown as Record<string, string>)[key] ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            ))}
          </div>

          {/* SEO */}
          <div className="p-6 space-y-4 bg-white border border-border rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold font-display text-green">SEO / Meta</h2>
                <p className="text-xs text-ink-muted font-body mt-0.5">Helps Google show this profile in search results.</p>
              </div>
              <button onClick={autoFillMeta} className="text-xs font-semibold text-gold font-body hover:underline">
                Auto-fill
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">Meta Title</label>
              <input
                type="text"
                value={form.meta_title}
                onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))}
                placeholder={`${form.title} | Pride of Pakistan`}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold transition-colors"
              />
              <p className="text-[11px] text-ink-muted font-body mt-1">{form.meta_title.length}/60 characters</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">Meta Keywords</label>
              <input
                type="text"
                value={form.meta_keywords}
                onChange={(e) => setForm((f) => ({ ...f, meta_keywords: e.target.value }))}
                placeholder={`${form.title}, ${form.Profession}, Pakistan`}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold transition-colors"
              />
              <p className="text-[11px] text-ink-muted font-body mt-1">Comma-separated keywords</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">Meta Description</label>
              <textarea
                value={form.meta_description}
                onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
                rows={3}
                placeholder="Brief description for Google search results…"
                className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold transition-colors resize-none"
              />
              <p className="text-[11px] text-ink-muted font-body mt-1">{form.meta_description.length}/160 characters</p>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">

          {/* Photo */}
          <div className="p-5 space-y-3 bg-white border border-border rounded-xl">
            <h2 className="text-base font-bold font-display text-green">Photo</h2>
            <div
              className="w-full overflow-hidden border rounded-lg border-border bg-cream"
              style={{ aspectRatio: '600/350' }}
            >
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="Preview" className="object-top w-full h-full object-fit" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-sm text-ink-muted font-body">
                  No photo
                </div>
              )}
            </div>
            <label className="w-full cursor-pointer bg-cream border border-border rounded-md px-4 py-2.5 text-xs font-semibold text-ink-dark font-body hover:border-gold transition-colors text-center block">
              {imagePreview ? 'Change Photo' : 'Upload Photo'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
            <p className="text-[11px] text-ink-muted font-body text-center">Best size: 600 × 350px</p>
          </div>

          {/* Status */}
          <div className="p-5 space-y-3 bg-white border border-border rounded-xl">
            <h2 className="text-base font-bold font-display text-green">Status</h2>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: Number(e.target.value) }))}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold"
            >
              <option value={0}>Pending</option>
              <option value={1}>Approved</option>
              <option value={2}>Rejected</option>
            </select>
          </div>

          {/* Featured toggle */}
          <div className="p-5 bg-white border border-border rounded-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold font-display text-green">Featured</h2>
                <p className="mt-1 text-xs text-ink-muted font-body">
                  Featured profiles rotate daily in the Who Is Who section on the homepage.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, featured: f.featured === 1 ? 0 : 1 }))}
                className={`flex-shrink-0 w-11 h-6 rounded-full transition-colors flex items-center ${
                  form.featured === 1 ? 'bg-gold' : 'bg-border'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${
                  form.featured === 1 ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
            {form.featured === 1 && (
              <p className="mt-3 text-xs font-semibold text-gold font-body">
                This profile will appear in the daily rotation on the homepage.
              </p>
            )}
          </div>

          {/* Save / Delete */}
         {/* Save / Delete */}
<div className="space-y-2">
  <button
    onClick={handleSave}
    disabled={saving}
    className="w-full py-3 text-sm font-semibold text-white transition-colors rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark disabled:opacity-50"
  >
    {saving ? 'Saving...' : isNew ? 'Create Profile' : 'Save Changes'}
  </button>
  {!isNew && (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="w-full py-3 text-sm font-semibold text-red-700 transition-colors border border-red-200 rounded-md bg-red-50 font-body hover:bg-red-100 disabled:opacity-50"
    >
      {deleting ? 'Deleting...' : 'Delete Profile'}
    </button>
  )}
</div>
        </div>
      </div>
    </div>
  )
}