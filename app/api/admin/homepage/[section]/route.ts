import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

async function adminCheck() {
  const session = await getServerSession(authOptions);
  return (session?.user as { role?: string })?.role === "ADMIN";
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> },
) {
  if (!(await adminCheck()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { section } = await params;
  const body = await req.json();

  try {
    await prisma.homepageContent.upsert({
      where: { section },
      update: { content: body.content },
      create: { section, content: body.content },
    });
    revalidatePath("/");
    const PAGE_PATHS: Record<string, string> = {
      page_whoiswho: "/who-is-who",
      page_products: "/products",
      page_businesses: "/business",
      page_news: "/news",
      page_stories: "/your-stories",
      page_contact: "/contact",
      page_submitprofile: "/submit-profile",
      page_listbusiness: "/list-business",
      page_pridetv: "/pride-tv",
    };
    if (PAGE_PATHS[section]) revalidatePath(PAGE_PATHS[section]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
