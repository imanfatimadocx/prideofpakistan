import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import AdminNav from "@/app/components/admin/AdminNav";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export const revalidate = 0;

export default async function ProductInquiriesPage({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);
  if (Number.isNaN(productId)) notFound();

  const [product, inquiries] = await Promise.all([
    prisma.pakProduct.findUnique({
      where: { id: productId },
      select: { title: true },
    }),
    prisma.productInquiry.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!product) notFound();

  return (
    <div className="flex min-h-screen bg-cream pt-14">
      <AdminNav />
      <main className="flex-1 lg:ml-64 lg:pt-0 p-4 lg:p-8">
        <div className="max-w-[800px]">
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/admin/products"
              className="text-sm no-underline text-gold font-body hover:underline"
            >
              ← Products
            </Link>
            <span className="text-ink-muted">/</span>
            <Link
              href={`/admin/products/${productId}/edit`}
              className="text-sm no-underline text-gold font-body hover:underline"
            >
              {product.title}
            </Link>
            <span className="text-ink-muted">/</span>
            <h1 className="font-display text-xl font-bold text-green">
              Enquiries
            </h1>
          </div>

          {inquiries.length === 0 ? (
            <div className="bg-white border border-border rounded-xl p-10 text-center">
              <p className="text-sm text-ink-muted font-body">
                No enquiries yet for this product.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-ink-muted font-body">
                {inquiries.length} enquir{inquiries.length === 1 ? "y" : "ies"}
              </p>
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className={`bg-white border rounded-xl p-5 space-y-3 ${!inq.read ? "border-gold/40 shadow-sm" : "border-border"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-ink-dark font-body">
                          {inq.name}
                        </p>
                        {!inq.read && (
                          <span className="text-[10px] font-bold bg-gold text-white px-2 py-0.5 rounded-full font-body">
                            New
                          </span>
                        )}
                      </div>
                      <a
                        href={`mailto:${inq.email}`}
                        className="text-xs text-gold hover:underline no-underline font-body"
                      >
                        {inq.email}
                      </a>
                    </div>
                    <p className="text-xs text-ink-muted font-body flex-shrink-0">
                      {new Date(inq.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <p className="text-sm text-ink-mid font-body leading-relaxed">
                    {inq.message}
                  </p>
                  <a
                    href={`mailto:${inq.email}?subject=Re: ${product.title}&body=Dear ${inq.name},%0D%0A%0D%0A`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold no-underline hover:underline font-body"
                  >
                    Reply by email →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
