import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 },
    );
  }

  try {
    await prisma.contactQuery.create({
      data: {
        name: name.trim().slice(0, 99),
        email: email.trim().slice(0, 254),
        subject: subject.trim().slice(0, 254),
        message: message.trim(),
      },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact submission error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
