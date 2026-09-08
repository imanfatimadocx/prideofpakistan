import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

async function adminCheck() {
  const session = await getServerSession(authOptions);
  return (session?.user as { role?: string })?.role === "ADMIN";
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await adminCheck()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { id } = await params;
  const body = await req.json();
  try {
    await prisma.eventBanner.update({
      where: { id: Number(id) },
      data: {
        ...(body.type !== undefined && { type: body.type }),
        ...(body.title !== undefined && { title: body.title || null }),
        ...(body.message !== undefined && { message: body.message }),
        ...(body.image !== undefined && { image: body.image || null }),
        ...(body.ctaLabel !== undefined && { ctaLabel: body.ctaLabel || null }),
        ...(body.ctaLink !== undefined && { ctaLink: body.ctaLink || null }),
        ...(body.color !== undefined && { color: body.color }),
        ...(body.active !== undefined && { active: body.active }),
        ...(body.startDate !== undefined && {
          startDate: new Date(body.startDate),
        }),
        ...(body.endDate !== undefined && { endDate: new Date(body.endDate) }),
      },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await adminCheck()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { id } = await params;
  await prisma.eventBanner.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
