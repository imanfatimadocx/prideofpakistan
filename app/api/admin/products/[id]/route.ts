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
    await prisma.pakProduct.update({
      where: { id: Number(id) },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.categoryid !== undefined && {
          categoryid: Number(body.categoryid),
        }),
        ...(body.description !== undefined && {
          description: body.description,
        }),
        ...(body.shortdesc !== undefined && { shortdesc: body.shortdesc }),
        ...(body.status !== undefined && { status: Number(body.status) }),
        ...(body.feature !== undefined && { feature: Number(body.feature) }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.City !== undefined && { City: body.City }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.address !== undefined && { address: body.address }),
        ...(body.meta_title !== undefined && { meta_title: body.meta_title }),
        ...(body.meta_desc !== undefined && { meta_desc: body.meta_desc }),
        ...(body.meta_keyword !== undefined && {
          meta_keyword: body.meta_keyword,
        }),
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
    await prisma.pakProduct.delete({ where: { id: Number(id) } });
    await purgeHomepage();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
