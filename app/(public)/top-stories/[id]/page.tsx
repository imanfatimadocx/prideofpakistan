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

export default async function StoryDetailPage({ params }: Props) {
  const { id } = await params
  const storyId = Number(id)
  if (Number.isNaN(storyId)) notFound()

  const story = await prisma.latestNews.findUnique({ where: { id: storyId } })
  if (!story || story.status !== 1) notFound()

  const image = story.smallimage ? `/uploads/${story.smallimage}` : null

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <section className="py-12 bg-cream sm:py-16">
          <div className="max-w-[800px] mx-auto px-4 sm:px-8 lg:px-12">
            <Link href="/top-stories" className="inline-block mb-6 text-sm text-gold font-body hover:underline">
              ← Back to Top Stories
            </Link>

            <p className="mb-3 text-sm text-ink-muted font-body">
              {new Date(story.date_time).toLocaleDateString('en-PK', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
            <h1 className="mb-6 text-3xl font-bold leading-tight font-display sm:text-4xl text-green">
              {story.title}
            </h1>

            {image && (
              <div className="w-full h-56 mb-8 overflow-hidden sm:h-80 rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={story.title} className="object-cover w-full h-full" />
              </div>
            )}

            <div
              className="leading-relaxed prose prose-neutral max-w-none font-body text-ink-mid"
              dangerouslySetInnerHTML={{ __html: story.description }}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}