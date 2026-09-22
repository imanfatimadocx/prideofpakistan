import { prisma } from "@/app/lib/prisma";
import AdminNav from "@/app/components/admin/AdminNav";
import Link from "next/link";
import NewsTableClient from "./NewsTableClient";

export const revalidate = 3600;

export default async function AdminNewsPage() {
  const news = await prisma.latestNews.findMany({
    orderBy: { date_time: "desc" },
  });

  const serialized = news.map((n) => ({
    id: n.id,
    title: n.title,
    shortdesc: n.shortdesc,
    status: n.status,
    date_time: n.date_time.toISOString(),
    smallimage: n.smallimage
      ? n.smallimage.startsWith("http")
        ? n.smallimage
        : n.smallimage.startsWith("/")
          ? n.smallimage
          : `/uploads/${n.smallimage}`
      : null,
  }));

  return (
    <div className="flex min-h-screen bg-cream pt-14">
      <AdminNav />
      <main className="flex-1 p-4 lg:ml-64 lg:pt-0 lg:p-8">
        <div className="max-w-[1100px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="mb-1 text-2xl font-bold font-display text-green">
                Discussion Forum
              </h1>
              <p className="text-sm text-ink-muted font-body">
                {news.filter((n) => n.status === 0).length} draft ·{" "}
                {news.filter((n) => n.status === 1).length} published ·{" "}
                {news.length} total
              </p>
            </div>
            <Link
              href="/admin/news/new"
              className="bg-gold text-white px-5 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors no-underline"
            >
              + Write to Discussion Forum
            </Link>
          </div>
          <NewsTableClient news={serialized} />
        </div>
      </main>
    </div>
  );
}
