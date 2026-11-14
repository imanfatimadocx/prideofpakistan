import { getPageContent } from "@/app/lib/pageContent";
import { getContactInfo } from "@/app/lib/contactInfo";
import ContactPageClient from "./ContactPageClient";
import { pageMeta } from "@/app/lib/seo";

export const metadata = pageMeta({
  title: "Contact Us",
  description: "Get in touch with Pride of Pakistan.",
  path: "/contact",
});

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const [hero, info] = await Promise.all([
    getPageContent("page_contact"),
    getContactInfo(),
  ]);
  return <ContactPageClient hero={hero} info={info} />;
}
