import Link from 'next/link'
import Image from 'next/image'
export interface ProfileCard {
  id: number
  title: string
  Profession?: string | null
  City?: string | null
  Country?: string | null
  image?: string | null
  shortdesc?: string | null
  categoryname?: string
}

interface Props {
  profiles: ProfileCard[]
}

export default function WhoIsWhoSection({ profiles }: Props) {
  return (
    <section className="py-12 border-t bg-cream sm:py-16 lg:py-20 border-border" id="who-is-who">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold mb-2 font-body">
              Hall of Fame
            </p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[38px] font-bold text-green leading-tight">
              Who Is Who
            </h2>
            <div className="w-12 h-[3px] bg-gold mt-3 rounded" />
          </div>
          <Link href="/who-is-who" className="text-[13px] font-semibold text-gold no-underline flex items-center gap-1.5 hover:gap-3 transition-all font-body whitespace-nowrap">
            View All →
          </Link>
        </div>

        {/* Strip: horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-4 px-4 pb-2 -mx-4 overflow-x-auto sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:gap-5 sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0 snap-x snap-mandatory sm:snap-none">
          {profiles.slice(0, 5).map((p) => (
            <Link
              key={p.id}
              href={`/who-is-who/${p.id}`}
              className="bg-white border border-border rounded-xl p-5 sm:p-6 no-underline flex flex-col items-center text-center transition-all hover:border-gold hover:-translate-y-1 hover:shadow-xl flex-shrink-0 w-[200px] sm:w-auto snap-start"
            >
              {/* Avatar */}
              <div className="relative mb-4 group">
                {p.image ? (
                  <Image src={p.image} alt={p.title} width={80} height={80} className="block object-cover object-top w-16 h-16 rounded-full sm:w-20 sm:h-20" />
                ) : (
                  <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-white rounded-full sm:w-20 sm:h-20 bg-green font-display sm:text-3xl">
                    {p.title.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Info */}
              {p.categoryname && (
                <span className="inline-block bg-gold-pale text-gold text-[10px] font-bold px-2.5 py-0.5 rounded mb-2 tracking-[.08em] uppercase font-body">
                  {p.categoryname}
                </span>
              )}
              <h3 className="mb-1 text-sm font-bold leading-tight font-display sm:text-base text-ink-dark">
                {p.title}
              </h3>
              {p.Profession && (
                <p className="text-[11px] sm:text-xs text-ink-muted font-body mb-1 line-clamp-1">
                  {p.Profession}
                </p>
              )}
              {(p.City || p.Country) && (
                <p className="text-[10px] sm:text-[11px] text-ink-muted font-body mb-2">
                  📍 {[p.City, p.Country].filter(Boolean).join(', ')}
                </p>
              )}
              {p.shortdesc && (
                <p className="text-[11px] sm:text-xs text-ink-muted leading-relaxed font-body flex-1 line-clamp-3">
                  {p.shortdesc.replace(/<[^>]*>/g, '').slice(0, 100)}…
                </p>
              )}
              <span className="mt-3.5 text-[11px] sm:text-xs text-gold font-semibold font-body">
                Read Profile →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}