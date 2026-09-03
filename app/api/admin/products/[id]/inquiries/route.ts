import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

async function adminCheck() {
  const session = await getServerSession(authOptions);
  return (session?.user as { role?: string })?.role === "ADMIN";
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await adminCheck()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { id } = await params;
  const inquiries = await prisma.productInquiry.findMany({
    where: { productId: Number(id) },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(inquiries);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await adminCheck()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { id } = await params;
  await prisma.productInquiry.updateMany({
    where: { productId: Number(id) },
    data: { read: true },
  });
  return NextResponse.json({ success: true });
}
