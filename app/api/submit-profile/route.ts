import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { saveImage } from "@/app/lib/storage";
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ error: "Login required." }, { status: 401 });

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const Profession = formData.get("Profession") as string;
    const City = (formData.get("City") as string) || "";
    const Country = (formData.get("Country") as string) || "Pakistan";
    const Email = formData.get("Email") as string;
    const shortdesc = formData.get("shortdesc") as string;
    const submitterEmail =
      (formData.get("submitterEmail") as string) || session.user.email || "";
    const imageFile = formData.get("image") as File | null;

    if (!title || !Profession || !Email || !shortdesc) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Save image to our own storage
    let imageUrl = "";
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      imageUrl = await saveImage(buffer, "profiles");
    }

    const now = new Date();
    await prisma.hallOfFame.create({
      data: {
        title,
        Profession,
        City,
        Country,
        Email,
        shortdesc,
        image: imageUrl,
        submitterEmail: submitterEmail,
        status: 0,
        feature: 0,
        d: String(now.getDate()),
        m: String(now.getMonth() + 1),
        y: now.getFullYear(),
        user_id: 0,
        cat: 1,
        claim: 0,
        facebook: "",
        linkedin: "",
        threads: "",
        claim_by: 0,
        claim_comments: "",
        video_intro: "",
        edu_degree: "",
        edu_year: "",
        edu_institute: "",
        edu_desc: "",
        contact_allow: 0,
        comments_alow: 0,
        allow_fb_page: 0,
        org_img: "",
        thumb_img: "",
        meta_title: "",
        meta_desc: "",
        meta_keyword: "",
        address: "",
        Telephone: "",
        Mobile: "",
        Interests: "",
        description: "",
        phonenumber: "",
      },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Profile submission error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
