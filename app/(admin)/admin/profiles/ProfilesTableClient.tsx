'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'

interface Profile {
  id: number
  title: string
  Profession: string
  status: number
  image: string | null
  feature: number
  categoryid: number | null
  categoryname: string | null
}

interface Category {
  categoryid: number
  categoryname: string
}

const STATUS_LABELS: Record<number, string> = { 0: 'Pending', 1: 'Approved', 2: 'Rejected' }
const STATUS_STYLES: Record<number, string> = {
  0: 'bg-amber-50 text-amber-700',
  1: 'bg-green/10 text-green',
  2: 'bg-red-50 text-red-600',
}

const PAGE_SIZE = 15

export default function ProfilesTableClient({
  profiles: initial,
  categories,
}: {
  profiles: Profile[]
  categories: Category[]
}) {
  const [profiles, setProfiles] = useState(initial)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterFeatured, setFilterFeatured] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleting, setDeleting] = useState<number | null>(null)

  const filtered = useMemo(() => {
    return profiles
      .filter((p) => {
        const matchStatus   = filterStatus   === 'all' || p.status === Number(filterStatus)
        const matchFeatured = filterFeatured === 'all' || p.feature === Number(filterFeatured)
        const matchCategory = filterCategory === 'all' || p.categoryid === Number(filterCategory)
        const matchSearch   = !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.Profession.toLowerCase().includes(search.toLowerCase())
        return matchStatus && matchFeatured && matchCategory && matchSearch
      })
      .sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))
  }, [profiles, filterStatus, filterFeatured, filterCategory, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function resetPage() { setPage(1) }

  async function handleDelete(id: number) {
    if (!confirm('Delete this profile permanently?')) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/profiles/${id}`, { method: 'DELETE' })
      setProfiles((prev) => prev.filter((p) => p.id !== id))
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-4">

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-white border border-border rounded-xl">
        <input
          type="text"
          placeholder="Search name or profession…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); resetPage() }}
          className="border border-border rounded-md px-3 py-2 text-sm font-body focus:outline-none focus:border-gold flex-1 min-w-[180px]"
        />
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); resetPage() }}
          className="px-3 py-2 text-sm border rounded-md border-border font-body focus:outline-none focus:border-gold"
        >
          <option value="all">All Statuses</option>
          <option value="0">Pending</option>
          <option value="1">Approved</option>
          <option value="2">Rejected</option>
        </select>
        <select
          value={filterFeatured}
          onChange={(e) => { setFilterFeatured(e.target.value); resetPage() }}
          className="px-3 py-2 text-sm border rounded-md border-border font-body focus:outline-none focus:border-gold"
        >
          <option value="all">All Profiles</option>
          <option value="1">Featured Only</option>
          <option value="0">Not Featured</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => { setFilterCategory(e.target.value); resetPage() }}
          className="px-3 py-2 text-sm border rounded-md border-border font-body focus:outline-none focus:border-gold"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.categoryid} value={c.categoryid}>{c.categoryname}</option>
          ))}
        </select>
        {(filterStatus !== 'all' || filterFeatured !== 'all' || filterCategory !== 'all' || search) && (
          <button
            onClick={() => { setFilterStatus('all'); setFilterFeatured('all'); setFilterCategory('all'); setSearch(''); resetPage() }}
            className="text-xs font-semibold text-gold font-body hover:underline"
          >
            Clear filters
          </button>
        )}
        <span className="ml-auto text-xs text-ink-muted font-body">
          {filtered.length} profile{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white border border-border rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border bg-cream">
                <th className="px-4 py-3 text-xs font-bold tracking-wide text-left uppercase text-ink-muted">Profile</th>
                <th className="hidden px-4 py-3 text-xs font-bold tracking-wide text-left uppercase text-ink-muted sm:table-cell">Category</th>
                <th className="px-4 py-3 text-xs font-bold tracking-wide text-left uppercase text-ink-muted">Status</th>
                <th className="px-4 py-3 text-xs font-bold tracking-wide text-left uppercase text-ink-muted">Featured</th>
                <th className="px-4 py-3 text-xs font-bold tracking-wide text-left uppercase text-ink-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-sm text-center text-ink-muted font-body">
                    No profiles found.
                  </td>
                </tr>
              ) : paginated.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-cream/50">

                  {/* Profile */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image} alt={p.title} className="flex-shrink-0 object-top w-16 h-16 rounded-lg object-fit" />
                      ) : (
                        <div className="flex items-center justify-center flex-shrink-0 text-sm font-bold text-white rounded-full w-9 h-9 bg-green font-display">
                          {p.title.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-ink-dark truncate max-w-[200px]">{p.title}</p>
                        {p.Profession && <p className="text-xs text-ink-muted truncate max-w-[200px]">{p.Profession}</p>}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="text-xs text-ink-muted">{p.categoryname ?? '-'}</span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded font-body ${STATUS_STYLES[p.status]}`}>
                      {STATUS_LABELS[p.status]}
                    </span>
                  </td>

                  {/* Featured */}
                  <td className="px-4 py-3">
                    {p.feature === 1 ? (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-gold-pale text-gold font-body">Featured</span>
                    ) : (
                      <span className="text-[11px] text-ink-muted font-body">-</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/who-is-who/${p.id}`}
                        target="_blank"
                        className="text-xs no-underline transition-colors text-ink-muted font-body hover:text-green"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/profiles/${p.id}/edit`}
                        className="text-xs font-semibold no-underline text-gold font-body hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deleting === p.id}
                        className="text-xs text-red-500 font-body hover:underline disabled:opacity-50"
                      >
                        {deleting === p.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-ink-muted font-body">
            Page {page} of {totalPages} · showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-semibold transition-colors border rounded-lg border-border font-body text-ink-mid hover:border-green hover:text-green disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1
              const ellipsisBefore = p === page - 2 && page - 2 > 1
              const ellipsisAfter  = p === page + 2 && page + 2 < totalPages
              if (ellipsisBefore || ellipsisAfter) return <span key={p} className="text-sm text-ink-muted">…</span>
              if (!show) return null
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold font-body border transition-colors ${
                    page === p ? 'bg-green text-white border-green' : 'border-border text-ink-mid hover:border-green hover:text-green'
                  }`}
                >
                  {p}
                </button>
              )
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-semibold transition-colors border rounded-lg border-border font-body text-ink-mid hover:border-green hover:text-green disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}