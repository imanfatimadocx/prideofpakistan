import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import AdminNav from "@/app/components/admin/AdminNav";
import BusinessEditClient from "./BusinessEditClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BusinessEditPage({ params }: Props) {
  const { id } = await params;
  const bizId = Number(id);
  if (Number.isNaN(bizId)) notFound();

  const [biz, categories] = await Promise.all([
    prisma.business.findUnique({ where: { id: bizId } }),
    prisma.businessCategory.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!biz) notFound();

  const serialized = {
    id: biz.id,
    company_name: biz.company_name || "",
    email: biz.email || "",
    phone: biz.phone || "",
    city: biz.city || "",
    country: biz.country || "",
    address: biz.address || "",
    site_url: biz.site_url || "",
    shortdesc: biz.shortdesc || "",
    description: biz.description || "",
    status: biz.status ?? 0,
    feature: biz.feature ?? 0,
    category_id: biz.category_id ?? null,
    image: biz.image
      ? biz.image.startsWith("http")
        ? biz.image
        : biz.image.startsWith("uploads/")
          ? `/${biz.image}`
          : biz.image.startsWith("/")
            ? biz.image
            : `/uploads/${biz.image}`
      : null,
  };

  const cats = categories.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="flex min-h-screen bg-cream pt-14">
      <AdminNav />
      <main className="flex-1 p-4 lg:ml-64 pt-14 lg:pt-0 lg:p-8">
        <BusinessEditClient business={serialized} categories={cats} />
      </main>
    </div>
  );
}
