import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { saveImage } from "@/app/lib/storage";
import { parseVideoUrl } from "@/app/lib/video";
import { stripTags } from "@/app/lib/sanitize";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const formData = await req.formData();
    const company_name = stripTags(formData.get("company_name"), 254);
    const name = stripTags(formData.get("name"), 254);
    const l_name = stripTags(formData.get("l_name"), 254);
    const email = stripTags(formData.get("email"), 254);
    const phone = stripTags(formData.get("phone"), 254);
    const city = stripTags(formData.get("city"), 254);
    const country = stripTags(formData.get("country"), 254) || "Pakistan";
    const site_url = stripTags(formData.get("site_url"), 254);
    const shortdesc = stripTags(formData.get("shortdesc"), 254);
    const company_description = stripTags(formData.get("company_description"), 10000);

    const videoRaw = ((formData.get("video_url") as string) || "").trim();
    const video = videoRaw ? parseVideoUrl(videoRaw) : null;
    if (videoRaw && !video) {
      return NextResponse.json(
        { error: "The video link must be a YouTube or Vimeo link." },
        { status: 400 },
      );
    }

    const imageFileRaw = formData.get("image");
    const imageFile =
      imageFileRaw instanceof File && imageFileRaw.size > 0
        ? imageFileRaw
        : null;

    if (!company_name || !name || !email || !city || !shortdesc) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Save image to our own storage
    let imageUrl = "";
    if (imageFile) {
      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        imageUrl = await saveImage(buffer, "businesses");
      } catch (uploadErr) {
        console.error("Image save error:", uploadErr);
        // Continue without image
      }
    }

    await prisma.business.create({
      data: {
        company_name,
        name,
        l_name,
        email: (session?.user?.email ?? email).slice(0, 254),
        phone,
        city,
        country,
        site_url,
        shortdesc,
        company_description,
        image: imageUrl.slice(0, 299), // org_img col is VarChar(300)
        status: 0,
        feature: 0,
        user_id: 0,
        busniss_id: 0,
        title: "",
        description: "",
        address: "",
        no_of_emplys: "",
        keywords: "",
        org_img: "",
        lng: "",
        lat: "",
        video_url: video?.watchUrl ?? "",
      },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Business submission error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
