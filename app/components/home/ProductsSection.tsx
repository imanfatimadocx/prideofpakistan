import Link from 'next/link'
import Image from 'next/image'

export interface ProductCard {
  id: number
  title: string
  city: string
  image?: string | null
  shortdesc?: string
  category?: string
}

interface Props {
  products: ProductCard[]
}

const PRODUCT_EMOJIS = ['🥭','🌹','⚽','🍵','🔮','🌾','💎','🎨']

export default function ProductsSection({ products }: Props) {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20" id="products">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold mb-2 font-body">
              Made in Pakistan
            </p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[38px] font-bold text-green leading-tight">
              Pakistani Products
            </h2>
            <div className="w-12 h-[3px] bg-gold mt-3 rounded" />
          </div>
          <Link href="/products" className="text-[13px] font-semibold text-gold no-underline flex items-center gap-1.5 hover:gap-3 transition-all font-body whitespace-nowrap">
            See All →
          </Link>
        </div>

        {/* Grid: 2 cols mobile, 3 tablet, 4 desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {products.slice(0, 8).map((p, i) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="rounded-lg overflow-hidden border border-border transition-all duration-300 no-underline block bg-white hover:-translate-y-1 hover:shadow-xl hover:border-gold group"
            >
              <div className="w-full h-32 sm:h-40 lg:h-[180px] bg-gold-pale flex items-center justify-center overflow-hidden">
                {p.image
                  ? <Image src={p.image} alt={p.title} width={100} height={100} className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105" />
                  : <span className="text-4xl sm:text-5xl">{PRODUCT_EMOJIS[i % PRODUCT_EMOJIS.length]}</span>
                }
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-display text-sm sm:text-base font-bold text-ink-dark mb-1 leading-snug">
                  {p.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-ink-muted flex items-center gap-1 font-body">
                  🌿 {p.city}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}