import { plainText } from "@/app/lib/sanitize";
import { externalUrl } from "@/app/lib/images";

export function sponsorData(body: Record<string, unknown>) {
  const title = plainText(body.title, 255);
  if (!title) return { error: "Sponsor name is required." } as const;
  const website = externalUrl(plainText(body.website, 500)) ?? "";
  if (website && !/^https?:\/\/[^\s.]+\.[^\s]+$/i.test(website))
    return { error: "Website address doesn't look right." } as const;
  return {
    data: {
      title,
      shortdesc: plainText(body.shortdesc, 2000),
      smallimage: plainText(body.smallimage, 255),
      website,
      status: body.status ? 1 : 0,
    },
  } as const;
}
