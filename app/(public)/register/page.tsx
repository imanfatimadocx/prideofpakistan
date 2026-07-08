'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const data = {
      name:            (form.elements.namedItem('name')     as HTMLInputElement).value,
      email:           (form.elements.namedItem('email')    as HTMLInputElement).value,
      password:        (form.elements.namedItem('password') as HTMLInputElement).value,
      confirmPassword: (form.elements.namedItem('confirm')  as HTMLInputElement).value,
    }

    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    if (data.password.length < 8) {
      setError('Password must be at least 8 characters.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error ?? 'Registration failed.')
        return
      }

      router.push('/login?registered=1')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Topbar />
      <Navbar />
      <main className="flex items-center justify-center min-h-screen px-4 py-16 bg-cream">
        <div className="w-full max-w-[440px]">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold font-display text-green">Create Account</h1>
            <p className="text-sm text-ink-muted font-body">
              Join Pride of Pakistan — submit your profile, list your business, and more.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-4 bg-white border border-border rounded-xl sm:p-8"
          >
            <div>
              <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">Full Name</label>
              <input
                name="name"
                type="text"
                required
                className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                placeholder="Your full name"
              />
            </div>

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
                minLength={8}
                className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">Confirm Password</label>
              <input
                name="confirm"
                type="password"
                required
                className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                placeholder="Repeat your password"
              />
            </div>

            {error && <p className="text-sm text-red-500 font-body">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-sm font-semibold text-white transition-colors rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>

            <p className="text-sm text-center text-ink-muted font-body">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-gold hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}