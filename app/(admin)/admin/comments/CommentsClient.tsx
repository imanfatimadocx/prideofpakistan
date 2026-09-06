"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

interface Comment {
  id: number;
  content: string;
  authorName: string;
  authorEmail: string;
  entityType: string;
  entityId: number;
  parentId: number | null;
  likes: number;
  approved: boolean;
  createdAt: string;
  replyCount: number;
}

const PAGE_SIZE = 20;

const ENTITY_LABELS: Record<string, string> = {
  profile: "Profile",
  business: "Business",
  news: "News",
  story: "Story",
};

const ENTITY_LINKS: Record<string, (id: number) => string> = {
  profile: (id) => `/who-is-who/${id}`,
  business: (id) => `/business/${id}`,
  news: (id) => `/news/${id}`,
  story: (id) => `/your-stories/${id}`,
};

export default function CommentsClient({
  comments: initial,
}: {
  comments: Comment[];
}) {
  const [comments, setComments] = useState(initial);
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      comments.filter((c) => {
        const matchType = filterType === "all" || c.entityType === filterType;
        const matchSearch =
          !search ||
          c.content.toLowerCase().includes(search.toLowerCase()) ||
          c.authorName.toLowerCase().includes(search.toLowerCase());
        return matchType && matchSearch;
      }),
    [comments, filterType, search],
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleDelete(id: number) {
    if (!confirm("Delete this comment and all its replies?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/comments/${id}`, { method: "DELETE" });
      setComments((prev) =>
        prev.filter((c) => c.id !== id && c.parentId !== id),
      );
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white border border-border rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search comments or authors…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border border-border rounded-md px-3 py-2 text-sm font-body focus:outline-none focus:border-gold flex-1 min-w-[180px]"
        />
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setPage(1);
          }}
          className="border border-border rounded-md px-3 py-2 text-sm font-body focus:outline-none focus:border-gold"
        >
          <option value="all">All Types</option>
          <option value="profile">Profiles</option>
          <option value="business">Businesses</option>
          <option value="news">News</option>
          <option value="story">Stories</option>
        </select>
        <span className="text-xs text-ink-muted font-body ml-auto">
          {filtered.length} comments
        </span>
      </div>

      {/* Comments list */}
      <div className="space-y-3">
        {paginated.length === 0 ? (
          <div className="bg-white border border-border rounded-xl p-10 text-center">
            <p className="text-sm text-ink-muted font-body">
              No comments found.
            </p>
          </div>
        ) : (
          paginated.map((c, idx) => (
            <div
              key={c.id}
              className={`bg-white border rounded-xl p-5 ${c.parentId ? "border-border/50 ml-6" : "border-border"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-gold font-body bg-gold-pale px-2 py-0.5 rounded">
                      {ENTITY_LABELS[c.entityType] ?? c.entityType}
                    </span>
                    {c.parentId && (
                      <span className="text-[10px] font-bold uppercase tracking-wide text-ink-muted font-body bg-cream px-2 py-0.5 rounded">
                        Reply
                      </span>
                    )}
                    <Link
                      href={ENTITY_LINKS[c.entityType]?.(c.entityId) ?? "#"}
                      target="_blank"
                      className="text-xs text-ink-muted no-underline hover:text-gold font-body"
                    >
                      View #{c.entityId} →
                    </Link>
                    <span className="text-xs text-ink-muted font-body ml-auto">
                      {new Date(c.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-green flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                      {c.authorName.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-xs font-semibold text-ink-dark font-body">
                      {c.authorName}
                    </p>
                    <a
                      href={`mailto:${c.authorEmail}`}
                      className="text-xs text-gold hover:underline no-underline font-body"
                    >
                      {c.authorEmail}
                    </a>
                  </div>

                  {/* Content */}
                  <p className="text-sm text-ink-mid font-body leading-relaxed">
                    {c.content}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-2">
                    {c.likes > 0 && (
                      <span className="text-xs text-ink-muted font-body">
                        ♥ {c.likes} like{c.likes !== 1 ? "s" : ""}
                      </span>
                    )}
                    {c.replyCount > 0 && (
                      <span className="text-xs text-ink-muted font-body">
                        {c.replyCount} repl{c.replyCount !== 1 ? "ies" : "y"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Index + Delete */}
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <span className="text-xs text-ink-muted font-body tabular-nums">
                    {(page - 1) * PAGE_SIZE + idx + 1}
                  </span>
                  <button
                    onClick={() => handleDelete(c.id)}
                    disabled={deleting === c.id}
                    className="text-xs text-red-500 font-body hover:underline disabled:opacity-50"
                  >
                    {deleting === c.id ? "..." : "Delete"}
                  </button>
                </div>
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
              className="px-4 py-2 text-sm font-semibold border border-border rounded-lg font-body text-ink-mid hover:border-green hover:text-green disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-semibold border border-border rounded-lg font-body text-ink-mid hover:border-green hover:text-green disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
