import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    // Upload image to Cloudinary
    let imageUrl = "";
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const result = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "prideofpakistan/profiles", resource_type: "image" },
              (err, result) =>
                err ? reject(err) : resolve(result as { secure_url: string }),
            )
            .end(buffer);
        },
      );
      imageUrl = result.secure_url;
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
        twitter: "",
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
