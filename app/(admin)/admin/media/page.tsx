import AdminNav from '@/app/components/admin/AdminNav'
import MediaAdminClient from './MediaAdminClient'
import { prisma } from '@/app/lib/prisma'

export const revalidate = 0

export default async function AdminMediaPage() {
  let videos: {
    video_id: number
    title: string
    video_embed_code: string
    thumb_url: string
    status: string
    featured: string
    views: number
    datetime: string
  }[] = []

  try {
    const rows = await prisma.video.findMany({
      orderBy: { datetime: 'desc' },
    })
    videos = rows.map((v) => ({
      video_id: Number(v.video_id),
      title: v.title,
      video_embed_code: v.video_embed_code,
      thumb_url: v.thumb_url,
      status: v.status,
      featured: v.featured,
      views: Number(v.views),
      datetime: v.datetime.toISOString(),
    }))
  } catch {
    videos = []
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminNav />
      <main className="flex-1 p-8 ml-64">
        <div className="max-w-[900px]">
          <h1 className="mb-1 text-2xl font-bold font-display text-green">Pride TV — Media</h1>
          <p className="mb-8 text-sm text-ink-muted font-body">
            Add YouTube videos with a custom caption. They appear as embedded players on the homepage and Pride TV page.
          </p>
          <MediaAdminClient videos={videos} />
        </div>
      </main>
    </div>
  )
}