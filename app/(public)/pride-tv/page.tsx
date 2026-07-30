import { prisma } from '@/app/lib/prisma'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'
import PrideTVPageClient from './PrideTVPageClient'

export const revalidate = 60

export default async function PrideTVPage() {
  let videos: {
    video_id: number
    title: string
    thumb_url: string
    featured: string
    views: number
    video_embed_code: string
    category: number
  }[] = []

  try {
    const rows = await prisma.video.findMany({
      where: { status: 'active' },
      orderBy: [{ featured: 'desc' }, { datetime: 'desc' }],
    })
    videos = rows.map((v) => ({
      video_id: Number(v.video_id),
      title: v.title,
      thumb_url: v.thumb_url,
      featured: v.featured,
      views: Number(v.views),
      video_embed_code: v.video_embed_code,
      category: v.category,
    }))
  } catch {
    videos = []
  }

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <PrideTVPageClient videos={videos} />
      </main>
      <Footer />
    </>
  )
}