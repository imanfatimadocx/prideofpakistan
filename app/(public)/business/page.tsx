import { prisma } from "@/app/lib/prisma";
import Topbar from "@/app/components/layout/Topbar";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import BusinessPageClient from "./BusinessPageClient";

export const revalidate = 3600;

function resolveImage(img: string | null): string | null {
  if (!img || img.trim() === "") return null;
  if (img.startsWith("http")) return img;
  if (img.startsWith("/")) return img;
  if (img.startsWith("uploads/")) return `/${img}`;
  return `/uploads/${img}`;
}

export interface BusinessCard {
  id: number;
  company_name: string;
  shortdesc: string;
  city: string;
  country: string;
  image: string | null;
  category_id: number | null;
  categoryname: string | null;
}

export interface BizCategory {
  id: number;
  name: string;
  count: number;
}

export default async function BusinessPage() {
  const [cats, rows] = await Promise.all([
    prisma.businessCategory.findMany({
      where: { status: 1 },
      orderBy: { name: "asc" },
    }),
    prisma.business.findMany({
      where: { status: 1 },
      orderBy: { company_name: "asc" },
      select: {
        id: true,
        company_name: true,
        shortdesc: true,
        city: true,
        country: true,
        image: true,
        category_id: true,
        category: { select: { name: true } },
      },
    }),
  ]);

  const businesses: BusinessCard[] = rows.map((r) => ({
    id: r.id,
    company_name: r.company_name || "Unknown",
    shortdesc: r.shortdesc || "",
    city: r.city || "",
    country: r.country || "",
    image: resolveImage(r.image || null),
    category_id: r.category_id,
    categoryname: r.category?.name ?? null,
  }));

  const categories: BizCategory[] = cats
    .map((c) => ({
      id: c.id,
      name: c.name,
      count: rows.filter((r) => r.category_id === c.id).length,
    }))
    .filter((c) => c.count > 0);

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <BusinessPageClient businesses={businesses} categories={categories} />
      </main>
      <Footer />
    </>
  );
}
