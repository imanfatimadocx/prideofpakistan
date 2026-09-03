import { notFound, redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import Topbar from "@/app/components/layout/Topbar";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import Link from "next/link";
import ProductInquiryForm from "./ProductInquiryForm";

export const revalidate = 3600;

function resolveImage(img: string | null): string | null {
  if (!img || img.trim() === "") return null;
  if (img.startsWith("http")) return img;
  if (img.startsWith("/")) return img;
  if (img.startsWith("uploads/")) return `/${img}`;
  if (img.startsWith("pakproduct/")) return `/uploads/${img}`; // ← fix
  return `/uploads/${img}`;
}
interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);
  if (Number.isNaN(productId)) notFound();

  const [product, categories] = await Promise.all([
    prisma.pakProduct.findUnique({
      where: { id: productId },
      include: { category: true },
    }),
    prisma.productCategory.findMany({
      where: { status: 1 },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product || product.status !== 1) redirect("/products");

  const image = resolveImage(product.image || null);

  return (
    <>
      <Topbar />
      <Navbar />
      <main className="min-h-screen bg-cream">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 lg:px-12 py-8 lg:py-12">
          {/* Back */}
          <Link
            href="/products"
            className="flex items-center gap-2 text-sm font-semibold no-underline text-gold font-body hover:underline mb-8"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Pakistani Products
          </Link>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left — image + categories */}
            <div className="w-full lg:w-[340px] flex-shrink-0 space-y-5">
              {/* Image */}
              <div
                className="w-full overflow-hidden rounded-xl"
                style={{ aspectRatio: "600/350" }}
              >
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt={product.title}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-green">
                    <span className="font-display text-6xl font-bold text-white">
                      {product.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Categories sidebar */}
              <div className="bg-white border border-border rounded-xl overflow-hidden lg:sticky lg:top-6">
                <div className="bg-green/10 border-b border-border px-4 py-3">
                  <h2 className="text-sm font-bold text-green font-display uppercase tracking-wide">
                    Pakistani Products Categories
                  </h2>
                </div>
                <nav className="py-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.id}`}
                      className={`block px-4 py-2.5 text-sm font-body transition-colors no-underline border-b border-border/50 last:border-0 ${
                        product.categoryid === cat.id
                          ? "bg-gold-pale text-gold font-semibold"
                          : "text-ink-dark hover:bg-gold-pale hover:text-gold"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>

            {/* Right — content */}
            <div className="flex-1 min-w-0 space-y-5">
              {/* Title header */}
              <div className="bg-green rounded-xl px-6 py-4">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {product.title}
                </h1>
                {product.category && (
                  <p className="text-gold text-sm font-body mt-1">
                    {product.category.name}
                  </p>
                )}
              </div>

              {/* Short description */}
              {product.shortdesc && (
                <div className="bg-white border border-border rounded-xl overflow-hidden">
                  <div className="bg-green/10 border-b border-border px-5 py-3">
                    <h2 className="text-sm font-bold text-green font-display uppercase tracking-wide">
                      Overview
                    </h2>
                  </div>
                  <p className="px-5 py-4 text-sm leading-relaxed text-ink-mid font-body">
                    {product.shortdesc}
                  </p>
                </div>
              )}

              {/* Full description */}
              {product.description && (
                <div className="bg-white border border-border rounded-xl overflow-hidden">
                  <div className="bg-green/10 border-b border-border px-5 py-3">
                    <h2 className="text-sm font-bold text-green font-display uppercase tracking-wide">
                      About this Product
                    </h2>
                  </div>
                  <div
                    className="px-5 py-4 text-sm leading-relaxed text-ink-mid font-body prose prose-neutral max-w-none prose-a:text-gold prose-headings:font-display prose-headings:text-green"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}

              {/* Inquiry form */}
              <ProductInquiryForm
                productId={productId}
                productTitle={product.title}
              />

              {/* Share */}
              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://prideofpakistan.com/products/${productId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 border border-blue-200 bg-blue-50 px-2.5 py-1 rounded hover:bg-blue-100 transition-colors no-underline font-body"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Share
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Check out ${product.title} on Pride of Pakistan: https://prideofpakistan.com/products/${productId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-green-700 border border-green-200 bg-green-50 px-2.5 py-1 rounded hover:bg-green-100 transition-colors no-underline font-body"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
