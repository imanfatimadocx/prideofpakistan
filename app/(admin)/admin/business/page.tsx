import { prisma } from '@/app/lib/prisma'
import AdminNav from '@/app/components/admin/AdminNav'
import BusinessAdminClient from './BusinessAdminClient'

export const revalidate = 0

export default async function AdminBusinessPage() {
  const businesses = await prisma.business.findMany({
    orderBy: { id: 'desc' },
    select: { id: true, company_name: true, name: true, email: true, city: true, country: true, shortdesc: true, status: true, image: true },
  })

  const serialized = businesses.map((b) => ({
    id: b.id,
    company_name: b.company_name,
    name: b.name,
    email: b.email,
    city: b.city,
    country: b.country,
    shortdesc: b.shortdesc,
    status: b.status,
    image: b.image ? `/uploads/${b.image}` : null,
  }))

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminNav />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 p-4 lg:p-8">
        <div className="max-w-[1000px]">
          <h1 className="mb-1 text-2xl font-bold font-display text-green">Business Listings</h1>
          <p className="mb-8 text-sm text-ink-muted font-body">Review and approve business directory submissions.</p>
          <BusinessAdminClient businesses={serialized} />
        </div>
      </main>
    </div>
  )
}