import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import UsersTableClient from "./UsersTableClient";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page = "1" } = await searchParams;
  const query = q.trim();
  const current = Math.max(1, Number(page) || 1);

  const where: Prisma.PublicUserWhereInput = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      }
    : {};

  const [users, total, allTotal] = await Promise.all([
    prisma.publicUser.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (current - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: { id: true, name: true, email: true, emailVerified: true, createdAt: true },
    }),
    prisma.publicUser.count({ where }),
    query ? prisma.publicUser.count() : Promise.resolve(0),
  ]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const href = (p: number) =>
    `/admin/users?${new URLSearchParams({ ...(query && { q: query }), page: String(p) })}`;

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-[1100px]">
        <h1 className="mb-1 text-2xl font-bold font-display text-green">Registered Users</h1>
        <p className="mb-6 text-sm text-ink-muted font-body">
          {query
            ? `${total} of ${allTotal} accounts match “${query}”`
            : `${total} registered account${total === 1 ? "" : "s"}`}
          . You can set a new password for anyone who is locked out.
        </p>

        <form method="get" className="flex gap-3 p-4 mb-5 bg-white border border-border rounded-xl">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search by name or email…"
            className="flex-1 px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold"
          />
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-semibold text-white rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark"
          >
            Search
          </button>
          {query && (
            <Link
              href="/admin/users"
              className="self-center text-sm no-underline text-ink-muted font-body hover:text-green"
            >
              Clear
            </Link>
          )}
        </form>

        <UsersTableClient
          users={users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }))}
          offset={(current - 1) * PAGE_SIZE}
        />

        {pages > 1 && (
          <div className="flex items-center justify-between mt-5 text-sm font-body">
            <span className="text-ink-muted">
              Page {current} of {pages}
            </span>
            <div className="flex gap-2">
              {current > 1 && (
                <Link href={href(current - 1)} className="px-4 py-2 no-underline bg-white border rounded-md border-border text-ink-mid hover:border-gold hover:text-gold">
                  ← Previous
                </Link>
              )}
              {current < pages && (
                <Link href={href(current + 1)} className="px-4 py-2 no-underline bg-white border rounded-md border-border text-ink-mid hover:border-gold hover:text-gold">
                  Next →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
