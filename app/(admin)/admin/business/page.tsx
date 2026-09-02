import { prisma } from "@/app/lib/prisma";
import AdminNav from "@/app/components/admin/AdminNav";
import Link from "next/link";
import BusinessTableClient from "./BusinessTableClient";

export const revalidate = 0;

export default async function AdminBusinessPage() {
  const [businesses, categories] = await Promise.all([
    prisma.business.findMany({
      orderBy: { company_name: "asc" },
      select: {
        id: true,
        company_name: true,
        email: true,
        city: true,
        country: true,
        status: true,
        image: true,
        feature: true,
        category_id: true,
        category: { select: { name: true } },
      },
    }),
    prisma.businessCategory.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const serialized = businesses.map((b) => ({
    id: b.id,
    company_name: b.company_name || "—",
    email: b.email || "",
    city: b.city || "",
    country: b.country || "",
    status: b.status ?? 0,
    image: b.image
      ? b.image.startsWith("http")
        ? b.image
        : b.image.startsWith("uploads/")
          ? `/${b.image}`
          : b.image.startsWith("/")
            ? b.image
            : `/uploads/${b.image}`
      : null,
    feature: b.feature ?? 0,
    category_id: b.category_id ?? null,
    categoryname: b.category?.name ?? null,
  }));

  const cats = categories.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="flex min-h-screen bg-cream pt-14">
      <AdminNav />
      <main className="flex-1 p-4 lg:ml-64 pt-14 lg:pt-0 lg:p-8">
        <div className="max-w-[1200px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="mb-1 text-2xl font-bold font-display text-green">
                Businesses
              </h1>
              <p className="text-sm text-ink-muted font-body">
                {businesses.filter((b) => b.status === 0).length} pending ·{" "}
                {businesses.filter((b) => b.feature === 1).length} featured ·{" "}
                {businesses.length} total
              </p>
            </div>
            <Link
              href="/admin/business/new"
              className="bg-gold text-white px-5 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors no-underline"
            >
              + Add Business
            </Link>
          </div>
          <BusinessTableClient businesses={serialized} categories={cats} />
        </div>
      </main>
    </div>
  );
}
