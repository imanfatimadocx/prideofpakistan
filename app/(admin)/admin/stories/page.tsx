import { prisma } from '@/app/lib/prisma'
import AdminNav from '@/app/components/admin/AdminNav'
import StoriesAdminClient from './StoriesAdminClient'

export const revalidate = 0

export default async function AdminStoriesPage() {
  const stories = await prisma.story.findMany({ orderBy: { createdAt: 'desc' } })

  const serialized = stories.map((s) => ({
    id: s.id,
    title: s.title,
    shortdesc: s.shortdesc,
    authorName: s.authorName,
    status: s.status,
    createdAt: s.createdAt.toISOString(),
  }))

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminNav />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 p-4 lg:p-8">
        <div className="max-w-[1000px]">
          <h1 className="mb-1 text-2xl font-bold font-display text-green">Stories</h1>
          <p className="mb-8 text-sm text-ink-muted font-body">Review and approve community-submitted stories.</p>
          <StoriesAdminClient stories={serialized} />
        </div>
      </main>
    </div>
  )
}