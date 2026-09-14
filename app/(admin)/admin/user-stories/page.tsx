import { prisma } from "@/app/lib/prisma";
import AdminNav from "@/app/components/admin/AdminNav";
import UserStoriesClient from "./UserStoriesClient";

export const revalidate = 0;

export default async function AdminUserStoriesPage() {
  const stories = await prisma.userStory.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serialized = stories.map((s) => ({
    id: s.id,
    title: s.title,
    shortdesc: s.shortdesc,
    authorName: s.authorName,
    authorEmail: s.authorEmail,
    status: s.status,
    createdAt: s.createdAt.toISOString(),
    image: s.image
      ? s.image.startsWith("http")
        ? s.image
        : s.image.startsWith("/")
          ? s.image
          : `/uploads/${s.image}`
      : null,
  }));

  return (
    <div className="flex min-h-screen bg-cream pt-14">
      <AdminNav />
      <main className="flex-1 p-4 lg:ml-64 lg:pt-0 lg:p-8">
        <div className="max-w-[1100px]">
          <div className="mb-6">
            <h1 className="mb-1 text-2xl font-bold font-display text-green">
              Your Stories
            </h1>
            <p className="text-sm text-ink-muted font-body">
              {stories.filter((s) => s.status === "pending").length} pending ·{" "}
              {stories.filter((s) => s.status === "approved").length} approved ·{" "}
              {stories.length} total
            </p>
          </div>
          <UserStoriesClient stories={serialized} />
        </div>
      </main>
    </div>
  );
}
