import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { isAdmin } from "@/app/lib/adminAuth";
import { adData } from "@/app/lib/ads";

// PATCH - full update, or { status } alone to pause/resume
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json().catch(() => ({}));

  try {
    if (Object.keys(body).length === 1 && "status" in body) {
      await prisma.advertisement.update({ where: { id }, data: { status: body.status ? 1 : 0 } });
      return NextResponse.json({ success: true });
    }
    const parsed = adData(body);
    if ("error" in parsed) return NextResponse.json(parsed, { status: 400 });
    await prisma.advertisement.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update ad failed:", err);
    return NextResponse.json({ error: "Could not save this ad." }, { status: 500 });
  }
}

// DELETE - removes the ad and its statistics
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    await prisma.advertisement.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Could not delete this ad." }, { status: 500 });
  }
}
