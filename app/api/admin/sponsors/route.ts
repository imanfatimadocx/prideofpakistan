import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { isAdmin } from "@/app/lib/adminAuth";
import { sponsorData } from "./validate";

// POST - create a sponsor (added at the end)
export async function POST(req: NextRequest) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const parsed = sponsorData(await req.json().catch(() => ({})));
  if ("error" in parsed) return NextResponse.json(parsed, { status: 400 });

  const last = await prisma.sponsor.findFirst({ orderBy: { sortOrder: "desc" } });
  const sponsor = await prisma.sponsor.create({
    data: { ...parsed.data, sortOrder: (last?.sortOrder ?? 0) + 1 },
  });
  return NextResponse.json({ id: sponsor.id });
}

// PUT { order: number[] } - save display order
export async function PUT(req: NextRequest) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const order: number[] = Array.isArray(body.order)
    ? body.order.map(Number).filter((n: number) => Number.isInteger(n))
    : [];
  await prisma.$transaction(
    order.map((id, i) => prisma.sponsor.update({ where: { id }, data: { sortOrder: i + 1 } })),
  );
  return NextResponse.json({ success: true });
}
