import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/app/lib/prisma'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'

export const revalidate = 60

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const productId = Number(id)
  if (Number.isNaN(productId)) notFound()

  const product = await prisma.pakProduct.findUnique({ where: { id: productId } })
  if (!product || product.status !== 1) notFound()

  const image = product.image ? `/uploads/${product.image}` : null

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <section className="py-12 bg-cream sm:py-16">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-8 lg:px-12">
            <Link
              href="/products"
              className="inline-block mb-6 text-sm text-gold font-body hover:underline"
            >
              ← Back to Products
            </Link>

            <div className="grid items-start grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12">
              <div className="flex items-center justify-center w-full h-64 overflow-hidden sm:h-80 bg-gold-pale rounded-xl">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt={product.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-6xl">🥭</span>
                )}
              </div>

              <div>
                <span className="inline-block bg-gold text-white text-[10px] font-bold tracking-[.12em] uppercase px-3.5 py-1.5 rounded mb-3 font-body">
                  {product.City}
                </span>
                <h1 className="mb-4 text-3xl font-bold leading-tight font-display sm:text-4xl text-green">
                  {product.title}
                </h1>
                {product.shortdesc && (
                  <p className="mb-4 text-sm leading-relaxed sm:text-base text-ink-mid font-body">
                    {(product.shortdesc as string).replace(/<[^>]*>/g, '')}
                  </p>
                )}
                {product.description && (
                  <div
                    className="mt-4 leading-relaxed prose prose-neutral max-w-none font-body text-ink-mid"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}