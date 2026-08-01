import { prisma } from '@/app/lib/prisma'
import AdminNav from '@/app/components/admin/AdminNav'
import Link from 'next/link'

export const revalidate = 0

const STATUS_LABELS: Record<number, string> = {
  0: 'Pending',
  1: 'Approved',
  2: 'Rejected',
}

const STATUS_STYLES: Record<number, string> = {
  0: 'bg-amber-50 text-amber-700',
  1: 'bg-green/10 text-green',
  2: 'bg-red-50 text-red-600',
}

export default async function AdminProfilesPage() {
  const profiles = await prisma.hallOfFame.findMany({
    orderBy: { id: 'desc' },
    select: {
      id: true,
      title: true,
      Profession: true,
      City: true,
      Country: true,
      status: true,
      image: true,
      feature: true,
      categoryid: true,
    },
  })

  const categories = await prisma.hallCategory.findMany({
    select: { categoryid: true, categoryname: true },
  })

  const catMap: Record<number, string> = {}
  categories.forEach((c) => { catMap[c.categoryid] = c.categoryname })

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminNav />
      <main className="flex-1 p-4 lg:ml-64 pt-14 lg:pt-8 lg:p-8">
        <div className="max-w-[1200px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="mb-1 text-2xl font-bold font-display text-green">Profiles</h1>
              <p className="text-sm text-ink-muted font-body">
                {profiles.filter((p) => p.status === 0).length} pending{' '}
                {profiles.filter((p) => p.feature === 1).length} featured
              </p>
            </div>
            {/* <Link
              href="/admin/admin/profiles/new"
              className="bg-gold text-white px-5 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors no-underline"
            >
              Add Profile
            </Link> */}
          </div>

          {/* Table */}
          <div className="overflow-hidden bg-white border border-border rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b border-border bg-cream">
                    <th className="px-4 py-3 text-xs font-bold tracking-wide text-left uppercase text-ink-muted">Profile</th>
                    <th className="hidden px-4 py-3 text-xs font-bold tracking-wide text-left uppercase text-ink-muted sm:table-cell">Category</th>
                    <th className="hidden px-4 py-3 text-xs font-bold tracking-wide text-left uppercase text-ink-muted md:table-cell">Location</th>
                    <th className="px-4 py-3 text-xs font-bold tracking-wide text-left uppercase text-ink-muted">Status</th>
                    <th className="px-4 py-3 text-xs font-bold tracking-wide text-left uppercase text-ink-muted">Featured</th>
                    <th className="px-4 py-3 text-xs font-bold tracking-wide text-left uppercase text-ink-muted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {profiles.map((p) => {
                    const img = p.image
  ? p.image.startsWith('http')
    ? p.image
    : p.image.startsWith('uploads/')
    ? `/${p.image}`           // already has uploads/ prefix
    : p.image.startsWith('/')
    ? p.image
    : `/uploads/${p.image}`   // plain filename
  : null

                    return (
                      <tr key={p.id} className="transition-colors hover:bg-cream/50">
                        {/* Profile */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {img ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={img}
                                alt={p.title ?? ''}
                                className="flex-shrink-0 object-top w-16 h-16 rounded-lg object-fit"
                              />
                            ) : (
                              <div className="flex items-center justify-center flex-shrink-0 text-sm font-bold text-white rounded-full w-9 h-9 bg-green font-display">
                                {(p.title ?? '?').charAt(0)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-ink-dark truncate max-w-[180px]">{p.title}</p>
                              {p.Profession && (
                                <p className="text-xs text-ink-muted truncate max-w-[180px]">{p.Profession}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="hidden px-4 py-3 sm:table-cell">
                          <span className="text-xs text-ink-muted">
                            {p.categoryid ? catMap[p.categoryid] ?? '' : ''}
                          </span>
                        </td>

                        {/* Location */}
                        <td className="hidden px-4 py-3 md:table-cell">
                          <span className="text-xs text-ink-muted">
                            {[p.City, p.Country].filter(Boolean).join(', ') || '-'}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded font-body ${STATUS_STYLES[p.status ?? 0]}`}>
                            {STATUS_LABELS[p.status ?? 0]}
                          </span>
                        </td>

                        {/* Featured */}
                        <td className="px-4 py-3">
                          {p.feature === 1 ? (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-gold-pale text-gold font-body">
                              Featured
                            </span>
                          ) : (
                            <span className="text-[11px] text-ink-muted font-body">Not Featured</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/profiles/${p.id}/edit`}
                            className="text-xs font-semibold no-underline text-gold font-body hover:underline"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}