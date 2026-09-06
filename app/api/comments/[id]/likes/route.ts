import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const commentId = Number(id);

  // Use session if logged in, otherwise use IP as identifier
  const session = await getServerSession(authOptions);
  const identifier =
    session?.user?.email ?? req.headers.get("x-forwarded-for") ?? "anonymous";

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const likedBy = (comment.likedBy as string[]) ?? [];
    const alreadyLiked = likedBy.includes(identifier);

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: {
        likes: alreadyLiked ? comment.likes - 1 : comment.likes + 1,
        likedBy: alreadyLiked
          ? likedBy.filter((u) => u !== identifier)
          : [...likedBy, identifier],
      },
    });

    return NextResponse.json({ likes: updated.likes, liked: !alreadyLiked });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
