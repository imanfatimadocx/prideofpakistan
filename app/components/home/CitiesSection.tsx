import Link from 'next/link'

export interface CityCard {
  id: number
  name: string
  tag?: string
  meta?: string
  bgColor?: string
  imageUrl?: string
  featured?: boolean
}

interface Props {
  cities: CityCard[]
}

const PALETTES = ['#2d5a3d', '#3d5c3a', '#2a4a5e', '#5e3a2a', '#3a3d5e', '#5e4a2a']

export default function CitiesSection({ cities }: Props) {
  return (
    <section className="py-12 bg-cream sm:py-16 lg:py-20" id="cities">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold mb-2 font-body">
              Explore Pakistan
            </p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[38px] font-bold text-green leading-tight">
              Cities, Towns &amp; Villages
            </h2>
            <div className="w-12 h-[3px] bg-gold mt-3 rounded" />
          </div>
          <Link href="/cities" className="text-[13px] font-semibold text-gold no-underline flex items-center gap-1.5 hover:gap-3 transition-all font-body whitespace-nowrap">
            View All →
          </Link>
        </div>

        {/* Grid: 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-3 sm:gap-4 lg:gap-[18px] auto-rows-[160px] sm:auto-rows-[200px] lg:auto-rows-auto lg:h-[480px]">
          {cities.slice(0, 5).map((city, i) => (
            <Link
              key={city.id}
              href={`/cities/${city.id}`}
              className={`group rounded-lg overflow-hidden relative block no-underline ${
                i === 0 ? 'col-span-2 row-span-2 lg:col-span-2 lg:row-span-2' : ''
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.06]"
                style={{
                  backgroundImage: city.imageUrl ? `url('${city.imageUrl}')` : undefined,
                  backgroundColor: city.bgColor ?? PALETTES[i % PALETTES.length],
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green/[.88] via-green/[.15] to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
                {city.tag && (
                  <span className="inline-block bg-gold text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded mb-1 sm:mb-1.5 tracking-[.08em] uppercase font-body">
                    {city.tag}
                  </span>
                )}
                <div className={`font-display font-bold text-white leading-tight ${i === 0 ? 'text-xl sm:text-2xl lg:text-[32px]' : 'text-base sm:text-lg lg:text-[22px]'}`}>
                  {city.name}
                </div>
                {city.meta && (
                  <div className="text-[10px] sm:text-xs text-white/65 mt-1 font-body line-clamp-1">
                    {city.meta}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}