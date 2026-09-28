import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import { isAdmin } from "@/app/lib/adminAuth";

// PATCH { password: string } - admin sets a new password for a registered (public) user
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const password = typeof body.password === "string" ? body.password : "";

  if (password.length < 8)
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 },
    );
  if (password.length > 128)
    return NextResponse.json({ error: "Password is too long." }, { status: 400 });

  const user = await prisma.publicUser.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

  const hash = await bcrypt.hash(password, 12);
  await prisma.publicUser.update({ where: { id }, data: { password: hash } });

  return NextResponse.json({ success: true });
}
