import Link from 'next/link'
import Image from 'next/image'

export interface VideoCard {
  video_id: number
  title: string
  thumb_url: string
  featured: string
  views: number
  category: number
}

interface Props {
  videos: VideoCard[]
  comingSoon?: boolean
}

export default function PrideTVSection({ videos, comingSoon = false }: Props) {
  return (
    <section className="bg-ink-dark py-12 sm:py-16 lg:py-20" id="pride-tv">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold-light mb-2 font-body">
              Pakistan&apos;s Stories
            </p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[38px] font-bold text-white leading-tight">
              Pride TV
            </h2>
            <div className="w-12 h-[3px] bg-gold mt-3 rounded" />
          </div>
          {!comingSoon && (
            <Link href="/pride-tv" className="text-[13px] font-semibold text-gold-light no-underline flex items-center gap-1.5 hover:gap-3 transition-all font-body whitespace-nowrap">
              Watch All →
            </Link>
          )}
        </div>

        {comingSoon || videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 sm:py-18 px-5 text-center">
            <div className="text-5xl sm:text-6xl mb-5 opacity-35">📺</div>
            <h3 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-black text-white mb-3">
              Coming Soon
            </h3>
            <p className="text-sm text-white/[.42] max-w-[420px] leading-relaxed font-body">
              We are curating Pakistan&apos;s most inspiring stories, documentaries, and cultural content. Stay tuned.
            </p>
            <span className="inline-block bg-gold text-white text-[11px] tracking-[.14em] uppercase px-5 py-1.5 rounded-full mt-6 font-bold font-body">
              Launching Soon
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {videos.slice(0, 6).map((v) => (
              <Link
                key={Number(v.video_id)}
                href={`/pride-tv/${v.video_id}`}
                className="rounded-lg overflow-hidden bg-white/[.05] border border-white/[.08] transition-all no-underline hover:border-gold hover:-translate-y-1 group"
              >
                <div className="relative aspect-video bg-white/[.06] overflow-hidden">
                  {v.thumb_url ? (
                    <Image src={v.thumb_url} alt={v.title} className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-white/20">▶</div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/35 text-white text-2xl sm:text-3xl opacity-0 group-hover:opacity-100 transition-opacity">
                    ▶
                  </div>
                </div>
                <div className="p-3.5 sm:p-4">
                  <h4 className="font-display text-sm sm:text-[15px] font-semibold text-white leading-snug mb-1.5 line-clamp-2">
                    {v.title}
                  </h4>
                  <p className="text-xs text-white/40 font-body flex items-center gap-2">
                    {v.views.toLocaleString()} views
                    {v.featured === 'feature' && (
                      <span className="bg-gold text-white text-[9px] font-bold px-1.5 py-0.5 rounded tracking-[.06em] uppercase">
                        Featured
                      </span>
                    )}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}