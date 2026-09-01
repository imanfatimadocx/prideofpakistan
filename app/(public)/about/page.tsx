import { prisma } from "@/app/lib/prisma";
import Topbar from "@/app/components/layout/Topbar";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import PageHero from "@/app/components/shared/PageHero";
import AboutClient from "./AboutClient";

export const revalidate = 3600;

const DEFAULT_IMAGES = [
  {
    src: "/5.jpeg",
    caption:
      "Imtiaz Ahmad interviewing Prime Minister of Pakistan Zulfikar Ali Bhutto",
  },
  {
    src: "/2.jpeg",
    caption:
      "Imtiaz Ahmad receiving award from HRH Prince Charles (now King Charles III)",
  },
  {
    src: "/3.jpeg",
    caption: "Imtiaz Ahmad with Prime Minister of United Kingdom John Major",
  },
  {
    src: "/4.jpeg",
    caption:
      "From left: Hanif Raja, Wajid S. U. Hussan, Tony Blair, M. Shoaib, Imtiaz Ahmad and M Sarwar MP",
  },
  {
    src: "/1.jpeg",
    caption: "Imtiaz Ahmad with Mohammad Sarwar, Governor of Punjab",
  },
  {
    src: "/6.jpeg",
    caption: "Imtiaz Ahmad with Mohammad Sarwar, Governor of Punjab",
  },
];

export default async function AboutPage() {
  const record = await prisma.pageContent.findUnique({
    where: { page: "about" },
  });

  const content = (record?.content as Record<string, unknown> | null) ?? {};
  const images =
    (content._images as { src: string; caption: string }[] | undefined) ??
    DEFAULT_IMAGES;

  const data = {
    heading1: (content.heading1 as string) || "About the Founder",
    body1a:
      (content.body1a as string) ||
      "Imtiaz Ahmad, founder of Pride of Pakistan, is a seasoned journalist and media professional with decades of experience dedicated to promoting the positive image of Pakistan and its people. Over the course of his career, he has interviewed several influential figures, including the late Zulfikar Ali Bhutto, former Prime Minister of Pakistan.",
    body1b:
      (content.body1b as string) ||
      "Imtiaz has also had the honour of engaging with notable international personalities, including receiving an award from HRH Prince Charles (now King Charles III) and meeting former UK Prime Ministers Tony Blair and John Major at official events. These experiences have helped shape his global perspective and reinforce his commitment to building bridges between Pakistan and the wider world.",
    quote:
      (content.quote as string) || "Let's change the narrative - together.",
    body1c:
      (content.body1c as string) ||
      "With Pride of Pakistan, Imtiaz set out to challenge widespread misconceptions about Pakistan - particularly those related to extremism and intolerance - by showcasing the country's true character: one rooted in diversity, progress, resilience, and hospitality.",
    heading2: (content.heading2 as string) || "Building the Pride Team",
    body2a:
      (content.body2a as string) ||
      "To support this mission, Imtiaz is building the Pride Team - a growing network of individuals, communities, businesses, and organizations who believe in a brighter future for Pakistan. Together, they are working to amplify voices of positivity, hope, and change.",
    body2b:
      (content.body2b as string) ||
      "Through inspiring stories and real-life achievements, Pride of Pakistan aims to foster understanding, unity, and national pride, while serving as a meaningful link between Pakistan, its global diaspora, and the international community.",
    body2c:
      (content.body2c as string) ||
      "Join us. Share your story. Be part of a movement that redefines how the world sees Pakistan.",
    images,
  };

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <PageHero
          eyebrow="Our Story"
          title="About Pride of Pakistan"
          subtitle="A movement to challenge misconceptions and showcase the true character of Pakistan."
        />
        <AboutClient data={data} />
      </main>
      <Footer />
    </>
  );
}
