import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

async function adminCheck() {
  const session = await getServerSession(authOptions);
  return (session?.user as { role?: string })?.role === "ADMIN";
}

export async function POST(req: NextRequest) {
  if (!(await adminCheck()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { name } = await req.json();
  const cat = await prisma.businessCategory.create({
    data: { name: name.trim(), status: 1 },
  });
  return NextResponse.json({ id: cat.id });
}
