import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { saveImage } from "@/app/lib/storage";
import { parseVideoUrl } from "@/app/lib/video";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const formData = await req.formData();
    const company_name = ((formData.get("company_name") as string) || "").slice(
      0,
      254,
    );
    const name = ((formData.get("name") as string) || "").slice(0, 254);
    const l_name = ((formData.get("l_name") as string) || "").slice(0, 254);
    const email = ((formData.get("email") as string) || "").slice(0, 254);
    const phone = ((formData.get("phone") as string) || "").slice(0, 254);
    const city = ((formData.get("city") as string) || "").slice(0, 254);
    const country = ((formData.get("country") as string) || "Pakistan").slice(
      0,
      254,
    );
    const site_url = ((formData.get("site_url") as string) || "").slice(0, 254);
    const shortdesc = ((formData.get("shortdesc") as string) || "").slice(
      0,
      254,
    );
    const company_description =
      (formData.get("company_description") as string) || "";

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
