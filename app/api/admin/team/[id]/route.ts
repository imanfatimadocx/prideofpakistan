import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { isAdmin } from "@/app/lib/adminAuth";
import { teamData } from "../validate";

// PATCH - full update, or { status } alone to show/hide
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  if (Object.keys(body).length === 1 && "status" in body) {
    await prisma.prideTeam.update({
      where: { id: Number(id) },
      data: { status: body.status ? 1 : 0 },
    });
    return NextResponse.json({ success: true });
  }

  const parsed = teamData(body);
  if ("error" in parsed) return NextResponse.json(parsed, { status: 400 });
  await prisma.prideTeam.update({ where: { id: Number(id) }, data: parsed.data });
  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { id } = await params;
  await prisma.prideTeam.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
