import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { isAdmin } from "@/app/lib/adminAuth";
import { plainText } from "@/app/lib/sanitize";

// PATCH { name?, status? }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const name = body.name !== undefined ? plainText(body.name, 100) : undefined;
  if (name === "") return NextResponse.json({ error: "Name is required." }, { status: 400 });

  await prisma.videoCategory.update({
    where: { id: Number(id) },
    data: {
      ...(name !== undefined && { name }),
      ...(body.status !== undefined && { status: body.status ? 1 : 0 }),
    },
  });
  return NextResponse.json({ success: true });
}

// DELETE - videos in this category become "Uncategorised" (category 0); nothing is deleted
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { id } = await params;
  const catId = Number(id);
  await prisma.$transaction([
    prisma.video.updateMany({ where: { category: catId }, data: { category: 0 } }),
    prisma.videoCategory.delete({ where: { id: catId } }),
  ]);
  return NextResponse.json({ success: true });
}
