import Link from 'next/link'
import { prisma } from '@/app/lib/prisma'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'
import PageHero from '@/app/components/shared/PageHero'

export const revalidate = 60

interface BlogPost {
  id: number
  title: string
  topic: string
  shortdesc: string
  image: string | null
  date: Date
}

async function getPosts(): Promise<BlogPost[]> {
  const rows = await prisma.blog.findMany({
    where: { status: 'active' },
    orderBy: { date: 'desc' },
    take: 30,
  })

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    topic: r.topic,
    shortdesc: r.shortdesc,
    image: r.image ? `/uploads/${r.image}` : null,
    date: r.date,
  }))
}

export default async function PrideBlogPage() {
  let posts: BlogPost[] = []
  try {
    posts = await getPosts()
  } catch {
    posts = []
  }

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <PageHero
          eyebrow="Stories & Perspectives"
          title="Pride Blog"
          subtitle="Essays, interviews, and reflections celebrating Pakistani culture, achievements, and everyday life."
        />

        <section className="py-12 bg-white sm:py-16 lg:py-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
            {posts.length === 0 ? (
              <p className="py-12 text-center text-ink-muted font-body">
                No blog posts published yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/pride-blog/${post.id}`}
                    className="block overflow-hidden no-underline transition-all bg-white border rounded-lg border-border hover:-translate-y-1 hover:shadow-xl hover:border-gold group"
                  >
                    {post.image && (
                      <div className="w-full overflow-hidden h-44 sm:h-48">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.image}
                          alt={post.title}
                          className="object-cover w-full h-full transition-transform duration-400 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-4 sm:p-5">
                      <span className="inline-block bg-gold-pale text-gold text-[10px] font-bold px-2.5 py-0.5 rounded mb-2 tracking-[.08em] uppercase font-body">
                        {post.topic}
                      </span>
                      <h3 className="mb-2 text-base font-bold leading-snug font-display sm:text-lg text-ink-dark">
                        {post.title}
                      </h3>
                      <p className="text-[13px] text-ink-muted leading-relaxed font-body mb-3 line-clamp-2">
                        {post.shortdesc.replace(/<[^>]*>/g, '')}
                      </p>
                      <p className="text-[11px] text-ink-muted font-body">
                        {new Date(post.date).toLocaleDateString('en-PK', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
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