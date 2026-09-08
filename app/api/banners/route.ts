import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const now = new Date();
  try {
    const banners = await prisma.eventBanner.findMany({
      where: {
        active: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(banners);
  } catch {
    return NextResponse.json([]);
  }
}
