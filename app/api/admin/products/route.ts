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
  const body = await req.json();
  try {
    const product = await prisma.pakProduct.create({
      data: {
        title: body.title?.trim() ?? "",
        categoryid: body.categoryid ? Number(body.categoryid) : 0,
        description: body.description?.trim() ?? "",
        shortdesc: body.shortdesc?.trim() ?? "",
        status: Number(body.status ?? 0),
        feature: Number(body.feature ?? 0),
        image: body.image ?? "",
        City: body.City?.trim() ?? "",
        email: body.email?.trim() ?? "",
        phone: body.phone?.trim() ?? "",
        address: body.address?.trim() ?? "",
        meta_title: body.meta_title?.trim() ?? "",
        meta_desc: body.meta_desc?.trim() ?? "",
        meta_keyword: body.meta_keyword?.trim() ?? "",
      },
    });
    return NextResponse.json({ success: true, id: product.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
