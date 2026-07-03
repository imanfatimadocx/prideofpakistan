import { prisma } from '@/app/lib/prisma'
import AdminNav from '@/app/components/admin/AdminNav'

export const revalidate = 0

interface StatCard {
  label: string
  count: number
  pending: number
  icon: string
  href: string
}

async function getStats(): Promise<StatCard[]> {
  const [
    profilesTotal, profilesPending,
    businessTotal, businessPending,
    blogTotal,
    storiesTotal,
    videosTotal,
  ] = await Promise.all([
    prisma.hallOfFame.count(),
    prisma.hallOfFame.count({ where: { status: 0 } }),
    prisma.business.count(),
    prisma.business.count({ where: { status: 0 } }),
    prisma.blog.count(),
    prisma.latestNews.count(),
    prisma.video.count(),
  ])

  return [
    { label: 'Profiles',   count: profilesTotal, pending: profilesPending, icon: '👤', href: '/admin/profiles' },
    { label: 'Businesses', count: businessTotal,  pending: businessPending, icon: '🏢', href: '/admin/business' },
    { label: 'Blog Posts', count: blogTotal,      pending: 0,               icon: '📝', href: '/admin/blog' },
    { label: 'Stories',    count: storiesTotal,   pending: 0,               icon: '📰', href: '/admin/stories' },
    { label: 'Videos',     count: videosTotal,    pending: 0,               icon: '🎬', href: '/admin/media' },
  ]
}

export default async function AdminDashboardPage() {
  let stats: StatCard[] = []
  let dbError = false

  try {
    stats = await getStats()
  } catch {
    dbError = true
  }

  const totalPending = stats.reduce((sum, s) => sum + s.pending, 0)

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminNav />

      <main className="flex-1 p-8 ml-64">
        <div className="max-w-[1100px]">
          <h1 className="mb-1 text-2xl font-bold font-display sm:text-3xl text-green">
            Dashboard
          </h1>
          <p className="mb-8 text-sm text-ink-muted font-body">
            Overview of all content across Pride of Pakistan.
          </p>

          {dbError && (
            <div className="p-4 mb-6 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50 font-body">
              Couldn't load stats — check your database connection.
            </div>
          )}

          {totalPending > 0 && (
            <a
              href="/admin/profiles"
              className="block p-4 mb-6 text-sm no-underline transition-colors border rounded-lg bg-gold-pale border-gold/30 font-body hover:border-gold"
            >
              <span className="font-semibold text-gold">
                {totalPending} item{totalPending === 1 ? '' : 's'}
              </span>
              <span className="text-ink-mid"> waiting for review →</span>
            </a>
          )}

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 mb-10 sm:grid-cols-3 lg:grid-cols-5">
            {stats.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="bg-white border border-border rounded-xl p-5 no-underline hover:border-gold hover:-translate-y-0.5 transition-all"
              >
                <div className="mb-3 text-2xl">{s.icon}</div>
                <div className="font-display text-2xl font-bold text-ink-dark mb-0.5">
                  {s.count}
                </div>
                <div className="mb-2 text-xs text-ink-muted font-body">{s.label}</div>
                {s.pending > 0 && (
                  <span className="inline-block bg-gold text-white text-[10px] font-bold px-2 py-0.5 rounded font-body">
                    {s.pending} pending
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* Quick actions */}
          <div className="p-6 bg-white border border-border rounded-xl">
            <h2 className="mb-4 text-lg font-bold font-display text-green">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <a
                href="/admin/blog"
                className="flex items-center gap-3 px-4 py-3 no-underline transition-colors border rounded-lg border-border hover:border-gold"
              >
                <span className="text-xl">✍️</span>
                <span className="text-sm font-semibold text-ink-dark font-body">Write a Blog Post</span>
              </a>
              <a
                href="/admin/stories"
                className="flex items-center gap-3 px-4 py-3 no-underline transition-colors border rounded-lg border-border hover:border-gold"
              >
                <span className="text-xl">📰</span>
                <span className="text-sm font-semibold text-ink-dark font-body">Add a News Story</span>
              </a>
              <a
                href="/admin/profiles"
                className="flex items-center gap-3 px-4 py-3 no-underline transition-colors border rounded-lg border-border hover:border-gold"
              >
                <span className="text-xl">✅</span>
                <span className="text-sm font-semibold text-ink-dark font-body">Review Pending Profiles</span>
              </a>
              <a
                href="/admin/media"
                className="flex items-center gap-3 px-4 py-3 no-underline transition-colors border rounded-lg border-border hover:border-gold"
              >
                <span className="text-xl">🎬</span>
                <span className="text-sm font-semibold text-ink-dark font-body">Add a Pride TV Video</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}