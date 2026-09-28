import { prisma } from "@/app/lib/prisma";

export const CONTACT_INFO_KEY = "contact_info";

export type ContactItemType = "email" | "phone" | "url" | "text";
export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "youtube"
  | "linkedin"
  | "tiktok"
  | "whatsapp"
  | "other";

export interface ContactItem {
  id: string;
  label: string;
  value: string;
  type: ContactItemType;
  hidden?: boolean;
}

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  hidden?: boolean;
}

export interface ContactInfo {
  introHeading: string;
  introText: string;
  infoTitle: string;
  items: ContactItem[];
  responseTitle: string;
  responseText: string;
  socialTitle: string;
  socials: SocialLink[];
  formHeading: string;
  formSubtext: string;
  formEmail: string;
  successHeading: string;
  successText: string;
}

export const CONTACT_DEFAULTS: ContactInfo = {
  introHeading: "We'd Love to Hear From You",
  introText:
    "Pride of Pakistan is a growing movement. We welcome individuals, businesses, organisations, and communities who want to be part of redefining how the world sees Pakistan.",
  infoTitle: "Contact Information",
  items: [
    { id: "c1", label: "General Enquiries", value: "info@prideofpakistan.com", type: "email" },
    { id: "c2", label: "Marketing & Sponsorships", value: "marketing@prideofpakistan.com", type: "email" },
    { id: "c3", label: "Website", value: "www.prideofpakistan.com", type: "url" },
  ],
  responseTitle: "Response Time",
  responseText: "We aim to respond to all enquiries as soon as possible",
  socialTitle: "Follow Us",
  socials: [
    { id: "s1", platform: "facebook", label: "Facebook", url: "https://www.facebook.com/prideofpakistan" },
  ],
  formHeading: "Send a Message",
  formSubtext: "We aim to respond within 2 working days.",
  formEmail: "info@prideofpakistan.com",
  successHeading: "Message Sent!",
  successText: "Thank you for reaching out. We'll be in touch shortly.",
};

export async function getContactInfo(): Promise<ContactInfo> {
  try {
    const row = await prisma.pageContent.findUnique({
      where: { page: CONTACT_INFO_KEY },
    });
    if (!row) return CONTACT_DEFAULTS;
    return { ...CONTACT_DEFAULTS, ...(row.content as Partial<ContactInfo>) };
  } catch {
    return CONTACT_DEFAULTS;
  }
}
