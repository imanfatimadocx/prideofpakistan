import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { isAdmin } from "@/app/lib/adminAuth";
import { teamData } from "./validate";

export async function POST(req: NextRequest) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const parsed = teamData(await req.json().catch(() => ({})));
  if ("error" in parsed) return NextResponse.json(parsed, { status: 400 });
  const member = await prisma.prideTeam.create({ data: parsed.data });
  return NextResponse.json({ id: member.id });
}
