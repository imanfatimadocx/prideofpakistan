'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'

function LoginForm() {
  const params = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (params.get('registered')) setSuccess('Account created! Sign in below.')
  }, [params])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const email    = (form.elements.namedItem('email')    as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const res = await signIn('public-credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError('Invalid email or password.')
      return
    }

    // Hard redirect - ensures cookie is set before navigation
    const redirectTo = params.get('redirect') ?? '/'
    window.location.href = redirectTo
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 space-y-4 bg-white border border-border rounded-xl sm:p-8"
    >
      {success && (
        <p className="px-3 py-2 text-sm border rounded-md text-green font-body bg-green/5 border-green/20">
          {success}
        </p>
      )}

      <div>
        <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">Email</label>
        <input
          name="email"
          type="email"
          required
          className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">Password</label>
        <input
          name="password"
          type="password"
          required
          className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
          placeholder="Your password"
        />
      </div>

      {error && <p className="text-sm text-red-500 font-body">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 text-sm font-semibold text-white transition-colors rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark disabled:opacity-50"
      >
        {loading ? 'Signing in…' : 'Sign In'}
      </button>

      <p className="text-sm text-center text-ink-muted font-body">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold text-gold hover:underline">
          Create one
        </Link>
      </p>
    </form>
  )
}

export default function LoginPage() {
  return (
    <>
      <Topbar />
      <Navbar />
      <main className="flex items-center justify-center min-h-screen px-4 py-16 bg-cream">
        <div className="w-full max-w-[440px]">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold font-display text-green">Welcome Back</h1>
            <p className="text-sm text-ink-muted font-body">
              Sign in to your Pride of Pakistan account.
            </p>
          </div>
          <Suspense fallback={
            <div className="p-8 text-sm text-center bg-white border border-border rounded-xl text-ink-muted font-body">
              Loading…
            </div>
          }>
            <LoginForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}