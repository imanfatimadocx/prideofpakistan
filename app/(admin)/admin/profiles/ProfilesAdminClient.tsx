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
}

const STATUS_STYLES: Record<number, string> = {
  0: 'bg-amber-50 text-amber-700 border border-amber-200',
  1: 'bg-green/10 text-green border border-green/20',
  2: 'bg-red-50 text-red-700 border border-red-200',
}

const STATUS_LABELS: Record<number, string> = { 0: 'Pending', 1: 'Approved', 2: 'Rejected' }

export default function ProfilesAdminClient({ profiles: initial }: { profiles: Profile[] }) {
  const [profiles, setProfiles] = useState(initial)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [loading, setLoading] = useState<number | null>(null)
  const [filter, setFilter] = useState<0 | 1 | 2 | 'all'>('all')

  async function updateStatus(id: number, status: number) {
    setLoading(id)
    try {
      await fetch('/api/admin/profiles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      setProfiles((prev) => prev.map((p) => p.id === id ? { ...p, status } : p))
    } finally {
      setLoading(null)
    }
  }

  const filtered = filter === 'all' ? profiles : profiles.filter((p) => p.status === filter)
  const pendingCount = profiles.filter((p) => p.status === 0).length

  return (
    <div>
      <div className="flex gap-2 pb-4 mb-6 border-b border-border">
        {([0, 1, 2, 'all'] as const).map((f) => (
          <button key={String(f)} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-medium font-body border transition-colors ${filter === f ? 'bg-green text-white border-green' : 'border-border text-ink-mid hover:border-green'}`}>
            {f === 'all' ? 'All' : STATUS_LABELS[f as number]}
            {f === 0 && pendingCount > 0 && <span className="ml-1.5 bg-gold text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingCount}</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-sm text-center text-ink-muted font-body">No profiles found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <div key={p.id} className="overflow-hidden bg-white border border-border rounded-xl">
              <div className="flex items-center justify-between px-5 py-4 transition-colors cursor-pointer hover:bg-cream" onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
                <div className="flex items-center min-w-0 gap-3">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.title} className="flex-shrink-0 object-cover object-top rounded-full w-9 h-9" />
                  ) : (
                    <div className="flex items-center justify-center flex-shrink-0 text-sm font-bold text-white rounded-full w-9 h-9 bg-green font-display">{p.title.charAt(0)}</div>
                  )}
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded font-body flex-shrink-0 ${STATUS_STYLES[p.status]}`}>{STATUS_LABELS[p.status]}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate text-ink-dark font-body">{p.title}</p>
                    <p className="text-xs text-ink-muted font-body">{p.Profession} {p.City && `· ${p.City}`}</p>
                  </div>
                </div>
                <div className="flex items-center flex-shrink-0 gap-2">
                  {p.status === 0 && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); updateStatus(p.id, 1) }} disabled={loading === p.id} className="bg-green text-white text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-green-mid transition-colors disabled:opacity-50 font-body">Approve</button>
                      <button onClick={(e) => { e.stopPropagation(); updateStatus(p.id, 2) }} disabled={loading === p.id} className="bg-red-50 text-red-700 border border-red-200 text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 font-body">Reject</button>
                    </>
                  )}
                  {p.status === 1 && <button onClick={(e) => { e.stopPropagation(); updateStatus(p.id, 2) }} disabled={loading === p.id} className="text-xs transition-colors text-ink-muted font-body hover:text-red-600">Revoke</button>}
                  {p.status === 2 && <button onClick={(e) => { e.stopPropagation(); updateStatus(p.id, 1) }} disabled={loading === p.id} className="text-xs text-green font-body hover:underline">Re-approve</button>}
                  <span className="text-sm text-ink-muted">{expanded === p.id ? '▲' : '▼'}</span>
                </div>
              </div>
              {expanded === p.id && (
                <div className="px-5 pt-4 pb-5 space-y-3 border-t border-border">
                  <div className="grid grid-cols-2 gap-3 text-sm font-body">
                    {p.Email && <div><p className="text-xs text-ink-muted uppercase tracking-wide mb-0.5">Email</p><p className="text-ink-dark">{p.Email}</p></div>}
                    {p.Country && <div><p className="text-xs text-ink-muted uppercase tracking-wide mb-0.5">Country</p><p className="text-ink-dark">{p.Country}</p></div>}
                  </div>
                  {p.shortdesc && <p className="text-sm leading-relaxed text-ink-mid font-body">{p.shortdesc.replace(/<[^>]*>/g, '')}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}