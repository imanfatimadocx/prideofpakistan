import Link from 'next/link'

export interface ProductCard {
  id: number
  title: string
  city: string
  image: string | null
  shortdesc?: string
  category?: string
  categoryid?: number
}

interface CategoryTile {
  id: number
  name: string
  count: number
}

interface Props {
  products: ProductCard[]
  categories: CategoryTile[]
}

const CATEGORY_COLORS = [
  '#2a4a5e',
  '#1a5c3a',
  '#5e4a2a',
  '#3a3d5e',
  '#5e3a2a',
]

export default function ProductsSection({ products, categories }: Props) {
  // First image per category
  const categoryFirstImage: Record<number, string | null> = {}
  for (const cat of categories) {
    const first = products.find((p) => p.categoryid === cat.id && p.image)
    categoryFirstImage[cat.id] = first?.image ?? null
  }

  return (
    <section className="py-12 bg-white sm:py-16 lg:py-20" id="products">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold mb-2 font-body">
              Made in Pakistan
            </p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[38px] font-bold text-green leading-tight">
              Pakistani Products
            </h2>
            <p className="text-sm text-ink-muted font-body mt-2 max-w-[480px]">
              Browse Pakistani products by type. Click any category to explore.
            </p>
            <div className="w-12 h-[3px] bg-gold mt-3 rounded" />
          </div>
          <Link
            href="/products"
            className="text-[13px] font-semibold text-gold no-underline flex items-center gap-1.5 hover:gap-3 transition-all font-body whitespace-nowrap"
          >
            See All
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
                  href={`/products?category=${cat.id}`}
                  className="flex flex-col overflow-hidden no-underline transition-all duration-200 bg-white border border-border rounded-xl hover:border-gold hover:shadow-xl hover:-translate-y-1 group"
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
                      <span className="text-5xl font-black select-none font-display text-white/30">
                        {cat.name.charAt(0)}
                      </span>
                    )}
                    <div className="absolute inset-0 transition-colors duration-300 bg-green/0 group-hover:bg-green/20" />
                  </div>
                  {/* Info */}
                  <div className="px-3.5 py-3 flex flex-col gap-1">
                    <span className="text-xs sm:text-[13px] font-bold font-display text-ink-dark leading-snug group-hover:text-green transition-colors">
                      {cat.name}
                    </span>
                    <span className="text-[10px] font-semibold font-body text-gold">
                      {cat.count} {cat.count === 1 ? 'product' : 'products'} →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-5 lg:gap-6">
          {products.slice(0, 8).map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="overflow-hidden no-underline transition-all bg-white border rounded-lg border-border hover:-translate-y-1 hover:shadow-xl hover:border-gold group"
            >
              <div className="flex items-center justify-center w-full h-32 overflow-hidden sm:h-40 bg-gold-pale">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image}
                    alt={p.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-12 h-12 border-2 rounded-sm border-border" />
                )}
              </div>
              <div className="p-3">
                {p.category && (
                  <span className="text-[10px] font-bold text-gold tracking-[.08em] uppercase font-body block mb-0.5">
                    {p.category}
                  </span>
                )}
                <h3 className="mb-1 text-xs font-bold leading-snug font-display sm:text-sm text-ink-dark">
                  {p.title}
                </h3>
                <p className="text-[11px] text-ink-muted font-body">{p.city}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}