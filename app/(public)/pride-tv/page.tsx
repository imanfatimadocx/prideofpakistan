import { prisma } from '@/app/lib/prisma'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'
import PrideTVPageClient from './PrideTVPageClient'
import { getPageContent } from '@/app/lib/pageContent'
import PageHero from '@/app/components/shared/PageHero'

export const dynamic = "force-dynamic";

export default async function PrideTVPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
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
  const [hero, categoryRows] = await Promise.all([
    getPageContent('page_pridetv'),
    prisma.videoCategory
      .findMany({
        where: { status: 1 },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        select: { id: true, name: true },
      })
      .catch(() => []),
  ])
  // Only show categories that actually have videos
  const usedIds = new Set(videos.map((v) => v.category))
  const categories = categoryRows.filter((c) => usedIds.has(c.id))
  const initialCategory = categories.some((c) => c.id === Number(category))
    ? Number(category)
    : null

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <PageHero
          eyebrow={hero.eyebrow}
          title={hero.heading}
          subtitle={hero.subtext}
        />
        <PrideTVPageClient
          videos={videos}
          categories={categories}
          initialCategory={initialCategory}
        />
      </main>
      <Footer />
    </>
  );
}