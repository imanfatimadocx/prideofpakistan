import Image from 'next/image'
import Link from 'next/link'

export interface BizCard {
  id: number
  company_name: string
  shortdesc: string
  city: string
  country: string
  image?: string | null
  category?: string
}

interface Props {
  businesses: BizCard[]
}

const CATEGORY_ICONS: Record<string, string> = {
  'Technology':    '💻',
  'Healthcare':    '💊',
  'Construction':  '🏗️',
  'Food':          '🌿',
  'Hospitality':   '🏨',
  'Media':         '📰',
  'Finance':       '🏦',
  'Education':     '🎓',
  'Real Estate':   '🏢',
  'Retail':        '🛍️',
  'Manufacturing': '⚙️',
  'Agriculture':   '🌾',
}

function getIcon(cat?: string): string {
  if (!cat) return '🏢'
  const match = Object.keys(CATEGORY_ICONS).find(k => cat.toLowerCase().includes(k.toLowerCase()))
  return match ? CATEGORY_ICONS[match] : '🏢'
}

export default function BusinessSection({ businesses }: Props) {
  return (
    <section className="bg-green py-12 sm:py-16 lg:py-20" id="business">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold-light mb-2 font-body">
              Business Directory
            </p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[38px] font-bold text-white leading-tight">
              Pakistani Businesses
            </h2>
            <div className="w-12 h-[3px] bg-gold mt-3 rounded" />
          </div>
          <Link href="/business" className="text-[13px] font-semibold text-gold-light no-underline flex items-center gap-1.5 hover:gap-3 transition-all font-body whitespace-nowrap">
            Browse All →
          </Link>
        </div>

        {/* Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {businesses.slice(0, 5).map((biz) => (
            <Link
              key={biz.id}
              href={`/business/${biz.id}`}
              className="bg-white/[.06] border border-white/10 rounded-xl p-6 transition-all duration-300 no-underline flex flex-col backdrop-blur-md hover:bg-white/10 hover:border-gold hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="w-14 h-14 bg-white/[.12] rounded-xl flex items-center justify-center text-2xl mb-4 overflow-hidden">
                {biz.image
                  ? (
                    <Image
                      src={biz.image}
                      alt={biz.company_name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  )
                  : <span>{getIcon(biz.category)}</span>
                }
              </div>
              <p className="text-[10px] text-gold-light tracking-[.1em] uppercase font-bold mb-2 font-body">
                {biz.category ?? 'Business'}
              </p>
              <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-1.5 leading-tight">
                {biz.company_name}
              </h3>
              <p className="text-xs text-white/45 mb-2.5 font-body">
                📍 {biz.city}, {biz.country}
              </p>
              <p className="text-[13px] text-white/[.58] leading-relaxed font-body flex-1">
                {biz.shortdesc}
              </p>
              <span className="mt-4.5 text-xs text-gold-light flex items-center gap-1.5 font-semibold font-body tracking-[.02em]">
                View Profile →
              </span>
            </Link>
          ))}

          {/* CTA card */}
          <Link
            href="/list-business"
            className="border border-dashed border-gold/30 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[180px] sm:min-h-[200px] no-underline transition-all hover:border-gold hover:border-solid bg-white/[.03]"
          >
            <div className="text-4xl opacity-40 mb-3 text-white">＋</div>
            <h3 className="font-display text-base font-bold text-white mb-2">List Your Business</h3>
            <p className="text-[13px] text-white/[.58] leading-relaxed font-body mt-2">
              Join Pakistan&apos;s premier business directory and reach thousands of visitors.
            </p>
            <span className="mt-4.5 text-xs text-gold-light flex items-center justify-center gap-1.5 font-semibold font-body">
              Get Listed →
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}