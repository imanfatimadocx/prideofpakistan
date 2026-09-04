import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Login required." }, { status: 401 });

  const body = await req.json();
  if (!body.title?.trim() || !body.content?.trim()) {
    return NextResponse.json(
      { error: "Title and content are required." },
      { status: 400 },
    );
  }

  try {
    await prisma.userStory.create({
      data: {
        title: body.title.trim(),
        content: body.content.trim(),
        shortdesc: body.shortdesc?.trim() ?? "",
        image: body.image ?? null,
        images: body.images ?? [],
        authorId: session.user.email ?? "unknown",
        authorName: session.user.name ?? "Anonymous",
        authorEmail: session.user.email ?? "",
        status: "pending",
      },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
