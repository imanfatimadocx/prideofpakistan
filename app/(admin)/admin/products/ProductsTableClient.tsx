"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

interface Product {
  id: number;
  title: string;
  status: number;
  feature: number;
  image: string | null;
  categoryid: number;
  categoryname: string | null;
  inquiryCount: number;
}

interface Category {
  id: number;
  name: string;
}

const STATUS_LABELS: Record<number, string> = {
  0: "Pending",
  1: "Approved",
  2: "Rejected",
};
const STATUS_STYLES: Record<number, string> = {
  0: "bg-amber-50 text-amber-700",
  1: "bg-green/10 text-green",
  2: "bg-red-50 text-red-600",
};
const PAGE_SIZE = 15;

export default function ProductsTableClient({
  products: initial,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [products, setProducts] = useState(initial);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterFeatured, setFilterFeatured] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return products
      .filter((p) => {
        const matchStatus =
          filterStatus === "all" || p.status === Number(filterStatus);
        const matchFeatured =
          filterFeatured === "all" || p.feature === Number(filterFeatured);
        const matchCategory =
          filterCategory === "all" || p.categoryid === Number(filterCategory);
        const matchSearch =
          !search || p.title.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchFeatured && matchCategory && matchSearch;
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [products, filterStatus, filterFeatured, filterCategory, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleDelete(id: number) {
    if (!confirm("Delete this product permanently?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
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
          placeholder="Search products…"
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
          className="border border-border rounded-md px-3 py-2 text-sm font-body focus:outline-none focus:border-gold"
        >
          <option value="all">All Statuses</option>
          <option value="0">Pending</option>
          <option value="1">Approved</option>
          <option value="2">Rejected</option>
        </select>
        <select
          value={filterFeatured}
          onChange={(e) => {
            setFilterFeatured(e.target.value);
            setPage(1);
          }}
          className="border border-border rounded-md px-3 py-2 text-sm font-body focus:outline-none focus:border-gold"
        >
          <option value="all">All Products</option>
          <option value="1">Featured Only</option>
          <option value="0">Not Featured</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setPage(1);
          }}
          className="border border-border rounded-md px-3 py-2 text-sm font-body focus:outline-none focus:border-gold"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {(filterStatus !== "all" ||
          filterFeatured !== "all" ||
          filterCategory !== "all" ||
          search) && (
          <button
            onClick={() => {
              setFilterStatus("all");
              setFilterFeatured("all");
              setFilterCategory("all");
              setSearch("");
              setPage(1);
            }}
            className="text-xs text-gold font-semibold font-body hover:underline"
          >
            Clear
          </button>
        )}
        <span className="text-xs text-ink-muted font-body ml-auto">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border bg-cream">
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-ink-muted w-12">
                  #
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-ink-muted">
                  Product
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-ink-muted hidden sm:table-cell">
                  Category
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-ink-muted">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-ink-muted">
                  Featured
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-ink-muted">
                  Enquiries
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-ink-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-sm text-ink-muted font-body"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                paginated.map((p, idx) => (
                  <tr
                    key={p.id}
                    className="hover:bg-cream/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-xs text-ink-muted font-body tabular-nums">
                        {(page - 1) * PAGE_SIZE + idx + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-20 h-16 rounded-lg object-fit object-top flex-shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-green flex items-center justify-center text-white font-bold font-display text-sm flex-shrink-0">
                            {p.title.charAt(0)}
                          </div>
                        )}
                        <p className="font-semibold text-ink-dark truncate max-w-[200px]">
                          {p.title}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-ink-muted">
                        {p.categoryname ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded font-body ${STATUS_STYLES[p.status]}`}
                      >
                        {STATUS_LABELS[p.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.feature === 1 ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-gold-pale text-gold font-body">
                          Featured
                        </span>
                      ) : (
                        <span className="text-[11px] text-ink-muted font-body">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {p.inquiryCount > 0 ? (
                        <Link
                          href={`/admin/products/${p.id}/inquiries`}
                          className="text-xs font-semibold text-gold no-underline hover:underline font-body"
                        >
                          {p.inquiryCount} enquir
                          {p.inquiryCount === 1 ? "y" : "ies"}
                        </Link>
                      ) : (
                        <span className="text-xs text-ink-muted font-body">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/products/${p.id}`}
                          target="_blank"
                          className="text-xs no-underline transition-colors text-ink-muted font-body hover:text-green"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="text-xs font-semibold no-underline text-gold font-body hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deleting === p.id}
                          className="text-xs text-red-500 font-body hover:underline disabled:opacity-50"
                        >
                          {deleting === p.id ? "..." : "Delete"}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-ink-muted font-body">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-semibold border border-border rounded-lg font-body text-ink-mid hover:border-green hover:text-green transition-colors disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-semibold border border-border rounded-lg font-body text-ink-mid hover:border-green hover:text-green transition-colors disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
