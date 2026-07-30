'use client'
import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'

interface Post {
  id: number
  title: string
  shortdesc: string
  status: string
  authorName: string
  createdAt: string
  image: string | null
}

const STATUS_STYLES: Record<string, string> = {
  pending:  'bg-amber-50 text-amber-700 border border-amber-200',
  approved: 'bg-green/10 text-green border border-green/20',
  rejected: 'bg-red-50 text-red-700 border border-red-200',
}

export default function BlogAdminClient({ posts: initial }: { posts: Post[] }) {
  const [posts, setPosts] = useState(initial)
  const [mode, setMode] = useState<'list' | 'new' | 'edit'>('list')
  const [editing, setEditing] = useState<Post | null>(null)
  const [title, setTitle] = useState('')
  const [shortdesc, setShortdesc] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-neutral max-w-none min-h-[300px] focus:outline-none font-body text-ink-dark leading-relaxed p-4',
      },
    },
  })

  function openNew() {
    setMode('new')
    setEditing(null)
    setTitle('')
    setShortdesc('')
    setImageFile(null)
    setImagePreview(null)
    setError(null)
    editor?.commands.setContent('')
  }

  function openEdit(post: Post) {
    setMode('edit')
    setEditing(post)
    setTitle(post.title)
    setShortdesc(post.shortdesc)
    setImageFile(null)
    setImagePreview(post.image)
    setError(null)
    editor?.commands.setContent('')
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function toolbar(action: () => void) {
    return (e: React.MouseEvent) => { e.preventDefault(); action(); editor?.commands.focus() }
  }

  async function handleSave(status: string) {
    if (!title.trim()) { setError('Title is required.'); return }
    if (!shortdesc.trim()) { setError('Summary is required.'); return }
    const content = editor?.getHTML() ?? ''
    if (!content || content === '<p></p>') { setError('Content is required.'); return }

    setSaving(true)
    setError(null)

    try {
      let imagePath = editing?.image ?? null

      if (imageFile) {
        const formData = new FormData()
        formData.append('file', imageFile)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        if (uploadRes.ok) {
          const json = await uploadRes.json()
          imagePath = json.path ?? imagePath
        }
      }

      if (mode === 'edit' && editing) {
        const res = await fetch(`/api/admin/stories/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, shortdesc, content, status, image: imagePath }),
        })
        if (!res.ok) throw new Error()
        setPosts((prev) => prev.map((p) =>
          p.id === editing.id ? { ...p, title, shortdesc, status, image: imagePath } : p
        ))
      } else {
        const res = await fetch('/api/admin/stories/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, shortdesc, content, status, image: imagePath }),
        })
        if (!res.ok) throw new Error()
        const json = await res.json()
        setPosts((prev) => [{
          id: json.id,
          title,
          shortdesc,
          status,
          authorName: 'Admin',
          createdAt: new Date().toISOString(),
          image: imagePath,
        }, ...prev])
      }

      setMode('list')
    } catch {
      setError('Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this post permanently?')) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/stories/${id}`, { method: 'DELETE' })
      setPosts((prev) => prev.filter((p) => p.id !== id))
      if (mode === 'edit' && editing?.id === id) setMode('list')
    } finally {
      setDeleting(null)
    }
  }

  // ── Editor view ──────────────────────────────────────────
  if (mode === 'new' || mode === 'edit') {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setMode('list')} className="text-sm text-gold font-body hover:underline">
            ← Back to list
          </button>
          <h2 className="text-xl font-bold font-display text-green">
            {mode === 'new' ? 'New Post' : 'Edit Post'}
          </h2>
        </div>

        {/* Cover image */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-ink-dark font-body">Cover Image</label>
          <div className="flex items-center gap-4">
            {imagePreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreview} alt="Cover" className="object-cover w-32 h-20 border rounded-lg border-border" />
            )}
            <label className="cursor-pointer bg-cream border border-border rounded-md px-4 py-2.5 text-sm font-semibold text-ink-dark font-body hover:border-gold transition-colors">
              {imagePreview ? 'Change Image' : 'Upload Cover Image'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold"
            placeholder="Post title"
          />
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">Short Summary *</label>
          <textarea
            value={shortdesc}
            onChange={(e) => setShortdesc(e.target.value)}
            rows={2}
            className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold resize-none"
            placeholder="2-3 sentence summary shown in the list"
          />
        </div>

        {/* Rich text editor */}
        <div>
          <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">Content *</label>
          <div className="overflow-hidden bg-white border border-border rounded-xl">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-0.5 px-3 py-2 border-b border-border bg-cream">
              <button onMouseDown={toolbar(() => editor?.chain().toggleHeading({ level: 2 }).run())} className={`px-2.5 py-1 rounded text-xs font-bold font-body transition-colors ${editor?.isActive('heading', { level: 2 }) ? 'bg-green text-white' : 'text-ink-mid hover:bg-border'}`}>H2</button>
              <button onMouseDown={toolbar(() => editor?.chain().toggleHeading({ level: 3 }).run())} className={`px-2.5 py-1 rounded text-xs font-bold font-body transition-colors ${editor?.isActive('heading', { level: 3 }) ? 'bg-green text-white' : 'text-ink-mid hover:bg-border'}`}>H3</button>
              <div className="self-center w-px h-4 mx-1 bg-border" />
              <button onMouseDown={toolbar(() => editor?.chain().toggleBold().run())} className={`px-2.5 py-1 rounded text-xs font-bold font-body transition-colors ${editor?.isActive('bold') ? 'bg-green text-white' : 'text-ink-mid hover:bg-border'}`}>B</button>
              <button onMouseDown={toolbar(() => editor?.chain().toggleItalic().run())} className={`px-2.5 py-1 rounded text-xs italic font-body transition-colors ${editor?.isActive('italic') ? 'bg-green text-white' : 'text-ink-mid hover:bg-border'}`}>I</button>
              <button onMouseDown={toolbar(() => editor?.chain().toggleStrike().run())} className={`px-2.5 py-1 rounded text-xs line-through font-body transition-colors ${editor?.isActive('strike') ? 'bg-green text-white' : 'text-ink-mid hover:bg-border'}`}>S</button>
              <div className="self-center w-px h-4 mx-1 bg-border" />
              <button onMouseDown={toolbar(() => editor?.chain().toggleBulletList().run())} className={`px-2.5 py-1 rounded text-xs font-body transition-colors ${editor?.isActive('bulletList') ? 'bg-green text-white' : 'text-ink-mid hover:bg-border'}`}>• List</button>
              <button onMouseDown={toolbar(() => editor?.chain().toggleOrderedList().run())} className={`px-2.5 py-1 rounded text-xs font-body transition-colors ${editor?.isActive('orderedList') ? 'bg-green text-white' : 'text-ink-mid hover:bg-border'}`}>1. List</button>
              <button onMouseDown={toolbar(() => editor?.chain().toggleBlockquote().run())} className={`px-2.5 py-1 rounded text-xs font-body transition-colors ${editor?.isActive('blockquote') ? 'bg-green text-white' : 'text-ink-mid hover:bg-border'}`}>Quote</button>
              <div className="self-center w-px h-4 mx-1 bg-border" />
              <button onMouseDown={toolbar(() => editor?.chain().undo().run())} className="px-2.5 py-1 rounded text-xs text-ink-muted font-body hover:bg-border">↩</button>
              <button onMouseDown={toolbar(() => editor?.chain().redo().run())} className="px-2.5 py-1 rounded text-xs text-ink-muted font-body hover:bg-border">↪</button>
            </div>
            <EditorContent editor={editor} />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 font-body">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button onClick={() => handleSave('approved')} disabled={saving} className="bg-gold text-white px-6 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : mode === 'edit' ? 'Save & Publish' : 'Publish'}
          </button>
          <button onClick={() => handleSave('pending')} disabled={saving} className="border border-border text-ink-mid px-6 py-2.5 rounded-md text-sm font-semibold font-body hover:border-green hover:text-green transition-colors disabled:opacity-50">
            Save as Draft
          </button>
          {mode === 'edit' && editing && (
            <button onClick={() => handleDelete(editing.id)} disabled={deleting === editing?.id} className="bg-red-50 text-red-700 border border-red-200 px-5 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-red-100 transition-colors disabled:opacity-50">
              Delete
            </button>
          )}
        </div>
      </div>
    )
  }

  // ── List view ──────────────────────────────────────────
  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={openNew}
          className="bg-gold text-white px-5 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors"
        >
          Write New Post
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="py-16 text-center bg-white border border-border rounded-xl">
          <p className="mb-4 text-sm text-ink-muted font-body">No posts yet.</p>
          <button onClick={openNew} className="text-sm font-semibold text-gold font-body hover:underline">
            Write your first post
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center gap-4 p-4 bg-white border border-border rounded-xl">
              {post.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`/uploads/${post.image}`} alt={post.title} className="flex-shrink-0 object-cover w-16 h-10 rounded-lg" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-ink-dark font-body">{post.title}</p>
                <p className="text-xs text-ink-muted font-body">
                  by {post.authorName} · {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded border font-body flex-shrink-0 ${STATUS_STYLES[post.status]}`}>
                {post.status}
              </span>
              <div className="flex flex-shrink-0 gap-3">
                <button onClick={() => openEdit(post)} className="text-xs font-semibold text-gold font-body hover:underline">Edit</button>
                <button onClick={() => handleDelete(post.id)} disabled={deleting === post.id} className="text-xs text-red-500 font-body hover:underline disabled:opacity-50">
                  {deleting === post.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}