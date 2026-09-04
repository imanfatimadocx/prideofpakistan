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
  const news = await prisma.latestNews.findMany({
    orderBy: { date_time: "desc" },
  });
  return NextResponse.json(news);
}

export async function POST(req: NextRequest) {
  if (!(await adminCheck()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const body = await req.json();
  try {
    const item = await prisma.latestNews.create({
      data: {
        title: body.title?.trim() ?? "",
        description: body.description?.trim() ?? "",
        shortdesc: body.shortdesc?.trim() ?? "",
        smallimage: body.smallimage ?? "",
        org_img: body.org_img ?? "",
        status: Number(body.status ?? 0),
        images: body.images ?? [],
      },
    });
    return NextResponse.json({ success: true, id: item.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
