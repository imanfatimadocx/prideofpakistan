import Link from 'next/link'
import { prisma } from '@/app/lib/prisma'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'
import PageHero from '@/app/components/shared/PageHero'

export const revalidate = 60

export default async function YourStoriesPage() {
  let stories: {
    id: number
    title: string
    shortdesc: string
    authorName: string
    createdAt: Date
    image: string | null
  }[] = []

  try {
    stories = await prisma.story.findMany({
      where: { status: 'approved' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        shortdesc: true,
        authorName: true,
        createdAt: true,
        image: true,
      },
    })
  } catch {
    stories = []
  }

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <PageHero
          eyebrow="Community Stories"
          title="Your Stories"
          subtitle="Real stories from Pakistanis at home and around the world - in their own words."
        />

        <section className="py-12 bg-white sm:py-16 lg:py-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="flex justify-end mb-8">
              <Link
                href="/your-stories/new"
                className="bg-gold text-white px-5 py-2.5 rounded-md font-semibold text-sm font-body hover:bg-gold-light hover:text-ink-dark transition-colors no-underline"
              >
                Share Your Story
              </Link>
            </div>

            {stories.length === 0 ? (
              <div className="py-20 text-center">
                <p className="mb-3 text-2xl font-display text-green">No stories yet</p>
                <p className="mb-6 text-sm text-ink-muted font-body">
                  Be the first to share your story with Pakistan.
                </p>
                <Link
                  href="/your-stories/new"
                  className="px-6 py-3 text-sm font-semibold text-white no-underline transition-colors rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark"
                >
                  Write a Story
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
                {stories.map((story) => (
                  <Link
                    key={story.id}
                    href={`/your-stories/${story.id}`}
                    className="block overflow-hidden no-underline transition-all bg-white border border-border rounded-xl hover:-translate-y-1 hover:shadow-xl hover:border-gold group"
                  >
                    {story.image ? (
                      <div className="w-full overflow-hidden h-44">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/uploads/${story.image}`}
                          alt={story.title}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-2 bg-gold" />
                    )}
                    <div className="p-5">
                      <h3 className="mb-2 text-lg font-bold leading-snug font-display text-ink-dark">
                        {story.title}
                      </h3>
                      <p className="text-[13px] text-ink-muted font-body leading-relaxed mb-4 line-clamp-3">
                        {story.shortdesc}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center text-xs font-bold text-white rounded-full w-7 h-7 bg-green font-display">
                            {story.authorName.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs text-ink-muted font-body">{story.authorName}</span>
                        </div>
                        <span className="text-[11px] text-ink-muted font-body">
                          {new Date(story.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </span>
                      </div>
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