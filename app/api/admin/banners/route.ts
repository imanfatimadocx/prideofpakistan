import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

async function adminCheck() {
  const session = await getServerSession(authOptions);
  return (session?.user as { role?: string })?.role === "ADMIN";
}

export async function GET() {
  if (!(await adminCheck()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const banners = await prisma.eventBanner.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(banners);
}

export async function POST(req: NextRequest) {
  if (!(await adminCheck()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const body = await req.json();
  try {
    const banner = await prisma.eventBanner.create({
      data: {
        type: body.type,
        title: body.title?.trim() || null,
        message: body.message.trim(),
        image: body.image || null,
        ctaLabel: body.ctaLabel?.trim() || null,
        ctaLink: body.ctaLink?.trim() || null,
        color: body.color || "green",
        active: body.active ?? true,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
      },
    });
    return NextResponse.json({ success: true, id: banner.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
