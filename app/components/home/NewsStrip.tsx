import Link from 'next/link'

export interface NewsItem {
  id: number
  title: string
  shortdesc: string
  smallimage?: string | null
  date_time: Date | string
}

interface Props {
  news?: NewsItem[]
}

export default function NewsStrip({ news = [] }: Props) {
  if (!news.length) return null

  return (
    <section className="py-12 bg-white border-t sm:py-16 lg:py-18 border-border" id="top-stories">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-end justify-between gap-4 mb-7 sm:mb-9">
          <div>
            <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold mb-2 font-body">
              Latest Updates
            </p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[38px] font-bold text-green leading-tight">
              Top Stories
            </h2>
            <div className="w-12 h-[3px] bg-gold mt-3 rounded" />
          </div>
          <Link href="/top-stories" className="text-[13px] font-semibold text-gold no-underline flex items-center gap-1.5 hover:gap-3 transition-all font-body whitespace-nowrap">
            All Stories →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {news.slice(0, 3).map((item) => (
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
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
                <h3 className="font-display text-base sm:text-lg font-bold text-ink-dark leading-snug mb-2.5">
                  {item.title}
                </h3>
                <p className="text-[13px] text-ink-muted leading-relaxed font-body mb-4 line-clamp-2">
                  {item.shortdesc.replace(/<[^>]*>/g, '').slice(0, 120)}…
                </p>
                <span className="text-[13px] font-semibold text-gold font-body">
                  Read More →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}