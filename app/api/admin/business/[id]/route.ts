import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

async function adminCheck() {
  const session = await getServerSession(authOptions);
  return (session?.user as { role?: string })?.role === "ADMIN";
}

async function purgeHomepage() {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  await fetch(
    `${baseUrl}/api/revalidate?secret=${process.env.REVALIDATE_SECRET}`,
    {
      method: "POST",
    },
  ).catch(() => {});
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
    await prisma.business.update({
      where: { id: Number(id) },
      data: {
        ...(body.company_name !== undefined && {
          company_name: body.company_name,
        }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.city !== undefined && { city: body.city }),
        ...(body.country !== undefined && { country: body.country }),
        ...(body.address !== undefined && { address: body.address }),
        ...(body.site_url !== undefined && { site_url: body.site_url }),
        ...(body.shortdesc !== undefined && { shortdesc: body.shortdesc }),
        ...(body.description !== undefined && {
          description: body.description,
        }),
        ...(body.status !== undefined && { status: Number(body.status) }),
        ...(body.feature !== undefined && { feature: Number(body.feature) }),
        ...(body.category_id !== undefined && {
          category_id: body.category_id ? Number(body.category_id) : null,
        }),
        ...(body.image !== undefined && { image: body.image }),
      },
    });
    await purgeHomepage();
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
  try {
    await prisma.business.delete({ where: { id: Number(id) } });
    await purgeHomepage();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
