import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { isAdmin } from "@/app/lib/adminAuth";

// DELETE - admin permanently removes a registered (public) user account.
// Their comments and stories stay on the site under the name they used.
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const user = await prisma.publicUser.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

  try {
    await prisma.publicUser.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete user failed:", err);
    return NextResponse.json({ error: "Could not delete this user." }, { status: 500 });
  }
}
