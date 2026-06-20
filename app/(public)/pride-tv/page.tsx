import Link from 'next/link'
import { prisma } from '@/app/lib/prisma'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'
import PageHero from '@/app/components/shared/PageHero'

export const revalidate = 60

interface Video {
  video_id: number
  title: string
  thumb_url: string
  featured: string
  views: number
}

async function getVideos(): Promise<Video[]> {
  const rows = await prisma.video.findMany({
    where: { status: 'active' },
    orderBy: { datetime: 'desc' },
    take: 30,
  })

  return rows.map((r) => ({
    video_id: Number(r.video_id),
    title: r.title,
    thumb_url: r.thumb_url,
    featured: r.featured,
    views: Number(r.views),
  }))
}

export default async function PrideTVPage() {
  let videos: Video[] = []
  try {
    videos = await getVideos()
  } catch {
    videos = []
  }

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <PageHero
          eyebrow="Pakistan's Stories"
          title="Pride TV"
          subtitle="Documentaries, interviews, and cultural features celebrating Pakistan."
        />

        <section className="py-12 bg-ink-dark sm:py-16 lg:py-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
            {videos.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-5 text-center py-14 sm:py-20">
                <div className="mb-5 text-5xl sm:text-6xl opacity-35">📺</div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-black text-white mb-3">
                  Coming Soon
                </h2>
                <p className="text-sm text-white/[.42] max-w-[420px] leading-relaxed font-body">
                  We are curating Pakistan&apos;s most inspiring stories, documentaries, and cultural content. Stay tuned.
                </p>
                <span className="inline-block bg-gold text-white text-[11px] tracking-[.14em] uppercase px-5 py-1.5 rounded-full mt-6 font-bold font-body">
                  Launching Soon
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
                {videos.map((v) => (
                  <Link
                    key={v.video_id}
                    href={`/pride-tv/${v.video_id}`}
                    className="rounded-lg overflow-hidden bg-white/[.05] border border-white/[.08] transition-all no-underline hover:border-gold hover:-translate-y-1 group"
                  >
                    <div className="relative aspect-video bg-white/[.06] overflow-hidden">
                      {v.thumb_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={v.thumb_url}
                          alt={v.title}
                          className="object-cover w-full h-full transition-transform duration-400 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-3xl text-white/20">▶</div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center text-2xl text-white transition-opacity opacity-0 bg-black/35 sm:text-3xl group-hover:opacity-100">
                        ▶
                      </div>
                    </div>
                    <div className="p-3.5 sm:p-4">
                      <h4 className="font-display text-sm sm:text-[15px] font-semibold text-white leading-snug mb-1.5 line-clamp-2">
                        {v.title}
                      </h4>
                      <p className="text-xs text-white/40 font-body">
                        {v.views.toLocaleString()} views
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}