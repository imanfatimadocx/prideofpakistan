'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'

interface Submission {
  id: number
  type: 'profile' | 'business' | 'story' | 'city'
  title: string
  status: string
  createdAt: string
}

const STATUS_STYLES: Record<string, string> = {
  pending:  'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-green/10 text-green border-green/20',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  '0':      'bg-amber-50 text-amber-700 border-amber-200',
  '1':      'bg-green/10 text-green border-green/20',
  '2':      'bg-red-50 text-red-700 border-red-200',
}

const STATUS_LABELS: Record<string, string> = {
  pending:  'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
  '0':      'Pending Review',
  '1':      'Approved',
  '2':      'Rejected',
}

const TYPE_LABELS: Record<string, string> = {
  profile:  'Profile',
  business: 'Business',
  story:    'Story',
  city:     'City Submission',
}

function DashboardContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const submitted = searchParams.get('submitted')

  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'profile' | 'business' | 'story' | 'city'>('all')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?redirect=/dashboard')
  }, [status, router])

  useEffect(() => {
    if (!session?.user?.email) return
    fetch('/api/dashboard/submissions')
      .then((r) => r.json())
      .then((data) => { setSubmissions(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [session])

  const filtered = activeTab === 'all' ? submissions : submissions.filter((s) => s.type === activeTab)

  const counts = {
    all:      submissions.length,
    profile:  submissions.filter((s) => s.type === 'profile').length,
    business: submissions.filter((s) => s.type === 'business').length,
    story:    submissions.filter((s) => s.type === 'story').length,
    city:     submissions.filter((s) => s.type === 'city').length,
  }

  if (status === 'loading') {
    return <main className="flex items-center justify-center min-h-screen bg-cream"><p className="text-sm text-ink-muted font-body">Loading...</p></main>
  }

  if (!session) return null

  return (
    <main className="min-h-screen py-10 bg-cream sm:py-14">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 lg:px-12">

        <div className="mb-8">
          <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold mb-2 font-body">My Account</p>
          <h1 className="mb-1 text-3xl font-bold font-display text-green">Welcome, {session.user?.name ?? 'there'}</h1>
          <p className="text-sm text-ink-muted font-body">Manage your submissions and contributions to Pride of Pakistan.</p>
        </div>

        {submitted && (
          <div className="p-4 mb-6 text-sm border rounded-lg bg-green/10 border-green/20 font-body text-green">
            {submitted === 'story'    && 'Your story has been submitted and is pending review.'}
            {submitted === 'city'     && 'Your city submission has been received and is pending review.'}
            {submitted === 'profile'  && 'Your profile has been submitted and is pending review.'}
            {submitted === 'business' && 'Your business listing has been submitted and is pending review.'}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-10 sm:grid-cols-4">
          {[
            { label: 'Submit Profile',   href: '/submit-profile',   desc: 'Add yourself to Who Is Who' },
            { label: 'List Business',    href: '/list-business',    desc: 'Add to the directory' },
            { label: 'Share a Story',    href: '/your-stories/new', desc: 'Write for Your Stories' },
            { label: 'Introduce a City', href: '/submit-city',      desc: 'Add a city or town' },
          ].map((a) => (
            <Link key={a.href} href={a.href} className="bg-white border border-border rounded-xl p-4 no-underline hover:border-gold hover:-translate-y-0.5 transition-all">
              <p className="mb-1 text-sm font-bold text-ink-dark font-body">{a.label}</p>
              <p className="text-xs text-ink-muted font-body">{a.desc}</p>
            </Link>
          ))}
        </div>

        <div className="overflow-hidden bg-white border border-border rounded-xl">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-lg font-bold font-display text-green">My Submissions</h2>
          </div>

          <div className="flex gap-0 overflow-x-auto border-b border-border">
            {(['all', 'profile', 'business', 'story', 'city'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium font-body whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab ? 'border-gold text-green font-semibold' : 'border-transparent text-ink-muted hover:text-ink-dark'
                }`}
              >
                {tab === 'all' ? 'All' : TYPE_LABELS[tab]}
                {counts[tab] > 0 && (
                  <span className="ml-1.5 text-xs bg-cream text-ink-muted px-1.5 py-0.5 rounded-full">{counts[tab]}</span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="p-8 text-sm text-center text-ink-muted font-body">Loading your submissions...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-ink-muted font-body">No submissions yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((s) => (
                <div key={`${s.type}-${s.id}`} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="flex items-center min-w-0 gap-3">
                    <span className="text-[10px] font-bold text-ink-muted tracking-wide uppercase font-body bg-cream px-2 py-0.5 rounded flex-shrink-0">
                      {TYPE_LABELS[s.type]}
                    </span>
                    <p className="text-sm font-medium truncate text-ink-dark font-body">{s.title}</p>
                  </div>
                  <div className="flex items-center flex-shrink-0 gap-3">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded border font-body ${STATUS_STYLES[s.status] ?? STATUS_STYLES.pending}`}>
                      {STATUS_LABELS[s.status] ?? 'Pending Review'}
                    </span>
                    <span className="hidden text-xs text-ink-muted font-body sm:block">
                      {new Date(s.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default function DashboardPage() {
  return (
    <>
      <Topbar />
      <Navbar />
      <Suspense fallback={<main className="flex items-center justify-center min-h-screen bg-cream"><p className="text-sm text-ink-muted font-body">Loading...</p></main>}>
        <DashboardContent />
      </Suspense>
      <Footer />
    </>
  )
}