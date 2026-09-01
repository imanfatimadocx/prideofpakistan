import { prisma } from "@/app/lib/prisma";
import Topbar from "@/app/components/layout/Topbar";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import PageHero from "@/app/components/shared/PageHero";
import MissionClient from "./MissionClient";

export const revalidate = 3600;

const DEFAULT_IMAGES = [
  {
    src: "/mission1.jpeg",
    caption: "Abdul Sattar Edhi, Founder of Edhi Foundation",
  },
  { src: "/mission2.jpeg", caption: "Dr. Abdul Qadeer Khan, Founder of KRL" },
  { src: "/mission3.jpeg", caption: "Sadiq Khan, Mayor of London" },
  { src: "/mission4.jpeg", caption: "Dr. Saud Anwar, State Senator USA" },
];

export default async function MissionPage() {
  const record = await prisma.pageContent.findUnique({
    where: { page: "mission" },
  });

  const content = (record?.content as Record<string, unknown> | null) ?? {};
  const images =
    (content._images as { src: string; caption: string }[] | undefined) ??
    DEFAULT_IMAGES;

  const data = {
    heading1:
      (content.heading1 as string) ||
      "Recognising Achievement Across the Globe",
    body1a:
      (content.body1a as string) ||
      "Pride of Pakistan seeks to highlight those individuals who have become celebrated in their respective fields and made successes of them across the globe. Having pride in such achievements is worthwhile - it is a useful way of exploring the many good, law-abiding, talented, and hard-working individuals who have taken what it means to be a Pakistani and shown the world the best parts of what Pakistan stands for.",
    body1b:
      (content.body1b as string) ||
      "We want to highlight and recognize these individuals so that others can see the diverse range of abilities and characters that have gone to represent Pakistan. We want to emphasize those who have done well, have established businesses for themselves and others, and have created wealth and developed enterprise wherever they are.",
    heading2:
      (content.heading2 as string) ||
      "Not Self-Promotion — Genuine Recognition",
    body2a:
      (content.body2a as string) ||
      "This is not about meaningless self-promotion but about highlighting the very best that Pakistanis have given the world and showing a positive side to what we do, and what we give to the communities in which we settle.",
    body2b:
      (content.body2b as string) ||
      "This website is intended to reflect these developments by highlighting the achievements of those individuals who have enhanced life wherever they are through their work, their actions and their lives. These are the people who are proud of what they have done - and we, in highlighting what they have done, are proud of them.",
    quote:
      (content.quote as string) ||
      "We want to ensure their activities are recognized.",
    body2c:
      (content.body2c as string) ||
      "Equally those who have become renowned figures in their chosen field - wherever in the world they may be. Pride of Pakistan recognises achievement without borders, exploring Pakistanis at home and across the global diaspora.",
    images,
  };

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <PageHero
          eyebrow="Our Mission"
          title="Exploring the Very Best Pakistan Has Given the World"
          subtitle="Pride in the achievements of a people, their actions, and their views."
        />
        <MissionClient data={data} />
      </main>
      <Footer />
    </>
  );
}
