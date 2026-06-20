import Link from 'next/link'
import { prisma } from '@/app/lib/prisma'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'
import PageHero from '@/app/components/shared/PageHero'

export const revalidate = 60

interface NewsItem {
  id: number
  title: string
  shortdesc: string
  smallimage: string | null
  date_time: Date
}

async function getNews(): Promise<NewsItem[]> {
  const rows = await prisma.latestNews.findMany({
    where: { status: 1 },
    orderBy: { date_time: 'desc' },
    take: 30,
  })

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    shortdesc: r.shortdesc,
    smallimage: r.smallimage ? `/uploads/${r.smallimage}` : null,
    date_time: r.date_time,
  }))
}

export default async function TopStoriesPage() {
  let news: NewsItem[] = []
  try {
    news = await getNews()
  } catch {
    news = []
  }

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <PageHero
          eyebrow="Latest Updates"
          title="Top Stories"
          subtitle="The latest news and developments from across Pakistan and the Pakistani diaspora."
        />

        <section className="py-12 bg-white sm:py-16 lg:py-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
            {news.length === 0 ? (
              <p className="py-12 text-center text-ink-muted font-body">
                No stories published yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
                {news.map((item) => (
                  <Link
                    key={item.id}
                    href={`/top-stories/${item.id}`}
                    className="block overflow-hidden no-underline transition-all bg-white border rounded-lg border-border hover:-translate-y-1 hover:shadow-xl hover:border-gold group"
                  >
                    {item.smallimage && (
                      <div className="w-full overflow-hidden h-44 sm:h-48">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.smallimage}
                          alt={item.title}
                          className="object-cover w-full h-full transition-transform duration-400 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-4 sm:p-5">
                      <p className="text-[11px] text-ink-muted font-body mb-2 tracking-wide">
                        {new Date(item.date_time).toLocaleDateString('en-PK', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </p>
                      <h3 className="font-display text-base sm:text-lg font-bold text-ink-dark leading-snug mb-2.5">
                        {item.title}
                      </h3>
                      <p className="text-[13px] text-ink-muted leading-relaxed font-body line-clamp-2">
                        {item.shortdesc.replace(/<[^>]*>/g, '')}
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