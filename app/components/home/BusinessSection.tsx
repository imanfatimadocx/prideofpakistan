import Link from 'next/link'

export interface BizCard {
  id: number
  company_name: string
  shortdesc: string
  city: string
  country: string
  image: string | null
  category?: string
  categoryid?: number
}

interface CategoryTile {
  id: number
  name: string
  count: number
}

interface Props {
  businesses: BizCard[]
  categories: CategoryTile[]
}

const CATEGORY_COLORS = [
  '#1a5c3a',
  '#2a4a5e',
  '#5e3a2a',
  '#3a3d5e',
  '#4a3a1a',
]

export default function BusinessSection({ businesses, categories }: Props) {
  // First image per category
  const categoryFirstImage: Record<number, string | null> = {}
  for (const cat of categories) {
    const first = businesses.find((b) => b.categoryid === cat.id && b.image)
    categoryFirstImage[cat.id] = first?.image ?? null
  }

  return (
    <section className="py-12 bg-green sm:py-16 lg:py-20" id="business">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold-light mb-2 font-body">
              Pakistani Businesses
            </p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[38px] font-bold text-white leading-tight">
              Pakistani Businesses
            </h2>
            <p className="text-sm text-white/55 font-body mt-2 max-w-[480px]">
              Browse businesses by industry. Click any category to explore listings.
            </p>
            <div className="w-12 h-[3px] bg-gold mt-3 rounded" />
          </div>
          <Link
            href="/business"
            className="text-[13px] font-semibold text-gold-light no-underline flex items-center gap-1.5 hover:gap-3 transition-all font-body whitespace-nowrap"
          >
            Browse All
          </Link>
        </div>

        {/* Category cards */}
        {categories.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-10 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
            {categories.slice(0, 5).map((cat, i) => {
              const previewImage = categoryFirstImage[cat.id]
              return (
                <Link
                  key={cat.id}
                  href={`/business?category=${cat.id}`}
                  className="flex flex-col overflow-hidden no-underline bg-white/[.06] border border-white/10 rounded-xl transition-all duration-200 hover:border-gold hover:shadow-xl hover:-translate-y-1 group"
                >
                  {/* Square image area */}
                  <div
                    className="relative flex items-center justify-center w-full overflow-hidden aspect-square"
                    style={{ background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                  >
                    {previewImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previewImage}
                        alt={cat.name}
                        className="object-cover object-top w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-5xl font-black select-none font-display text-white/20">
                        {cat.name.charAt(0)}
                      </span>
                    )}
                    <div className="absolute inset-0 transition-colors duration-300 bg-green/0 group-hover:bg-green/30" />
                  </div>
                  {/* Info */}
                  <div className="px-3.5 py-3 flex flex-col gap-1">
                    <span className="text-xs sm:text-[13px] font-bold font-display text-white leading-snug group-hover:text-gold-light transition-colors">
                      {cat.name}
                    </span>
                    <span className="text-[10px] font-semibold font-body text-gold-light">
                      {cat.count} {cat.count === 1 ? 'business' : 'businesses'} →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Business cards */}
        {businesses.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-white/50 font-body">Featured listings</p>
              <Link
                href="/list-business"
                className="text-xs font-semibold no-underline text-gold-light font-body hover:underline"
              >
                List your business →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {businesses.slice(0, 6).map((biz) => (
                <Link
                  key={biz.id}
                  href={`/business/${biz.id}`}
                  className="bg-white/[.06] border border-white/10 rounded-xl p-5 no-underline flex flex-col transition-all hover:bg-white/10 hover:border-gold hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex items-center justify-center flex-shrink-0 overflow-hidden border rounded-lg w-11 h-11 bg-white/10 border-white/10">
                      {biz.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={biz.image} alt={biz.company_name} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-5 h-5 border-2 rounded-sm border-white/20" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {biz.category && (
                        <span className="text-[10px] text-gold-light font-bold tracking-[.08em] uppercase font-body block mb-0.5">
                          {biz.category}
                        </span>
                      )}
                      <h3 className="text-sm font-bold leading-tight text-white font-display">
                        {biz.company_name}
                      </h3>
                      <p className="text-[11px] text-white/45 font-body mt-0.5">
                        {biz.city}, {biz.country}
                      </p>
                    </div>
                  </div>
                  <p className="text-[12px] text-white/55 leading-relaxed font-body flex-1 line-clamp-2">
                    {biz.shortdesc}
                  </p>
                  <span className="mt-3 text-[11px] text-gold-light font-semibold font-body">
                    View Profile
                  </span>
                </Link>
              ))}

              {/* CTA card */}
              <Link
                href="/list-business"
                className="border border-dashed border-gold/30 rounded-xl p-5 flex flex-col items-center justify-center text-center min-h-[160px] no-underline hover:border-gold hover:border-solid transition-all bg-white/[.03]"
              >
                <div className="w-8 h-8 mb-3 border-2 rounded-sm border-white/20" />
                <p className="mb-1 text-sm font-bold text-white font-display">List Your Business</p>
                <p className="text-xs text-white/50 font-body">Join Pakistan's premier directory</p>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}