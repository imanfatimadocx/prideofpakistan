import { prisma } from "@/app/lib/prisma";
import AdminNav from "@/app/components/admin/AdminNav";
import CommentsClient from "./CommentsClient";

export const revalidate = 0;

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: { replies: true },
  });

  const serialized = comments.map((c) => ({
    id: c.id,
    content: c.content,
    authorName: c.authorName,
    authorEmail: c.authorEmail,
    entityType: c.entityType,
    entityId: c.entityId,
    parentId: c.parentId,
    likes: c.likes,
    approved: c.approved,
    createdAt: c.createdAt.toISOString(),
    replyCount: c.replies.length,
  }));

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminNav />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 p-4 lg:p-8">
        <div className="max-w-[1100px]">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-green mb-1">
              Comments
            </h1>
            <p className="text-sm text-ink-muted font-body">
              {comments.length} total · across profiles, businesses, news and
              stories
            </p>
          </div>
          <CommentsClient comments={serialized} />
        </div>
      </main>
    </div>
  );
}
