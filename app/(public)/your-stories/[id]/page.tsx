import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/app/lib/prisma'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'
import CommentSection from '@/app/components/shared/CommentSection'

export const revalidate = 60

interface Props {
  params: Promise<{ id: string }>
}

export default async function StoryDetailPage({ params }: Props) {
  const { id } = await params
  const storyId = Number(id)
  if (Number.isNaN(storyId)) notFound()

  const story = await prisma.story.findUnique({ where: { id: storyId } })
  if (!story || story.status !== 'approved') notFound()

  return (
    <><Topbar /><Navbar />
    <main>
      <section className="py-12 bg-cream sm:py-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-8 lg:px-12">
          <Link href="/your-stories" className="inline-block mb-6 text-sm text-gold font-body hover:underline">Back to Stories</Link>

          <h1 className="mb-4 text-3xl font-bold leading-tight font-display sm:text-4xl text-green">{story.title}</h1>

          <div className="flex items-center gap-3 pb-8 mb-8 border-b border-border">
            <div className="flex items-center justify-center text-sm font-bold text-white rounded-full w-9 h-9 bg-green font-display">
              {story.authorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-dark font-body">{story.authorName}</p>
              <p className="text-xs text-ink-muted font-body">
                {new Date(story.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {story.image && (
            <div className="w-full h-64 mb-8 overflow-hidden sm:h-80 rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/uploads/${story.image}`} alt={story.title} className="object-cover w-full h-full" />
            </div>
          )}

          <div className="leading-relaxed prose whitespace-pre-wrap prose-neutral max-w-none font-body text-ink-mid">
            {story.content}
          </div>
        </div>
      </section>

      <CommentSection entityType="story" entityId={storyId} />
    </main><Footer /></>
  )
}