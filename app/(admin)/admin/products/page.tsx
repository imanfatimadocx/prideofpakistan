import { prisma } from "@/app/lib/prisma";
import AdminNav from "@/app/components/admin/AdminNav";
import Link from "next/link";
import ProductsTableClient from "./ProductsTableClient";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.pakProduct.findMany({
      orderBy: { title: "asc" },
      select: {
        id: true,
        title: true,
        status: true,
        feature: true,
        image: true,
        categoryid: true,
        category: { select: { name: true } },
        _count: { select: { inquiries: true } },
      },
    }),
    prisma.productCategory.findMany({ orderBy: { name: "asc" } }),
  ]);

  const serialized = products.map((p) => ({
    id: p.id,
    title: p.title || "—",
    status: p.status ?? 0,
    feature: p.feature ?? 0,
    image: p.image
      ? p.image.startsWith("http")
        ? p.image
        : p.image.startsWith("pakproduct/")
          ? `/uploads/${p.image}` // ← fix
          : p.image.startsWith("/")
            ? p.image
            : `/uploads/${p.image}`
      : null,
    categoryid: p.categoryid ?? 0,
    categoryname: p.category?.name ?? null,
    inquiryCount: p._count.inquiries,
  }));

  return (
    <div className="flex min-h-screen bg-cream pt-14">
      <AdminNav />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 p-4 lg:p-8">
        <div className="max-w-[1200px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-green mb-1">
                Pakistani Products
              </h1>
              <p className="text-sm text-ink-muted font-body">
                {products.filter((p) => p.status === 0).length} pending ·{" "}
                {products.filter((p) => p.feature === 1).length} featured ·{" "}
                {products.length} total
              </p>
            </div>
            <Link
              href="/admin/products/new"
              className="bg-gold text-white px-5 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors no-underline"
            >
              + Add Product
            </Link>
          </div>
          <ProductsTableClient
            products={serialized}
            categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          />
        </div>
      </main>
    </div>
  );
}
