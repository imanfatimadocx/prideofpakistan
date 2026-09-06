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

    // Upload image to Cloudinary
    let imageUrl = "";
    if (imageFile) {
      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const result = await new Promise<{ secure_url: string }>(
          (resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  folder: "prideofpakistan/businesses",
                  resource_type: "image",
                },
                (err, result) =>
                  err ? reject(err) : resolve(result as { secure_url: string }),
              )
              .end(buffer);
          },
        );
        imageUrl = result.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary upload error:", uploadErr);
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
      },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Business submission error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
