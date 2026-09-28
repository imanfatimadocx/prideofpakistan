import { plainText } from "@/app/lib/sanitize";

export function teamData(body: Record<string, unknown>) {
  const fullname = plainText(body.fullname, 50);
  if (!fullname) return { error: "Name is required." } as const;
  const email = plainText(body.email, 200);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: "Email address doesn't look right." } as const;
  return {
    data: {
      fullname,
      designation: plainText(body.designation, 255),
      city: plainText(body.city, 100),
      country: plainText(body.country, 100),
      phone: plainText(body.phone, 50),
      email,
      image: plainText(body.image, 200),
      description: plainText(body.description, 5000),
      status: body.status ? 1 : 0,
    },
  } as const;
}
