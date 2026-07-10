'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Profile, Category } from './page'

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP: [string, string][] = [
  ['politics',       ''],
  ['government',   ''],
  ['business',     ''],
  ['finance',      ''],
  ['entrepreneur', ''],
  ['art',          ''],
  ['culture',      ''],
  ['music',        ''],
  ['film',         ''],
  ['sport',        ''],
  ['cricket',      ''],
  ['athlete',      ''],
  ['science',      ''],
  ['tech',         ''],
  ['engineer',     ''],
  ['doctor',       ''],
  ['health',       ''],
  ['media',        ''],
  ['journal',      ''],
  ['education',    ''],
  ['academ',       ''],
  ['military',     ''],
  ['defence',      ''],
  ['army',         ''],
  ['law',          ''],
  ['legal',        ''],
  ['social',       ''],
  ['philanthrop',  ''],
  ['religion',     ''],
  ['scholar',      ''],
  ['women',        ''],
  ['youth',        ''],
]

function getCategoryIcon(name: string): string {
  const lower = name.toLowerCase()
  for (const [key, icon] of ICON_MAP) {
    if (lower.includes(key)) return icon
  }
  return ''
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  profiles: Profile[]
  categories: Category[]
  defaultCategoryId: number | null
}

export default function WhoIsWhoPageClient({ profiles, categories, defaultCategoryId }: Props) {
  const defaultCat = categories.find((c) => c.categoryid === defaultCategoryId) ?? null

  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(
    defaultCat?.categoryid ?? null
  )
  const [search, setSearch] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)
  const [mobileCatOpen, setMobileCatOpen] = useState(false)

  const activeCategory = categories.find((c) => c.categoryid === activeCategoryId) ?? null

  // Profiles for the active category (or all if none selected)
  const categoryProfiles = useMemo(
    () =>
      activeCategoryId !== null
        ? profiles.filter((p) => p.categoryid === activeCategoryId)
        : profiles,
    [profiles, activeCategoryId]
  )

  // Available letters for alphabet bar
  const availableLetters = useMemo(
    () => new Set(categoryProfiles.map((p) => p.title.charAt(0).toUpperCase())),
    [categoryProfiles]
  )

  // Filtered + sorted profiles
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return categoryProfiles
      .filter((p) => {
        const matchesSearch =
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.Profession?.toLowerCase().includes(q) ||
          p.City?.toLowerCase().includes(q)
        const matchesLetter =
          !activeLetter || p.title.charAt(0).toUpperCase() === activeLetter
        return matchesSearch && matchesLetter
      })
      .sort((a, b) => a.title.localeCompare(b.title))
  }, [categoryProfiles, search, activeLetter])

  // Group by first letter
  const grouped = useMemo(() => {
    const map: Record<string, Profile[]> = {}
    for (const p of filtered) {
      const letter = p.title.charAt(0).toUpperCase()
      if (!map[letter]) map[letter] = []
      map[letter].push(p)
    }
    return map
  }, [filtered])

  const groupedLetters = Object.keys(grouped).sort()

  function selectCategory(id: number | null) {
    setActiveCategoryId(id)
    setSearch('')
    setActiveLetter(null)
    setMobileCatOpen(false)
  }

  return (
    <div className="min-h-screen bg-cream">

      {/* ── Hero banner ── */}
      <div className="px-4 py-10 bg-green sm:px-8 lg:px-12 sm:py-14">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold mb-2 font-body">
            Hall of Fame
          </p>
          <h1 className="mb-3 text-3xl font-black leading-tight text-white font-display sm:text-4xl lg:text-5xl">
            Who Is Who
          </h1>
          <p className="text-white/65 font-body text-sm sm:text-base max-w-[560px]">
           Who is Who section of this website is dedicated to highlight those Pakistani individuals who have become celebrated in their respective fields and made successes of them across the globe. If you think you meet the qualities to be a Pride of Pakistan or you know someone who does, you are welcome to submit the profile online or email the profile at info@prideofpakistan.com with photo in jpeg or gif format and 600x350 pixels in size. Please remember, you need to Register/login to submit the profile online. Internet & Telecom.
           <b>The Pride of Pakistan Board approves all entries and you will be notified about the Board's decision.
          </b>
</p>
          <div className="flex items-center gap-3 mt-5 text-xs text-white/50 font-body">
            <span>{profiles.length} profiles</span>
            <span>·</span>
            <span>{categories.length} categories</span>
          </div>
        </div>
      </div>

      {/* ── Body: sidebar + content ── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-10 flex gap-8 items-start">

        {/* ── Sidebar — categories ── */}
        <aside className="hidden lg:block w-[220px] flex-shrink-0 sticky top-6">
          <div className="overflow-hidden bg-white border rounded-xl border-border">
            <div className="px-4 py-3 border-b border-border bg-cream">
              <p className="text-[11px] font-bold tracking-[.12em] uppercase text-ink-muted font-body">
                Categories
              </p>
            </div>
            <nav className="py-2">
              {/* All */}
              <button
                onClick={() => selectCategory(null)}
                className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm font-body transition-colors text-left ${
                  activeCategoryId === null
                    ? 'bg-gold-pale text-gold font-semibold'
                    : 'text-ink-dark hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span></span>
                  <span>All Profiles</span>
                </span>
                <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                  activeCategoryId === null ? 'bg-gold text-white' : 'bg-gray-100 text-ink-muted'
                }`}>
                  {profiles.length}
                </span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.categoryid}
                  onClick={() => cat.count > 0 && selectCategory(cat.categoryid)}
                  disabled={cat.count === 0}
                  className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm font-body transition-colors text-left ${
                    activeCategoryId === cat.categoryid
                      ? 'bg-gold-pale text-gold font-semibold'
                      : cat.count > 0
                      ? 'text-ink-dark hover:bg-gray-50'
                      : 'text-ink-muted/40 cursor-not-allowed'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <span className="text-base">{getCategoryIcon(cat.categoryname)}</span>
                    <span className="truncate">{cat.categoryname}</span>
                  </span>
                  {cat.count > 0 && (
                    <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0 ${
                      activeCategoryId === cat.categoryid ? 'bg-gold text-white' : 'bg-gray-100 text-ink-muted'
                    }`}>
                      {cat.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">

          {/* Mobile category toggle */}
          <div className="mb-4 lg:hidden">
            <button
              onClick={() => setMobileCatOpen(!mobileCatOpen)}
              className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold bg-white border border-border rounded-xl font-body text-ink-dark"
            >
              <span>
                {activeCategory
                  ? `${getCategoryIcon(activeCategory.categoryname)} ${activeCategory.categoryname}`
                  : 'All Profiles'}
              </span>
              <span className="text-ink-muted">{mobileCatOpen ? '▲' : '▼'}</span>
            </button>
            {mobileCatOpen && (
              <div className="mt-1 overflow-hidden bg-white border shadow-lg border-border rounded-xl">
                <button
                  onClick={() => selectCategory(null)}
                  className={`w-full px-4 py-3 text-sm font-body text-left flex items-center justify-between ${
                    activeCategoryId === null ? 'bg-gold-pale text-gold font-semibold' : 'text-ink-dark hover:bg-gray-50'
                  }`}
                >
                  <span>All Profiles</span>
                  <span className="text-[11px] text-ink-muted">{profiles.length}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.categoryid}
                    onClick={() => cat.count > 0 && selectCategory(cat.categoryid)}
                    disabled={cat.count === 0}
                    className={`w-full px-4 py-3 text-sm font-body text-left flex items-center justify-between ${
                      activeCategoryId === cat.categoryid
                        ? 'bg-gold-pale text-gold font-semibold'
                        : cat.count > 0
                        ? 'text-ink-dark hover:bg-gray-50'
                        : 'text-ink-muted/40 cursor-not-allowed'
                    }`}
                  >
                    <span>{getCategoryIcon(cat.categoryname)} {cat.categoryname}</span>
                    {cat.count > 0 && <span className="text-[11px] text-ink-muted">{cat.count}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active category heading */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-bold font-display sm:text-2xl text-green">
                {activeCategory
                  ? `${getCategoryIcon(activeCategory.categoryname)} ${activeCategory.categoryname}`
                  : 'All Profiles'}
              </h2>
              <p className="text-xs text-ink-muted font-body mt-0.5">
                {filtered.length} {filtered.length === 1 ? 'profile' : 'profiles'}
                {search && ` matching "${search}"`}
                {activeLetter && ` starting with "${activeLetter}"`}
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mb-4">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted text-base select-none"></span>
            <input
              type="text"
              placeholder="Search by name, profession, or city…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setActiveLetter(null) }}
              className="w-full py-3 text-sm bg-white border border-border rounded-xl pl-9 pr-9 font-body text-ink-dark placeholder:text-ink-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-dark text-lg"
              >
                ×
              </button>
            )}
          </div>

          {/* Alphabet bar */}
          {!search && (
            <div className="pb-1 mb-6 overflow-x-auto">
              <div className="flex gap-1 min-w-max">
                <button
                  onClick={() => setActiveLetter(null)}
                  className={`text-[11px] font-bold font-body px-2.5 py-1.5 rounded transition-colors ${
                    activeLetter === null ? 'bg-green text-white' : 'text-ink-muted hover:text-green'
                  }`}
                >
                  ALL
                </button>
                {ALPHABET.map((letter) => {
                  const available = availableLetters.has(letter)
                  return (
                    <button
                      key={letter}
                      onClick={() => available && setActiveLetter(letter === activeLetter ? null : letter)}
                      disabled={!available}
                      className={`text-[11px] font-bold font-body w-7 h-7 rounded transition-colors ${
                        activeLetter === letter
                          ? 'bg-gold text-white'
                          : available
                          ? 'text-ink-dark hover:bg-gold-pale hover:text-gold'
                          : 'text-ink-muted/25 cursor-not-allowed'
                      }`}
                    >
                      {letter}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white border rounded-2xl border-border">
              <span className="mb-4 text-5xl"></span>
              <p className="mb-1 text-lg font-bold text-ink-dark font-display">No profiles found</p>
              <p className="mb-4 text-sm text-ink-muted font-body">
                Try a different search term or clear your filters.
              </p>
              <button
                onClick={() => { setSearch(''); setActiveLetter(null) }}
                className="text-sm font-semibold text-gold font-body hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {groupedLetters.map((letter) => (
                <div key={letter}>
                  {/* Letter divider */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center flex-shrink-0 rounded-lg w-9 h-9 bg-green">
                      <span className="text-base font-bold text-white font-display">{letter}</span>
                    </div>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[11px] text-ink-muted font-body">
                      {grouped[letter].length} {grouped[letter].length === 1 ? 'profile' : 'profiles'}
                    </span>
                  </div>

                  {/* Profile grid */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
                    {grouped[letter].map((p) => (
                      <Link
                        key={p.id}
                        href={`/who-is-who/${p.id}`}
                        className="flex flex-col overflow-hidden no-underline transition-all bg-white border rounded-xl border-border hover:border-gold hover:shadow-lg group"
                      >
                        {/* Square image */}
                        <div className="w-full overflow-hidden bg-gray-100 aspect-square">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.title}
                              width={100}
                              height={100}
                              className="object-top w-full h-full transition-transform duration-300 object-fit group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-4xl font-bold text-white bg-green font-display">
                              {p.title.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        {/* Info */}
                        <div className="p-3.5 flex flex-col gap-0.5">
                          <p className="text-sm font-bold leading-snug transition-colors text-ink-dark font-display group-hover:text-green line-clamp-2">
                            {p.title}
                          </p>
                          {p.Profession && (
                            <p className="text-xs truncate text-ink-muted font-body">{p.Profession}</p>
                          )}
                          {(p.City || p.Country) && (
                            <p className="text-[11px] text-ink-muted font-body">
                               {[p.City, p.Country].filter(Boolean).join(', ')}
                            </p>
                          )}
                          {p.categoryname && (
                            <span className="inline-block mt-1 text-[10px] font-semibold font-body text-gold bg-gold-pale px-2 py-0.5 rounded-full self-start">
                              {p.categoryname}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}