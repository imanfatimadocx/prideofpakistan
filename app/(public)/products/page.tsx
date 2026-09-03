import { prisma } from "@/app/lib/prisma";
import Topbar from "@/app/components/layout/Topbar";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import ProductsPageClient from "./ProductsPageClient";

export const revalidate = 3600;

function resolveImage(img: string | null): string | null {
  if (!img || img.trim() === "") return null;
  if (img.startsWith("http")) return img;
  if (img.startsWith("/")) return img;
  if (img.startsWith("uploads/")) return `/${img}`;
  if (img.startsWith("pakproduct/")) return `/uploads/${img}`; // ← fix
  return `/uploads/${img}`;
}

export interface ProductCard {
  id: number;
  title: string;
  shortdesc: string;
  image: string | null;
  categoryid: number;
  categoryname: string | null;
}

export interface ProdCategory {
  id: number;
  name: string;
  count: number;
}

export default async function ProductsPage() {
  const [cats, rows] = await Promise.all([
    prisma.productCategory.findMany({
      where: { status: 1 },
      orderBy: { name: "asc" },
    }),
    prisma.pakProduct.findMany({
      where: { status: 1 },
      orderBy: { title: "asc" },
      select: {
        id: true,
        title: true,
        shortdesc: true,
        image: true,
        categoryid: true,
        category: { select: { name: true } },
      },
    }),
  ]);

  const products: ProductCard[] = rows.map((r) => ({
    id: r.id,
    title: r.title || "Unknown",
    shortdesc: r.shortdesc || "",
    image: resolveImage(r.image || null),
    categoryid: r.categoryid,
    categoryname: r.category?.name ?? null,
  }));

  const categories: ProdCategory[] = cats
    .map((c) => ({
      id: c.id,
      name: c.name,
      count: rows.filter((r) => r.categoryid === c.id).length,
    }))
    .filter((c) => c.count > 0);

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <ProductsPageClient products={products} categories={categories} />
      </main>
      <Footer />
    </>
  );
}
