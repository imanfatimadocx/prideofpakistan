"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

interface Story {
  id: number;
  title: string;
  shortdesc: string;
  authorName: string;
  authorEmail: string;
  status: string;
  createdAt: string;
  image: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-green/10 text-green",
  rejected: "bg-red-50 text-red-600",
};

const PAGE_SIZE = 15;

export default function UserStoriesClient({
  stories: initial,
}: {
  stories: Story[];
}) {
  const [stories, setStories] = useState(initial);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [updating, setUpdating] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      stories.filter((s) => {
        const matchStatus = filterStatus === "all" || s.status === filterStatus;
        const matchSearch =
          !search ||
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.authorName.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
      }),
    [stories, filterStatus, search],
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function updateStatus(id: number, status: string) {
    setUpdating(id);
    try {
      await fetch(`/api/admin/user-stories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setStories((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s)),
      );
    } finally {
      setUpdating(null);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this story permanently?")) return;
    setUpdating(id);
    try {
      await fetch(`/api/admin/user-stories/${id}`, { method: "DELETE" });
      setStories((prev) => prev.filter((s) => s.id !== id));
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-white border border-border rounded-xl">
        <input
          type="text"
          placeholder="Search stories or author…"
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
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <span className="ml-auto text-xs text-ink-muted font-body">
          {filtered.length} stories
        </span>
      </div>

      {/* Stories */}
      <div className="space-y-3">
        {paginated.length === 0 ? (
          <div className="p-10 text-center bg-white border border-border rounded-xl">
            <p className="text-sm text-ink-muted font-body">
              No stories found.
            </p>
          </div>
        ) : (
          paginated.map((s, idx) => (
            <div
              key={s.id}
              className="overflow-hidden bg-white border border-border rounded-xl"
            >
              <div className="flex items-start gap-4 p-5">
                <span className="text-xs text-ink-muted font-body tabular-nums w-6 flex-shrink-0 mt-0.5">
                  {(page - 1) * PAGE_SIZE + idx + 1}
                </span>
                {s.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.image}
                    alt={s.title}
                    className="flex-shrink-0 object-fit w-12 h-12 rounded-lg"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink-dark font-body">
                        {s.title}
                      </p>
                      <p className="text-xs text-ink-muted font-body mt-0.5">
                        By <span className="font-semibold">{s.authorName}</span>
                        {" · "}
                        <a
                          href={`mailto:${s.authorEmail}`}
                          className="no-underline text-gold hover:underline"
                        >
                          {s.authorEmail}
                        </a>
                        {" · "}
                        {new Date(s.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded font-body flex-shrink-0 ${STATUS_STYLES[s.status]}`}
                    >
                      {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                    </span>
                  </div>
                  {s.shortdesc && (
                    <p className="mt-2 text-sm text-ink-muted font-body line-clamp-2">
                      {s.shortdesc}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 px-5 py-3 border-t border-border bg-cream">
                <Link
                  href={`/admin/user-stories/${s.id}`}
                  className="text-xs font-semibold text-gold no-underline font-body hover:underline"
                >
                  View Full Story →
                </Link>
                {s.status !== "approved" && (
                  <button
                    onClick={() => updateStatus(s.id, "approved")}
                    disabled={updating === s.id}
                    className="text-xs font-semibold text-green font-body hover:underline disabled:opacity-50"
                  >
                    Approve
                  </button>
                )}
                {s.status !== "rejected" && (
                  <button
                    onClick={() => updateStatus(s.id, "rejected")}
                    disabled={updating === s.id}
                    className="text-xs font-semibold text-amber-600 font-body hover:underline disabled:opacity-50"
                  >
                    Reject
                  </button>
                )}
                <button
                  onClick={() => handleDelete(s.id)}
                  disabled={updating === s.id}
                  className="text-xs text-red-500 font-body hover:underline disabled:opacity-50 ml-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
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
