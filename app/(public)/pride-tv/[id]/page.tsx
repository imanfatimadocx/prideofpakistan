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

export default async function VideoDetailPage({ params }: Props) {
  const { id } = await params

  let videoId: bigint
  try {
    videoId = BigInt(id)
  } catch {
    notFound()
  }

  const video = await prisma.video.findUnique({ where: { video_id: videoId } })
  if (!video || video.status !== 'active') notFound()

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <section className="py-12 bg-ink-dark sm:py-16">
          <div className="max-w-[1000px] mx-auto px-4 sm:px-8 lg:px-12">
            <Link href="/pride-tv" className="inline-block mb-6 text-sm text-gold-light font-body hover:underline">
              ← Back to Pride TV
            </Link>

            <div className="w-full mb-6 overflow-hidden bg-black aspect-video rounded-xl">
              {video.video_embed_code ? (
                <div
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{ __html: video.video_embed_code }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-4xl text-white/30">▶</div>
              )}
            </div>

            <h1 className="mb-2 text-2xl font-bold leading-tight text-white font-display sm:text-3xl">
              {video.title}
            </h1>
            <p className="mb-4 text-sm text-white/40 font-body">
              {Number(video.views).toLocaleString()} views ·{' '}
              {new Date(video.datetime).toLocaleDateString('en-PK', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
            {video.description && (
              <p className="text-sm leading-relaxed sm:text-base text-white/60 font-body">
                {video.description.replace(/<[^>]*>/g, '')}
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}