"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

interface NewsItem {
  id: number;
  title: string;
  shortdesc: string;
  status: number;
  date_time: string;
  smallimage: string | null;
}

const PAGE_SIZE = 15;

export default function NewsTableClient({
  news: initial,
}: {
  news: NewsItem[];
}) {
  const [news, setNews] = useState(initial);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      news.filter((n) => {
        const matchStatus =
          filterStatus === "all" || n.status === Number(filterStatus);
        const matchSearch =
          !search || n.title.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
      }),
    [news, filterStatus, search],
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleDelete(id: number) {
    if (!confirm("Delete this item permanently?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
      setNews((prev) => prev.filter((n) => n.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-white border border-border rounded-xl">
        <input
          type="text"
          placeholder="Search items…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border border-border rounded-md px-3 py-2 text-sm font-body focus:outline-none focus:border-gold flex-1 min-w-[180px]"
        />
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 text-sm border rounded-md border-border font-body focus:outline-none focus:border-gold"
        >
          <option value="all">All</option>
          <option value="0">Draft</option>
          <option value="1">Published</option>
        </select>
        <span className="ml-auto text-xs text-ink-muted font-body">
          {filtered.length} items
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white border border-border rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border bg-cream">
                <th className="w-12 px-4 py-3 text-xs font-bold tracking-wide text-left uppercase text-ink-muted">
                  #
                </th>
                <th className="px-4 py-3 text-xs font-bold tracking-wide text-left uppercase text-ink-muted">
                  News Item
                </th>
                <th className="hidden px-4 py-3 text-xs font-bold tracking-wide text-left uppercase text-ink-muted sm:table-cell">
                  Date
                </th>
                <th className="px-4 py-3 text-xs font-bold tracking-wide text-left uppercase text-ink-muted">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-bold tracking-wide text-left uppercase text-ink-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-sm text-center text-ink-muted font-body"
                  >
                    No items found.
                  </td>
                </tr>
              ) : (
                paginated.map((n, idx) => (
                  <tr
                    key={n.id}
                    className="transition-colors hover:bg-cream/50"
                  >
                    <td className="px-4 py-3">
                      <span className="text-xs text-ink-muted tabular-nums">
                        {(page - 1) * PAGE_SIZE + idx + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {n.smallimage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={n.smallimage}
                            alt={n.title}
                            className="flex-shrink-0 w-20 h-16 rounded-lg object-fit"
                          />
                        ) : (
                          <div className="flex items-center justify-center flex-shrink-0 w-20 h-16 rounded-lg bg-green/10">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-green"
                            >
                              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                              <path d="M18 14h-8" />
                              <path d="M15 18h-5" />
                              <path d="M10 6h8v4h-8V6Z" />
                            </svg>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-ink-dark truncate max-w-[280px]">
                            {n.title}
                          </p>
                          <p className="text-xs text-ink-muted truncate max-w-[280px]">
                            {n.shortdesc}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span className="text-xs text-ink-muted">
                        {new Date(n.date_time).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded font-body ${n.status === 1 ? "bg-green/10 text-green" : "bg-amber-50 text-amber-700"}`}
                      >
                        {n.status === 1 ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/news/${n.id}`}
                          target="_blank"
                          className="text-xs no-underline transition-colors text-ink-muted font-body hover:text-green"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/news/${n.id}/edit`}
                          className="text-xs font-semibold no-underline text-gold font-body hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(n.id)}
                          disabled={deleting === n.id}
                          className="text-xs text-red-500 font-body hover:underline disabled:opacity-50"
                        >
                          {deleting === n.id ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-ink-muted font-body">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-semibold border rounded-lg border-border font-body text-ink-mid hover:border-green hover:text-green disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-semibold border rounded-lg border-border font-body text-ink-mid hover:border-green hover:text-green disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
