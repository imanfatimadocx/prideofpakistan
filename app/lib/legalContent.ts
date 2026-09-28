import { cache } from "react";
import { prisma } from "@/app/lib/prisma";

export const LEGAL_PAGES = {
  terms: { key: "legal_terms", path: "/terms-of-use", label: "Terms & Conditions" },
  privacy: { key: "legal_privacy", path: "/privacy-policy", label: "Privacy Policy" },
  disclaimer: { key: "legal_disclaimer", path: "/disclaimer", label: "Disclaimer" },
} as const;

export type LegalPageSlug = keyof typeof LEGAL_PAGES;

export function isLegalSlug(v: string): v is LegalPageSlug {
  return v in LEGAL_PAGES;
}

export interface LegalSection {
  id: string;
  heading: string;
  html: string;
  hidden?: boolean;
}

export interface LegalContent {
  title: string;
  intro: string; // rich HTML, optional
  sections: LegalSection[];
  updatedAt: string | null;
}

const EMAIL =
  '<a href="mailto:info@prideofpakistan.com">info@prideofpakistan.com</a>';

// Defaults = the text that was hard-coded on the site before, so nothing is lost.
export const LEGAL_DEFAULTS: Record<LegalPageSlug, LegalContent> = {
  terms: {
    title: "Terms of Use",
    intro: "",
    updatedAt: null,
    sections: [
      {
        id: "t1",
        heading: "1. Agreement between you and Pride of Pakistan",
        html: "<p>This is an Agreement between you and Pride of Pakistan website. Your use of the Pride of Pakistan website constitutes your acceptance of this Agreement and any information that you submit is correct.</p>",
      },
      {
        id: "t2",
        heading: "2. Pride of Pakistan may modify this Agreement",
        html: "<p>Pride of Pakistan reserves the right to change the terms and conditions under which it offers the Pride of Pakistan website.</p>",
      },
      {
        id: "t3",
        heading: "3. No unlawful use of the Pride of Pakistan website",
        html: "<p>You may not use the Pride of Pakistan website in any way that breaches any code of conduct or policy applicable to the Pride of Pakistan website. You may not use the Pride of Pakistan website in any manner that could damage, disable, overburden, or impair Pride of Pakistan web site or interfere with any other party's use of the Pride of Pakistan website.</p>",
      },
      {
        id: "t4",
        heading: "4. Materials you post or provide",
        html: "<p>Any material you post or provide for Pride of Pakistan website, you grant permission to use, copy, edit, modify, translate and reformat your submission. Pride of Pakistan will not pay you for your submission and may remove your submission at any time.</p>",
      },
      {
        id: "t5",
        heading: "5. Copyright and trademark notices",
        html: "<p>All contents of the Pride of Pakistan website are Copyright. The names of actual companies and products mentioned herein may be the trademarks of their respective owners.</p>",
      },
      {
        id: "t6",
        heading: "6. Other Acknowledgements",
        html: "<p>Pride of Pakistan may change or delete features in any way, at any time and for any reason. Pride of Pakistan will not guarantee that it will be error free and will not be liable for any omissions, inaccuracies, deletion, negligence, computer virus, delay or interruption in the transmission to the users or under any other cause of action.</p>",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    intro:
      "<p>Pride of Pakistan is committed to protecting your privacy and has developed this policy because we want you to feel confident about the privacy of your personal details.</p>",
    updatedAt: null,
    sections: [
      {
        id: "p1",
        heading: "Who this policy applies to",
        html: "<p>Pride of Pakistan is a general audience web site, intended for users of all ages and this Privacy Policy applies to data collection and usage on Pride of Pakistan web site.</p>",
      },
      {
        id: "p2",
        heading: "What we display",
        html: "<p>General information gathered from your given data is displayed on the Pride of Pakistan web site, but personal information, such as your date of birth, home or business address, telephone number and e-mail address will not be displayed, shared or disclosed to any other party unless we have your permission to do so.</p>",
      },
      {
        id: "p3",
        heading: "Sharing your information",
        html: "<p>Pride of Pakistan does not sell, rent or lease its profile list to third parties, however Pride of Pakistan may, from time to time, contact you about a particular offering that may be of interest to you.</p>",
      },
      {
        id: "p4",
        heading: "Where your data is stored",
        html: "<p>Personal information collected on this site may be stored and processed in Pakistan or any other country for hosting purposes only and you consent to any such transfer of information, and retention of data.</p>",
      },
      {
        id: "p5",
        heading: "Changes to this policy",
        html: "<p>Pride of Pakistan will occasionally update this Privacy Policy with the passage of time and will not be obligatory to inform you about the updating in the policy.</p>",
      },
      {
        id: "p6",
        heading: "Contact",
        html: `<p>Pride of Pakistan welcomes your comments regarding this Privacy Policy. If you believe that Pride of Pakistan has not adhered to this policy, please contact Pride of Pakistan by ${EMAIL}</p>`,
      },
    ],
  },
  disclaimer: {
    title: "Disclaimer",
    intro: "",
    updatedAt: null,
    sections: [
      {
        id: "d1",
        heading: "",
        html: "<p>Pride of Pakistan website is for information and social entertainment purposes only. Content posted on this site may contain errors or inaccuracies, as it is based on gossip, news, rumours and personal opinions.</p>",
      },
      {
        id: "d2",
        heading: "",
        html: "<p>We do not endorse the quality of any services, products, information or materials displayed, purchased, or obtained by you as a result of an advertisement or any other information on the Pride of Pakistan website. The Pride of Pakistan website reserves the right, without any obligation whatsoever to make improvements, to remove any listing / material or correct any error or omissions in any part of the website.</p>",
      },
      {
        id: "d3",
        heading: "",
        html: `<p>All images, videos, news and articles that appear on this website are copyright to their respective owners. If you own the rights to any of the images, videos, news, articles or any other material and do not wish them to appear on this site, please do not hesitate to contact ${EMAIL} for immediate removal.</p>`,
      },
      {
        id: "d4",
        heading: "",
        html: "<p>Pride of Pakistan website may contain links to other websites and the owner assumes no responsibility for the content of such websites. The owner of Pride of Pakistan website is not responsible for the accuracy, copyright compliance, legality or decency of material posted in any section of this site.</p>",
      },
    ],
  },
};

export const getLegalContent = cache(async function getLegalContent(
  slug: LegalPageSlug,
): Promise<LegalContent> {
  const fallback = LEGAL_DEFAULTS[slug];
  try {
    const row = await prisma.pageContent.findUnique({
      where: { page: LEGAL_PAGES[slug].key },
    });
    if (!row) return fallback;
    const c = row.content as Partial<LegalContent>;
    return {
      title: c.title || fallback.title,
      intro: c.intro ?? "",
      sections: Array.isArray(c.sections) ? c.sections : fallback.sections,
      updatedAt: c.updatedAt ?? row.updatedAt.toISOString(),
    };
  } catch {
    return fallback;
  }
});
