import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const entityType = searchParams.get("entityType");
  const entityId = Number(searchParams.get("entityId"));

  if (!entityType || !entityId) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { entityType, entityId, parentId: null, approved: true },
    orderBy: { createdAt: "desc" },
    include: {
      replies: {
        where: { approved: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Login required." }, { status: 401 });
  }

  const body = await req.json();
  const { entityType, entityId, content, parentId } = body;

  if (!entityType || !entityId || !content?.trim()) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorName: session.user.name ?? "Anonymous",
        authorEmail: session.user.email ?? "",
        userId: session.user.email ?? "",
        entityType,
        entityId: Number(entityId),
        parentId: parentId ? Number(parentId) : null,
        approved: true,
      },
      include: { replies: true },
    });
    return NextResponse.json(comment);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
