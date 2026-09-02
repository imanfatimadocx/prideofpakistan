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
    const biz = await prisma.business.create({
      data: {
        company_name: body.company_name?.trim() ?? "",
        email: body.email?.trim() ?? "",
        phone: body.phone?.trim() ?? "",
        city: body.city?.trim() ?? "",
        country: body.country?.trim() ?? "",
        address: body.address?.trim() ?? "",
        site_url: body.site_url?.trim() ?? "",
        shortdesc: body.shortdesc?.trim() ?? "",
        description: body.description?.trim() ?? "",
        status: Number(body.status ?? 0),
        feature: Number(body.feature ?? 0),
        category_id: body.category_id ? Number(body.category_id) : null,
        image: body.image ?? "",
        name: body.company_name?.trim() ?? "",
        user_id: 0,
        busniss_id: 0,
      },
    });
    return NextResponse.json({ success: true, id: biz.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
