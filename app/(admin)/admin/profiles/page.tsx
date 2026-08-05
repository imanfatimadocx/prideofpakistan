import { prisma } from '@/app/lib/prisma'
import AdminNav from '@/app/components/admin/AdminNav'
import Link from 'next/link'
import ProfilesTableClient from './ProfilesTableClient'

export const revalidate = 0

export default async function AdminProfilesPage() {
  const [profiles, categories] = await Promise.all([
    prisma.hallOfFame.findMany({
      orderBy: { title: 'asc' },
      select: {
        id: true,
        title: true,
        Profession: true,
        status: true,
        image: true,
        feature: true,
        categoryid: true,
      },
    }),
    prisma.hallCategory.findMany({
      orderBy: { categoryname: 'asc' },
      select: { categoryid: true, categoryname: true },
    }),
  ])

  const catMap: Record<number, string> = {}
  categories.forEach((c) => { catMap[c.categoryid] = c.categoryname })

  const serialized = profiles.map((p) => ({
    id: p.id,
    title: p.title ?? '—',
    Profession: p.Profession ?? '',
    status: p.status ?? 0,
    image: p.image
      ? p.image.startsWith('http') ? p.image
        : p.image.startsWith('uploads/') ? `/${p.image}`
        : `/uploads/${p.image}`
      : null,
    feature: p.feature ?? 0,
    categoryid: p.categoryid ?? null,
    categoryname: p.categoryid ? catMap[p.categoryid] ?? null : null,
  }))

  const cats = categories.map((c) => ({
    categoryid: c.categoryid,
    categoryname: c.categoryname,
  }))

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminNav />
      <main className="flex-1 p-4 lg:ml-64 pt-14 lg:pt-14 lg:p-8">
        <div className="max-w-[1200px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="mb-1 text-2xl font-bold font-display text-green">Profiles</h1>
              <p className="text-sm text-ink-muted font-body">
                {profiles.filter((p) => p.status === 0).length} pending ·{' '}
                {profiles.filter((p) => p.feature === 1).length} featured ·{' '}
                {profiles.length} total
              </p>
            </div>
            <Link
              href="/admin/profiles/new"
              className="bg-gold text-white px-5 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors no-underline"
            >
              + Add Profile
            </Link>
          </div>
          <ProfilesTableClient profiles={serialized} categories={cats} />
        </div>
      </main>
    </div>
  )
}