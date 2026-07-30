import AdminNav from '@/app/components/admin/AdminNav'
import BlogAdminClient from './BlogAdminClient'
import { prisma } from '@/app/lib/prisma'

export const revalidate = 0

export default async function AdminBlogPage() {
  let posts: {
    id: number
    title: string
    shortdesc: string
    status: string
    authorName: string
    createdAt: string
    image: string | null
  }[] = []

  try {
    const rows = await prisma.story.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        shortdesc: true,
        status: true,
        authorName: true,
        createdAt: true,
        image: true,
      },
    })
    posts = rows.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    }))
  } catch {
    posts = []
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminNav />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 p-4 lg:p-8">
        <div className="max-w-[900px]">
          <h1 className="mb-1 text-2xl font-bold font-display text-green">Blog / Stories</h1>
          <p className="mb-8 text-sm text-ink-muted font-body">
            Write and manage blog posts and stories. Admin posts are published immediately.
          </p>
          <BlogAdminClient posts={posts} />
        </div>
      </main>
    </div>
  )
}