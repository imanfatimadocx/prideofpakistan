import { prisma } from "@/app/lib/prisma";
import { resolveImage } from "@/app/lib/images";
import TeamClient from "./TeamClient";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const members = await prisma.prideTeam.findMany({
    orderBy: { fullname: "asc" },
  });

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-[900px]">
        <h1 className="mb-1 text-2xl font-bold font-display text-green">
          Pride Team
        </h1>
        <p className="mb-8 text-sm text-ink-muted font-body">
          Live members appear on the{" "}
          <a
            href="/pride-team"
            target="_blank"
            className="text-gold hover:underline"
          >
            Pride Team
          </a>{" "}
          page in alphabetical order. Each member also has their own page
          showing their details. Leave phone or email empty to keep them off the
          site.
        </p>
        <TeamClient
          members={members.map((m) => ({
            id: m.id,
            fullname: m.fullname,
            designation: m.designation,
            city: m.city,
            country: m.country,
            phone: m.phone,
            email: m.email,
            image: resolveImage(m.image) ?? "",
            description: m.description,
            status: m.status,
          }))}
        />
      </div>
    </div>
  );
}
