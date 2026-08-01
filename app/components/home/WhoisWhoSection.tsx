'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export interface ProfileCard {
  id: number
  title: string
  Profession?: string | null
  City?: string | null
  Country?: string | null
  image?: string | null
  shortdesc?: string | null
  categoryid?: number | null
  categoryname?: string | null
}

export interface CategoryCard {
  categoryid: number
  categoryname: string
  count: number
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function ProfileListModal({
  category,
  profiles,
  onClose,
}: {
  category: CategoryCard
  profiles: ProfileCard[]
  onClose: () => void
}) {
  const [search, setSearch] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)

  const availableLetters = useMemo(() => {
    const set = new Set(profiles.map((p) => p.title.charAt(0).toUpperCase()))
    return set
  }, [profiles])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return profiles
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
  }, [profiles, search, activeLetter])

  const grouped = useMemo(() => {
    const map: Record<string, ProfileCard[]> = {}
    for (const p of filtered) {
      const letter = p.title.charAt(0).toUpperCase()
      if (!map[letter]) map[letter] = []
      map[letter].push(p)
    }
    return map
  }, [filtered])

  const groupedLetters = Object.keys(grouped).sort()

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center px-4 pt-12 pb-12 overflow-y-auto bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-[960px] shadow-2xl flex flex-col max-h-[70vh]">

        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0 px-6 py-5 bg-white border-b border-border rounded-t-2xl">
          <div>
            <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold mb-1 font-body">Hall of Fame</p>
            <h3 className="text-xl font-bold leading-tight font-display sm:text-2xl text-green">
              {category.categoryname}
            </h3>
            <p className="text-xs text-ink-muted font-body mt-0.5">
              {category.count} {category.count === 1 ? 'profile' : 'profiles'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center text-2xl leading-none transition-colors rounded-full w-9 h-9 hover:bg-gray-100 text-ink-muted hover:text-ink-dark"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Search */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-border">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, profession, or city…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setActiveLetter(null) }}
              className="w-full border border-border rounded-lg px-4 pr-9 py-2.5 text-sm font-body text-ink-dark placeholder:text-ink-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute text-lg -translate-y-1/2 right-3 top-1/2 text-ink-muted hover:text-ink-dark">×</button>
            )}
          </div>
        </div>

        {/* Alphabet bar */}
        {!search && (
          <div className="flex-shrink-0 px-6 py-3 overflow-x-auto border-b border-border">
            <div className="flex gap-1 min-w-max">
              <button
                onClick={() => setActiveLetter(null)}
                className={`text-[11px] font-bold font-body px-2.5 py-1 rounded transition-colors ${activeLetter === null ? 'bg-green text-white' : 'text-ink-muted hover:text-green'}`}
              >ALL</button>
              {ALPHABET.map((letter) => {
                const available = availableLetters.has(letter)
                return (
                  <button
                    key={letter}
                    onClick={() => available && setActiveLetter(letter === activeLetter ? null : letter)}
                    disabled={!available}
                    className={`text-[11px] font-bold font-body w-7 h-7 rounded transition-colors ${
                      activeLetter === letter ? 'bg-gold text-white'
                      : available ? 'text-ink-dark hover:bg-gold-pale hover:text-gold'
                      : 'text-ink-muted/30 cursor-not-allowed'
                    }`}
                  >{letter}</button>
                )
              })}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex-1 px-6 py-5 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-ink-muted font-body">No profiles match your search.</p>
              <button onClick={() => { setSearch(''); setActiveLetter(null) }} className="mt-3 text-sm font-semibold text-gold font-body hover:underline">Clear filters</button>
            </div>
          ) : (
            <div className="space-y-7">
              {groupedLetters.map((letter) => (
                <div key={letter}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex-shrink-0 text-lg font-bold font-display text-green w-7">{letter}</span>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[11px] text-ink-muted font-body flex-shrink-0">{grouped[letter].length}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {grouped[letter].map((p) => (
                      <Link
                        key={p.id}
                        href={`/who-is-who/${p.id}`}
                        onClick={onClose}
                        className="flex items-center gap-3.5 p-3.5 rounded-xl border border-border hover:border-gold hover:shadow-md transition-all group no-underline"
                      >
                        {p.image ? (
                          <Image src={p.image} alt={p.title} width={48} height={48}
                            className="flex-shrink-0 object-top w-12 h-12 transition-all rounded-lg object-fit ring-2 ring-border group-hover:ring-gold" />
                        ) : (
                          <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-lg font-bold text-white rounded-lg bg-green font-display ring-2 ring-border group-hover:ring-gold">
                            {p.title.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold leading-tight truncate transition-colors text-ink-dark font-display group-hover:text-green">{p.title}</p>
                          {p.Profession && <p className="text-xs text-ink-muted font-body truncate mt-0.5">{p.Profession}</p>}
                          {(p.City || p.Country) && (
                            <p className="text-[11px] text-ink-muted font-body mt-0.5">{[p.City, p.Country].filter(Boolean).join(', ')}</p>
                          )}
                        </div>
                        <span className="flex-shrink-0 text-sm transition-opacity opacity-0 text-gold group-hover:opacity-100">→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between flex-shrink-0 px-6 py-4 border-t border-border bg-cream rounded-b-2xl">
          <p className="text-xs text-ink-muted font-body">
            Showing <span className="font-semibold text-ink-dark">{filtered.length}</span> of{' '}
            <span className="font-semibold text-ink-dark">{category.count}</span> profiles
          </p>
          <Link href={`/who-is-who?category=${category.categoryid}`} onClick={onClose} className="text-xs font-semibold text-gold hover:underline font-body">
            View full page →
          </Link>
        </div>
      </div>
    </div>
  )
}

interface Props {
  profiles: ProfileCard[]
  categories: CategoryCard[]
  featuredProfile?: ProfileCard | null
}

export default function WhoIsWhoSection({ profiles, categories, featuredProfile }: Props) {
  const [activeCategory, setActiveCategory] = useState<CategoryCard | null>(null)

  const topCategories = useMemo(
    () => [...categories].sort((a, b) => b.count - a.count).slice(2, 10),
    [categories]
  )

  const categoryFirstImage = useMemo(() => {
    const map: Record<number, string | null> = {}
    for (const cat of topCategories) {
      const first = profiles.find((p) => p.categoryid === cat.categoryid && p.image)
      map[cat.categoryid] = first?.image ?? null
    }
    return map
  }, [topCategories, profiles])

  const activeProfiles = useMemo(
    () => activeCategory ? profiles.filter((p) => p.categoryid === activeCategory.categoryid) : [],
    [profiles, activeCategory]
  )

  return (
    <>
      <section className="py-12 border-t bg-cream sm:py-16 lg:py-20 border-border" id="who-is-who">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">

          {/* Header */}
          <div className="flex items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold mb-2 font-body">Hall of Fame</p>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-[38px] font-bold text-green leading-tight">Who Is Who</h2>
              <div className="w-12 h-[3px] bg-gold mt-3 rounded" />
            </div>
            <Link href="/who-is-who" className="text-[13px] font-semibold text-gold no-underline flex items-center gap-1.5 hover:gap-3 transition-all font-body whitespace-nowrap">
              View All →
            </Link>
          </div>

          {/* ── Featured profile of the day ── */}
          {featuredProfile && (
            <Link
              href={`/who-is-who/${featuredProfile.id}`}
              className="block mb-8 no-underline sm:mb-10"
            >
              <div className="overflow-hidden transition-all bg-white border shadow-lg border-gold/30 rounded-2xl hover:shadow-xl group">
                <div className="flex flex-col items-stretch sm:flex-row">

                  {/* Image */}
                  <div className="w-full sm:w-[220px] flex-shrink-0 overflow-hidden bg-green/10" style={{ aspectRatio: '600/350' }}>
                    {featuredProfile.image ? (
                      <Image
                        src={featuredProfile.image}
                        alt={featuredProfile.title}
                        width={600}
                        height={350}
                        className="object-top w-full h-full transition-transform duration-500 object-fit group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-green">
                        <span className="text-6xl font-black text-white font-display">
                          {featuredProfile.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col justify-center flex-1 px-6 py-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="py-1 font-bold uppercase rounded-full text-10 text-gold font-body">
                        Profile of the Day
                      </span>
                    </div>
                    <h3 className="mb-1 text-xl font-bold leading-tight transition-colors font-display sm:text-2xl text-green group-hover:text-gold">
                      {featuredProfile.title}
                    </h3>
                    {featuredProfile.Profession && (
                      <p className="mb-2 text-sm text-ink-mid font-body">{featuredProfile.Profession}</p>
                    )}
                    {(featuredProfile.City || featuredProfile.Country) && (
                      <p className="mb-3 text-xs text-ink-muted font-body">
                        {[featuredProfile.City, featuredProfile.Country].filter(Boolean).join(', ')}
                      </p>
                    )}
                    {featuredProfile.shortdesc && (
                      <p className="text-sm leading-relaxed text-ink-mid font-body line-clamp-2">
                        {featuredProfile.shortdesc.replace(/<[^>]*>/g, '')}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-1.5 text-gold text-sm font-semibold font-body">
                      View Profile
                      <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Category cards */}
          {topCategories.length === 0 ? (
            <p className="text-sm text-ink-muted font-body">No categories available.</p>
          ) : (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-3 lg:grid-cols-8 sm:gap-4">
              {topCategories.map((cat, index) => {
                const previewImage = categoryFirstImage[cat.categoryid]
                return (
                  <button
                    key={cat.categoryid}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex-col overflow-hidden text-left transition-all duration-200 bg-white border cursor-pointer group rounded-xl border-border hover:border-gold hover:shadow-xl hover:-translate-y-1 ${
                      index >= 4 ? 'hidden sm:flex' : 'flex'
                    }`}
                  >
                    <div className="relative w-full overflow-hidden aspect-square bg-green/10">
                      {previewImage ? (
                        <Image
                          src={previewImage}
                          alt={cat.categoryname}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 10vw"
                          className="object-top transition-transform duration-300 object-fit group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-green/10">
                          <span className="text-2xl font-black select-none lg:text-4xl font-display text-green/20">
                            {cat.categoryname.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="px-3.5 py-3">
                      <span className="text-xs sm:text-[13px] font-bold font-display text-ink-dark leading-snug group-hover:text-green transition-colors">
                        {cat.categoryname}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {activeCategory && (
        <ProfileListModal
          category={activeCategory}
          profiles={activeProfiles}
          onClose={() => setActiveCategory(null)}
        />
      )}
    </>
  )
}