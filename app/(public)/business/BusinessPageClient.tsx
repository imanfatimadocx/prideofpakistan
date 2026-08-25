'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { BusinessItem, BusinessCategory } from './page'

interface Props {
  businesses: BusinessItem[]
  categories: BusinessCategory[]
}

export default function BusinessPageClient({ businesses, categories }: Props) {
  const [selectedCat, setSelectedCat] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return businesses.filter((b) => {
      const matchesCat = selectedCat === null || b.categoryid === selectedCat
      const matchesSearch =
        search.trim() === '' ||
        b.company_name.toLowerCase().includes(search.toLowerCase()) ||
        b.city.toLowerCase().includes(search.toLowerCase()) ||
        b.shortdesc.toLowerCase().includes(search.toLowerCase())
      return matchesCat && matchesSearch
    })
  }, [businesses, selectedCat, search])

  return (
    <>
      {/* Hero */}
      <section className="py-12 bg-green sm:py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
          <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold-light mb-3 font-body">
            Pakistani Businesses
          </p>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold text-white leading-tight">
                Pakistani Businesses
              </h1>
              <div className="w-12 h-[3px] bg-gold mt-4 rounded" />
            </div>
            <div className="flex w-full gap-3 sm:w-auto">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search businesses..."
                className="w-full sm:w-72 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-md px-4 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
              />
              <Link
                href="/list-business"
                className="inline-flex items-center justify-center bg-gold text-white px-4 py-2.5 rounded-md font-semibold text-sm font-body hover:bg-gold-light hover:text-ink-dark transition-colors whitespace-nowrap no-underline"
              >
                List Yours
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content: sidebar + grid */}
      <section className="py-10 bg-cream sm:py-14">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-start gap-8">

            {/* Left sidebar — categories */}
            {categories.length > 0 && (
              <aside className="sticky flex-shrink-0 hidden w-56 lg:block top-24">
                <h3 className="mb-3 text-sm font-bold tracking-wide uppercase font-display text-green">
                  Categories
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCat(null)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-body transition-colors flex items-center justify-between ${
                      selectedCat === null
                        ? 'bg-green text-white font-semibold'
                        : 'text-ink-mid hover:bg-white hover:text-green'
                    }`}
                  >
                    <span>All</span>
                    <span className={`text-xs ${selectedCat === null ? 'text-white/70' : 'text-ink-muted'}`}>
                      {businesses.length}
                    </span>
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCat(selectedCat === c.id ? null : c.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-body transition-colors flex items-center justify-between ${
                        selectedCat === c.id
                          ? 'bg-green text-white font-semibold'
                          : 'text-ink-mid hover:bg-white hover:text-green'
                      }`}
                    >
                      <span className="pr-2 truncate">{c.name}</span>
                      <span className={`text-xs flex-shrink-0 ${selectedCat === c.id ? 'text-white/70' : 'text-ink-muted'}`}>
                        {c.count}
                      </span>
                    </button>
                  ))}
                </div>
              </aside>
            )}

            {/* Mobile category pills */}
            {categories.length > 0 && (
              <div className="flex gap-2 px-4 pb-2 mb-6 -mx-4 overflow-x-auto lg:hidden">
                <button
                  onClick={() => setSelectedCat(null)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium font-body border transition-colors ${
                    selectedCat === null ? 'bg-green text-white border-green' : 'border-border text-ink-mid'
                  }`}
                >
                  All ({businesses.length})
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCat(selectedCat === c.id ? null : c.id)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium font-body border transition-colors ${
                      selectedCat === c.id ? 'bg-green text-white border-green' : 'border-border text-ink-mid'
                    }`}
                  >
                    {c.name} ({c.count})
                  </button>
                ))}
              </div>
            )}

            {/* Grid */}
            <div className="flex-1 min-w-0">
              {filtered.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="mb-2 text-xl font-display text-ink-muted">No businesses found</p>
                  <p className="text-sm text-ink-muted font-body">Try a different category or search term.</p>
                </div>
              ) : (
                <>
                  <p className="mb-5 text-sm text-ink-muted font-body">
                    Showing {filtered.length} of {businesses.length} businesses
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 sm:gap-5">
                    {filtered.map((b) => (
                      <Link
                        key={b.id}
                        href={`/business/${b.id}`}
                        className="flex flex-col p-5 no-underline transition-all bg-white border border-border rounded-xl hover:border-gold hover:-translate-y-1 hover:shadow-xl"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 overflow-hidden border rounded-lg bg-cream border-border">
                            {b.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={b.image} alt={b.company_name} className="object-cover w-full h-full" />
                            ) : (
                              <div className="w-6 h-6 border-2 rounded-sm border-border" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            {b.categoryname && (
                              <span className="text-[10px] font-bold text-gold tracking-[.08em] uppercase font-body block mb-0.5">
                                {b.categoryname}
                              </span>
                            )}
                            <h3 className="text-sm font-bold leading-tight font-display text-ink-dark">
                              {b.company_name}
                            </h3>
                            <p className="text-[11px] text-ink-muted font-body mt-0.5">
                              {b.city}, {b.country}
                            </p>
                          </div>
                        </div>
                        <p className="text-[13px] text-ink-muted font-body leading-relaxed flex-1 line-clamp-3">
                          {b.shortdesc}
                        </p>
                        <span className="mt-3 text-xs font-semibold text-gold font-body">
                          View Profile
                        </span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}