import AdminNav from '@/app/components/admin/AdminNav'
import { prisma } from '@/app/lib/prisma'
import CategoriesClient from './CategoriesClient'

export const revalidate = 0

export default async function AdminCategoriesPage() {
  const categories = await prisma.hallCategory.findMany({
    orderBy: { categoryname: 'asc' },
  })

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminNav />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 p-4 lg:p-8">
        <div className="max-w-[700px]">
          <h1 className="font-display text-2xl font-bold text-green mb-1">Categories</h1>
          <p className="text-sm text-ink-muted font-body mb-8">Manage Who Is Who profile categories.</p>
          <CategoriesClient categories={categories.map((c) => ({
            categoryid: c.categoryid,
            categoryname: c.categoryname,
            status: c.status,
          }))} />
        </div>
      </main>
    </div>
  )
}