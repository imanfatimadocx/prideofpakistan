import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { name, email, message } = await req.json();

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 },
    );
  }

  try {
    await prisma.productInquiry.create({
      data: {
        productId: Number(id),
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
