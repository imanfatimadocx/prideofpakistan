import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import AdminNav from "@/app/components/admin/AdminNav";
import ProductEditClient from "./ProductsEditClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductEditPage({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);
  if (Number.isNaN(productId)) notFound();

  const [product, categories] = await Promise.all([
    prisma.pakProduct.findUnique({ where: { id: productId } }),
    prisma.productCategory.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const serialized = {
    id: product.id,
    title: product.title || "",
    categoryid: product.categoryid ?? 0,
    description: product.description || "",
    shortdesc: product.shortdesc || "",
    status: product.status ?? 0,
    feature: product.feature ?? 0,
    image: product.image
      ? product.image.startsWith("http")
        ? product.image
        : product.image.startsWith("pakproduct/")
          ? `/uploads/${product.image}` // ← fix
          : product.image.startsWith("/")
            ? product.image
            : `/uploads/${product.image}`
      : null,
    City: product.City || "",
    email: product.email || "",
    phone: product.phone || "",
    address: product.address || "",
    meta_title: product.meta_title || "",
    meta_desc: product.meta_desc || "",
    meta_keyword: product.meta_keyword || "",
  };

  return (
    <div className="flex min-h-screen bg-cream pt-14">
      <AdminNav />
      <main className="flex-1 lg:ml-64 lg:pt-0 p-4 lg:p-8">
        <ProductEditClient
          product={serialized}
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        />
      </main>
    </div>
  );
}
