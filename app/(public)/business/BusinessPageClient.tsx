"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { BusinessCard, BizCategory } from "./page";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const LETTERS_PER_PAGE = 5;
const INITIAL_ROWS = 2;
const COLS_MOBILE = 3;
const COLS_DESKTOP = 7;

interface Props {
  businesses: BusinessCard[];
  categories: BizCategory[];
}

export default function BusinessPageClient({ businesses, categories }: Props) {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [expandedLetters, setExpandedLetters] = useState<Set<string>>(
    new Set(),
  );

  const [initialLimit] = useState(() => {
    if (typeof window === "undefined") return INITIAL_ROWS * COLS_MOBILE;
    return window.innerWidth >= 1024
      ? INITIAL_ROWS * COLS_DESKTOP
      : INITIAL_ROWS * COLS_MOBILE;
  });

  const activeCategory =
    categories.find((c) => c.id === activeCategoryId) ?? null;

  const categoryBusinesses = useMemo(
    () =>
      activeCategoryId !== null
        ? businesses.filter((b) => b.category_id === activeCategoryId)
        : businesses,
    [businesses, activeCategoryId],
  );

  const availableLetters = useMemo(
    () =>
      new Set(
        categoryBusinesses.map((b) => b.company_name.charAt(0).toUpperCase()),
      ),
    [categoryBusinesses],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return categoryBusinesses
      .filter((b) => {
        const matchesSearch =
          !q ||
          b.company_name.toLowerCase().includes(q) ||
          b.city?.toLowerCase().includes(q) ||
          b.shortdesc?.toLowerCase().includes(q);
        const matchesLetter =
          !activeLetter ||
          b.company_name.charAt(0).toUpperCase() === activeLetter;
        return matchesSearch && matchesLetter;
      })
      .sort((a, b) => a.company_name.localeCompare(b.company_name));
  }, [categoryBusinesses, search, activeLetter]);

  const allGrouped = useMemo(() => {
    const map: Record<string, BusinessCard[]> = {};
    for (const b of filtered) {
      const letter = b.company_name.charAt(0).toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(b);
    }
    return map;
  }, [filtered]);

  const allLetters = Object.keys(allGrouped).sort();
  const totalPages = Math.ceil(allLetters.length / LETTERS_PER_PAGE);
  const pageLetters = allLetters.slice(
    (page - 1) * LETTERS_PER_PAGE,
    page * LETTERS_PER_PAGE,
  );

  function toggleExpand(letter: string) {
    setExpandedLetters((prev) => {
      const next = new Set(prev);
      if (next.has(letter)) next.delete(letter);
      else next.add(letter);
      return next;
    });
  }

  function selectCategory(id: number | null) {
    setActiveCategoryId(id);
    setSearch("");
    setActiveLetter(null);
    setMobileCatOpen(false);
    setPage(1);
    setExpandedLetters(new Set());
  }

  function handleSearch(val: string) {
    setSearch(val);
    setActiveLetter(null);
    setPage(1);
    setExpandedLetters(new Set());
  }

  function handleLetter(letter: string | null) {
    setActiveLetter(letter);
    setPage(1);
    setExpandedLetters(new Set());
  }

  function changePage(p: number) {
    setPage(p);
    setExpandedLetters(new Set());
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="px-4 py-10 bg-green sm:px-8 lg:px-12 sm:py-14">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold mb-2 font-body">
            Directory
          </p>
          <h1 className="mb-3 text-3xl font-black leading-tight text-white font-display sm:text-4xl lg:text-5xl">
            Pakistani Businesses
          </h1>
          <p className="text-white/65 font-body text-sm sm:text-base max-w-[560px]">
            Discover Pakistani businesses across the globe. List your business
            or find trusted services in your community.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-10 flex gap-8 items-start">
        {/* Sidebar */}
        <aside className="hidden lg:block w-[220px] flex-shrink-0 sticky top-6">
          <div className="overflow-hidden bg-white border rounded-xl border-border">
            <div className="px-4 py-3 border-b border-border bg-cream">
              <p className="text-[11px] font-bold tracking-[.12em] uppercase text-ink-muted font-body">
                Categories
              </p>
            </div>
            <nav className="py-2">
              <button
                onClick={() => selectCategory(null)}
                className={`w-full flex items-center px-4 py-2.5 text-sm font-body transition-colors text-left ${
                  activeCategoryId === null
                    ? "bg-gold-pale text-gold font-semibold"
                    : "text-ink-dark hover:bg-gray-50"
                }`}
              >
                All Businesses
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => selectCategory(cat.id)}
                  className={`w-full flex items-center px-4 py-2.5 text-sm font-body transition-colors text-left ${
                    activeCategoryId === cat.id
                      ? "bg-gold-pale text-gold font-semibold"
                      : "text-ink-dark hover:bg-gray-50"
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Mobile category */}
          <div className="mb-4 lg:hidden">
            <button
              onClick={() => setMobileCatOpen(!mobileCatOpen)}
              className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold bg-white border border-border rounded-xl font-body text-ink-dark"
            >
              <span>
                {activeCategory ? activeCategory.name : "All Businesses"}
              </span>
              <span className="text-ink-muted">
                {mobileCatOpen ? "▲" : "▼"}
              </span>
            </button>
            {mobileCatOpen && (
              <div className="mt-1 overflow-hidden bg-white border shadow-lg border-border rounded-xl">
                <button
                  onClick={() => selectCategory(null)}
                  className={`w-full px-4 py-3 text-sm font-body text-left ${activeCategoryId === null ? "bg-gold-pale text-gold font-semibold" : "text-ink-dark hover:bg-gray-50"}`}
                >
                  All Businesses
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => selectCategory(cat.id)}
                    className={`w-full px-4 py-3 text-sm font-body text-left ${activeCategoryId === cat.id ? "bg-gold-pale text-gold font-semibold" : "text-ink-dark hover:bg-gray-50"}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Heading */}
          <div className="mb-5">
            <h2 className="text-xl font-bold font-display sm:text-2xl text-green">
              {activeCategory ? activeCategory.name : "All Businesses"}
            </h2>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search by name, city, or description…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-white border border-border rounded-xl pr-9 font-body text-ink-dark placeholder:text-ink-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30"
            />
            {search && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-dark text-lg"
              >
                ×
              </button>
            )}
          </div>

          {/* Alphabet */}
          {!search && (
            <div className="pb-1 mb-6 overflow-x-auto">
              <div className="flex gap-1 min-w-max">
                <button
                  onClick={() => handleLetter(null)}
                  className={`text-[11px] font-bold font-body px-2.5 py-1.5 rounded transition-colors ${activeLetter === null ? "bg-green text-white" : "text-ink-muted hover:text-green"}`}
                >
                  ALL
                </button>
                {ALPHABET.map((letter) => {
                  const available = availableLetters.has(letter);
                  return (
                    <button
                      key={letter}
                      onClick={() =>
                        available &&
                        handleLetter(letter === activeLetter ? null : letter)
                      }
                      disabled={!available}
                      className={`text-[11px] font-bold font-body w-7 h-7 rounded transition-colors ${
                        activeLetter === letter
                          ? "bg-gold text-white"
                          : available
                            ? "text-ink-dark hover:bg-gold-pale hover:text-gold"
                            : "text-ink-muted/25 cursor-not-allowed"
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white border rounded-2xl border-border">
              <p className="mb-1 text-lg font-bold text-ink-dark font-display">
                No businesses found
              </p>
              <p className="mb-4 text-sm text-ink-muted font-body">
                Try a different search term or clear your filters.
              </p>
              <button
                onClick={() => {
                  handleSearch("");
                  handleLetter(null);
                }}
                className="text-sm font-semibold text-gold font-body hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-10">
                {pageLetters.map((letter) => {
                  const group = allGrouped[letter];
                  const isExpanded = expandedLetters.has(letter);
                  const hasMore = group.length > initialLimit;
                  const shown = isExpanded
                    ? group
                    : group.slice(0, initialLimit);

                  return (
                    <div key={letter}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center flex-shrink-0 rounded-lg w-9 h-9 bg-green">
                          <span className="text-base font-bold text-white font-display">
                            {letter}
                          </span>
                        </div>
                        <div className="flex-1 h-px bg-border" />
                        {hasMore && (
                          <button
                            onClick={() => toggleExpand(letter)}
                            className="flex-shrink-0 text-xs font-semibold text-gold font-body hover:underline"
                          >
                            {isExpanded
                              ? "Show less"
                              : `+${group.length - initialLimit} more`}
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2 lg:grid-cols-7 sm:gap-3">
                        {shown.map((b) => (
                          <Link
                            key={b.id}
                            href={`/business/${b.id}`}
                            className="no-underline group"
                          >
                            <div
                              className="w-full overflow-hidden"
                              style={{ aspectRatio: "600/350" }}
                            >
                              {b.image ? (
                                <Image
                                  src={b.image}
                                  alt={b.company_name}
                                  width={600}
                                  height={350}
                                  className="object-cover object-top w-full h-full transition-transform duration-300 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex items-center justify-center w-full h-full text-2xl font-bold text-white bg-green font-display">
                                  {b.company_name.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="mt-2">
                              <p className="text-[11px] font-bold leading-snug text-ink-dark font-display group-hover:text-green transition-colors line-clamp-2">
                                {b.company_name}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => changePage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm font-semibold transition-colors border rounded-lg font-body border-border text-ink-mid hover:border-green hover:text-green disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => {
                      const show =
                        p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                      if (p === page - 2 && page - 2 > 1)
                        return (
                          <span key={p} className="text-sm text-ink-muted">
                            …
                          </span>
                        );
                      if (p === page + 2 && page + 2 < totalPages)
                        return (
                          <span key={p} className="text-sm text-ink-muted">
                            …
                          </span>
                        );
                      if (!show) return null;
                      return (
                        <button
                          key={p}
                          onClick={() => changePage(p)}
                          className={`w-9 h-9 rounded-lg text-sm font-semibold font-body border transition-colors ${page === p ? "bg-green text-white border-green" : "border-border text-ink-mid hover:border-green hover:text-green"}`}
                        >
                          {p}
                        </button>
                      );
                    },
                  )}
                  <button
                    onClick={() => changePage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 text-sm font-semibold transition-colors border rounded-lg font-body border-border text-ink-mid hover:border-green hover:text-green disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
