import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import AdminNav from "@/app/components/admin/AdminNav";
import NewsEditClient from "./NewsEditClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NewsEditPage({ params }: Props) {
  const { id } = await params;
  const newsId = Number(id);
  if (Number.isNaN(newsId)) notFound();

  const item = await prisma.latestNews.findUnique({ where: { id: newsId } });
  if (!item) notFound();

  function resolveImg(img: string) {
    if (!img || img.trim() === "") return null;
    if (img.startsWith("http")) return img;
    if (img.startsWith("/")) return img;
    return `/uploads/${img}`;
  }

  const serialized = {
    id: item.id,
    title: item.title,
    description: item.description,
    shortdesc: item.shortdesc,
    smallimage: resolveImg(item.smallimage),
    status: item.status,
    images: (item.images as { src: string; caption: string }[] | null) ?? [],
  };

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminNav />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 p-4 lg:p-8">
        <NewsEditClient item={serialized} />
      </main>
    </div>
  );
}
