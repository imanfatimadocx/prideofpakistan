import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { isAdmin } from "@/app/lib/adminAuth";
import { plainText } from "@/app/lib/sanitize";

// POST { name } - create a category (added at the end of the list)
export async function POST(req: NextRequest) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const name = plainText(body.name, 100);
  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });

  const last = await prisma.videoCategory.findFirst({ orderBy: { sortOrder: "desc" } });
  if (!last) {
    // First category ever: existing videos carry a leftover default (1) from the
    // old site. Mark them Uncategorised so they don't all land in this new category.
    await prisma.video.updateMany({ data: { category: 0 } });
  }
  const cat = await prisma.videoCategory.create({
    data: { name, status: 1, sortOrder: (last?.sortOrder ?? 0) + 1 },
  });
  return NextResponse.json({ id: cat.id, sortOrder: cat.sortOrder });
}

// PUT { order: number[] } - save a new display order
export async function PUT(req: NextRequest) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const order: number[] = Array.isArray(body.order)
    ? body.order.map(Number).filter((n: number) => Number.isInteger(n))
    : [];
  await prisma.$transaction(
    order.map((id, i) =>
      prisma.videoCategory.update({ where: { id }, data: { sortOrder: i + 1 } }),
    ),
  );
  return NextResponse.json({ success: true });
}
