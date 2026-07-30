import { prisma } from '@/app/lib/prisma'
import AdminNav from '@/app/components/admin/AdminNav'
import ProfilesAdminClient from './ProfilesAdminClient'

export const revalidate = 0

export default async function AdminProfilesPage() {
  const profiles = await prisma.hallOfFame.findMany({
    orderBy: { id: 'desc' },
    select: { id: true, title: true, Profession: true, City: true, Country: true, Email: true, status: true, image: true, shortdesc: true, description: true },
  })

  const serialized = profiles.map((p) => ({
    id: p.id,
    title: p.title ?? 'Untitled',
    Profession: p.Profession ?? '',
    City: p.City ?? '',
    Country: p.Country ?? '',
    Email: p.Email ?? '',
    status: p.status ?? 0,
    image: p.image ? `/uploads/${p.image}` : null,
    description: p.description ?? '',
    shortdesc: p.shortdesc ?? '',
  }))

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminNav />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 p-4 lg:p-8">
        <div className="max-w-[1000px]">
          <h1 className="mb-1 text-2xl font-bold font-display text-green">Profiles</h1>
          <p className="mb-8 text-sm text-ink-muted font-body">Review and approve Who Is Who profile submissions.</p>
          <ProfilesAdminClient profiles={serialized} />
        </div>
      </main>
    </div>
  )
}