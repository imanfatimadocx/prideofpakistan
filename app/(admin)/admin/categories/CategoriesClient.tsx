'use client'
import { useState } from 'react'

interface Category {
  categoryid: number
  categoryname: string
  status: number
}

export default function CategoriesClient({ categories: initial }: { categories: Category[] }) {
  const [categories, setCategories] = useState(initial)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleAdd() {
    if (!newName.trim()) { setError('Category name is required.'); return }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryname: newName.trim() }),
      })
      if (!res.ok) throw new Error()
      const json = await res.json()
      setCategories((prev) => [...prev, { categoryid: json.categoryid, categoryname: newName.trim(), status: 1 }].sort((a, b) => a.categoryname.localeCompare(b.categoryname)))
      setNewName('')
    } catch {
      setError('Failed to add category.')
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdate(id: number) {
    if (!editName.trim()) return
    setSaving(true)
    try {
      await fetch(`/api/admin/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryname: editName.trim() }),
      })
      setCategories((prev) => prev.map((c) => c.categoryid === id ? { ...c, categoryname: editName.trim() } : c))
      setEditingId(null)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this category? Profiles in this category will become uncategorised.')) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
      setCategories((prev) => prev.filter((c) => c.categoryid !== id))
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-5">

      {/* Add new */}
      <div className="bg-white border border-border rounded-xl p-5">
        <h2 className="font-display text-base font-bold text-green mb-4">Add New Category</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Category name…"
            className="flex-1 border border-border rounded-md px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
          />
          <button
            onClick={handleAdd}
            disabled={saving}
            className="bg-gold text-white px-5 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors disabled:opacity-50"
          >
            {saving ? '...' : 'Add'}
          </button>
        </div>
        {error && <p className="text-xs text-red-500 font-body mt-2">{error}</p>}
      </div>

      {/* List */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-cream">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-muted font-body">
            {categories.length} categories
          </p>
        </div>
        <div className="divide-y divide-border">
          {categories.map((c) => (
            <div key={c.categoryid} className="flex items-center gap-3 px-5 py-3">
              {editingId === c.categoryid ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdate(c.categoryid)}
                    autoFocus
                    className="flex-1 border border-gold rounded-md px-3 py-1.5 text-sm font-body focus:outline-none"
                  />
                  <button onClick={() => handleUpdate(c.categoryid)} disabled={saving} className="text-xs font-semibold text-green font-body hover:underline disabled:opacity-50">Save</button>
                  <button onClick={() => setEditingId(null)} className="text-xs text-ink-muted font-body hover:underline">Cancel</button>
                </>
              ) : (
                <>
                  <p className="flex-1 text-sm font-body text-ink-dark">{c.categoryname}</p>
                  <button
                    onClick={() => { setEditingId(c.categoryid); setEditName(c.categoryname) }}
                    className="text-xs font-semibold text-gold font-body hover:underline"
                  >Edit</button>
                  <button
                    onClick={() => handleDelete(c.categoryid)}
                    disabled={deleting === c.categoryid}
                    className="text-xs text-red-500 font-body hover:underline disabled:opacity-50"
                  >
                    {deleting === c.categoryid ? '...' : 'Delete'}
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}