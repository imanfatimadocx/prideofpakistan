import type { Metadata } from "next";
import { prisma } from "@/app/lib/prisma";
import { resolveImage } from "@/app/lib/images";
import { getPageContent } from "@/app/lib/pageContent";
import Topbar from "@/app/components/layout/Topbar";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import PageHero from "@/app/components/shared/PageHero";
import PrideTeamClient from "./PrideTeamClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pride Team | Pride of Pakistan",
  description: "Meet the people behind Pride of Pakistan.",
};

export default async function PrideTeamPage() {
  const [hero, members] = await Promise.all([
    getPageContent("page_team"),
    prisma.prideTeam
      .findMany({
        where: { status: 1 },
        orderBy: { fullname: "asc" },
        // phone & email are deliberately NOT selected - they stay private
        select: { id: true, fullname: true, designation: true, city: true, country: true, image: true, description: true },
      })
      .catch(() => []),
  ]);

  return (
    <>
      <Topbar />
      <Navbar />
      <main className="min-h-screen bg-cream">
        <PageHero eyebrow={hero.eyebrow} title={hero.heading} subtitle={hero.subtext} />
        <PrideTeamClient members={members.map((m) => ({ ...m, image: resolveImage(m.image) }))} />
      </main>
      <Footer />
    </>
  );
}
