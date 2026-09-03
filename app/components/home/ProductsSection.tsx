import Link from "next/link";
import Image from "next/image";

export interface ProductCard {
  id: number;
  title: string;
  city?: string | null;
  image?: string | null;
  shortdesc?: string | null;
  category?: string | null;
  categoryid?: number;
}

interface Props {
  products: ProductCard[];
}

export default function ProductsSection({ products }: Props) {
  if (products.length === 0) return null;

  return (
    <section
      className="py-12 border-t bg-white sm:py-16 lg:py-20 border-border"
      id="products"
    >
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
            <div className="w-12 h-[3px] bg-gold mt-3 rounded" />
          </div>
          <Link
            href="/products"
            className="text-[13px] font-semibold text-gold no-underline flex items-center gap-1.5 hover:gap-3 transition-all font-body whitespace-nowrap"
          >
            View All →
          </Link>
        </div>

        {/* 6 featured — plain image + caption */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="no-underline group"
            >
              <div
                className="w-full overflow-hidden rounded-lg"
                style={{ aspectRatio: "600/350" }}
              >
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.title}
                    width={600}
                    height={350}
                    className="object-cover object-top  rounded-lg w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-green">
                    <span className="text-3xl font-black text-white font-display">
                      {p.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-2">
                <p className="text-sm font-bold leading-snug transition-colors font-display text-ink-dark group-hover:text-green line-clamp-1">
                  {p.title}
                </p>
                <p className="text-[11px] font-semibold text-gold font-body mt-0.5">
                  View Product →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
