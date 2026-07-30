import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/app/lib/prisma'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'

export const revalidate = 60

interface Props {
  params: Promise<{ id: string }>
}

function getEmbedSrc(embedCode: string): string {
  if (!embedCode) return ''
  const code = embedCode.trim()
  if (code.includes('youtube.com/embed/')) return code
  const watchMatch = code.match(/youtube\.com\/watch\?v=([^&\s]+)/)
  if (watchMatch?.[1]) return `https://www.youtube.com/embed/${watchMatch[1]}?rel=0`
  const shortMatch = code.match(/youtu\.be\/([^?&\s]+)/)
  if (shortMatch?.[1]) return `https://www.youtube.com/embed/${shortMatch[1]}?rel=0`
  const srcMatch = code.match(/src=["']([^"']+)["']/)
  if (srcMatch?.[1]) return srcMatch[1]
  if (/^[a-zA-Z0-9_-]{11}$/.test(code)) return `https://www.youtube.com/embed/${code}?rel=0`
  return code
}

function getThumbnail(embedCode: string, existingThumb: string): string {
  if (existingThumb) return existingThumb
  const code = embedCode.trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(code)) return `https://img.youtube.com/vi/${code}/hqdefault.jpg`
  const patterns = [
    /youtube\.com\/embed\/([^"?&/\s]+)/,
    /youtu\.be\/([^"?&/\s]+)/,
    /youtube\.com\/watch\?v=([^"?&/\s]+)/,
  ]
  for (const p of patterns) {
    const m = code.match(p)
    if (m?.[1]) return `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`
  }
  return ''
}

export default async function PrideTVVideoPage({ params }: Props) {
  const { id } = await params
  const videoId = Number(id)
  if (Number.isNaN(videoId)) notFound()

  const [video, related] = await Promise.all([
    prisma.video.findUnique({ where: { video_id: BigInt(videoId) } }),
    prisma.video.findMany({
      where: { status: 'active', NOT: { video_id: BigInt(videoId) } },
      orderBy: [{ featured: 'desc' }, { views: 'desc' }],
      take: 8,
    }),
  ])

  if (!video || video.status !== 'active') notFound()

  const embedSrc = getEmbedSrc(video.video_embed_code)

  return (
    <>
      <Topbar />
      <Navbar />
      <main className="min-h-screen bg-green">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-8">

          {/* Back link */}
          <Link
            href="/pride-tv"
            className="inline-block mb-6 text-sm no-underline text-gold-light font-body hover:underline"
          >
            ← Back to Pride TV
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">

            {/* Player */}
            <div>
              <div className="relative w-full overflow-hidden bg-black shadow-2xl aspect-video rounded-xl">
                <iframe
                  src={embedSrc}
                  title={video.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Video info */}
              <div className="mt-5">
                {video.featured === 'feature' && (
                  <span className="inline-block bg-gold text-white text-[10px] font-bold tracking-[.12em] uppercase px-3 py-1 rounded mb-3 font-body">
                    Featured
                  </span>
                )}
                <h1 className="mb-3 text-xl font-bold leading-tight text-white font-display sm:text-2xl lg:text-3xl">
                  {video.title}
                </h1>
                <div className="flex items-center gap-4 mb-4 text-xs text-white/40 font-body">
                  {Number(video.views) > 0 && (
                    <span>{Number(video.views).toLocaleString()} views</span>
                  )}
                  <span>
                    {new Date(video.datetime).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </span>
                </div>
                {video.description && (
                  <div
                    className="text-sm leading-relaxed prose text-white/65 font-body prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: video.description }}
                  />
                )}
              </div>
            </div>

            {/* Related videos */}
            {related.length > 0 && (
              <div className="bg-white/[.06] rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-xs font-bold tracking-wide uppercase text-white/60 font-body">
                    More Videos
                  </p>
                </div>
                <div className="divide-y divide-white/[.06]">
                  {related.map((v) => (
                    <Link
                      key={Number(v.video_id)}
                      href={`/pride-tv/${Number(v.video_id)}`}
                      className="flex items-start gap-3 p-3 hover:bg-white/[.08] transition-colors no-underline"
                    >
                      {/* Thumbnail */}
                      <div className="relative flex-shrink-0 w-24 overflow-hidden rounded-lg h-14 bg-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getThumbnail(v.video_embed_code, v.thumb_url)}
                          alt={v.title}
                          className="object-cover w-full h-full"
                        />
                        {/* Play overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/80">
                            <div className="w-0 h-0 border-t-[4px] border-b-[4px] border-l-[7px] border-t-transparent border-b-transparent border-l-green ml-0.5" />
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold leading-snug transition-colors text-white/75 font-body line-clamp-2 hover:text-white">
                          {v.title}
                        </p>
                        {Number(v.views) > 0 && (
                          <p className="text-[10px] text-white/30 font-body mt-1">
                            {Number(v.views).toLocaleString()} views
                          </p>
                        )}
                        {v.featured === 'feature' && (
                          <span className="text-[9px] font-bold text-gold font-body uppercase tracking-wide mt-0.5 block">
                            Featured
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-white/10">
                  <Link
                    href="/pride-tv"
                    className="text-xs font-semibold no-underline text-gold-light font-body hover:underline"
                  >
                    View all videos →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}