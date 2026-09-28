"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

interface Member {
  id: number;
  fullname: string;
  designation: string;
  city: string;
  country: string;
  image: string | null;
  description: string;
}

const PER_PAGE = 12;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function MemberCard({ m }: { m: Member }) {
  const place = [m.city, m.country].filter(Boolean).join(", ");

  return (
    <Link href={`/pride-team/${m.id}`} className="block no-underline group">
      {/* Plain image - no card, no border (same as Who Is Who) */}
      <div
        className="w-full overflow-hidden rounded-lg"
        style={{ aspectRatio: "650/400" }}
      >
        {m.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={m.image}
            alt={m.fullname}
            loading="lazy"
            className="object-cover object-top w-full h-full transition-transform duration-300 rounded-lg group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-3xl font-bold text-white rounded-lg bg-green font-display">
            {m.fullname.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Content underneath */}
      <div className="mt-2.5">
        <p className="text-sm font-bold leading-snug transition-colors text-ink-dark font-display group-hover:text-green">
          {m.fullname}
        </p>
        {m.designation && (
          <p className="text-xs font-semibold text-gold font-body mt-0.5">
            {m.designation}
          </p>
        )}
        {place && (
          <p className="text-[11px] text-ink-muted font-body mt-0.5">{place}</p>
        )}
      
      </div>
    </Link>
  );
}

export default function PrideTeamClient({ members }: { members: Member[] }) {
  const [search, setSearch] = useState("");
  const [letter, setLetter] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const available = useMemo(
    () => new Set(members.map((m) => m.fullname.charAt(0).toUpperCase())),
    [members],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return members.filter((m) => {
      if (letter && m.fullname.charAt(0).toUpperCase() !== letter) return false;
      if (!q) return true;
      return [m.fullname, m.designation, m.city, m.country].some((v) =>
        v.toLowerCase().includes(q),
      );
    });
  }, [members, search, letter]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  function goTo(p: number) {
    setPage(p);
    document
      .getElementById("team-grid")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (members.length === 0) {
    return (
      <section className="py-20">
        <div className="max-w-[700px] mx-auto px-4 text-center">
          <p className="text-sm text-ink-muted font-body">
            Our team members will be introduced here soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="p-4 mb-6 space-y-4 bg-white border sm:p-5 border-border rounded-2xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, role, city or country…"
              className="flex-1 px-4 py-2.5 text-sm border rounded-md border-border font-body focus:outline-none focus:border-gold"
            />
            <p className="text-xs text-ink-muted font-body sm:w-32 sm:text-right">
              {filtered.length} member{filtered.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => {
                setLetter(null);
                setPage(1);
              }}
              className={`px-2.5 h-8 rounded text-xs font-semibold font-body transition-colors ${
                letter === null
                  ? "bg-green text-white"
                  : "text-ink-mid hover:bg-gold-pale"
              }`}
            >
              All
            </button>
            {ALPHABET.map((l) => {
              const on = available.has(l);
              return (
                <button
                  key={l}
                  disabled={!on}
                  onClick={() => {
                    setLetter(l === letter ? null : l);
                    setPage(1);
                  }}
                  className={`w-8 h-8 rounded text-xs font-semibold font-body transition-colors ${
                    letter === l
                      ? "bg-green text-white"
                      : on
                        ? "text-ink-mid hover:bg-gold-pale hover:text-gold"
                        : "text-ink-muted/30 cursor-not-allowed"
                  }`}
                >
                  {l}
                </button>
              );
            })}
          </div>
        </div>

        <div id="team-grid" className="scroll-mt-6">
          {visible.length === 0 ? (
            <div className="py-16 text-center bg-white border border-border rounded-2xl">
              <p className="text-sm text-ink-muted font-body">
                No team members match your search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 lg:grid-cols-5 sm:gap-x-4">
              {visible.map((m) => (
                <MemberCard key={m.id} m={m} />
              ))}
            </div>
          )}
        </div>

        {pages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
            <button
              onClick={() => goTo(current - 1)}
              disabled={current === 1}
              className="px-4 py-2 text-sm bg-white border rounded-md border-border text-ink-mid font-body hover:border-gold hover:text-gold disabled:opacity-40"
            >
              ← Previous
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goTo(p)}
                className={`w-9 h-9 rounded-md text-sm font-semibold font-body border ${
                  p === current
                    ? "bg-gold text-white border-gold"
                    : "bg-white border-border text-ink-mid hover:border-gold"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => goTo(current + 1)}
              disabled={current === pages}
              className="px-4 py-2 text-sm bg-white border rounded-md border-border text-ink-mid font-body hover:border-gold hover:text-gold disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
