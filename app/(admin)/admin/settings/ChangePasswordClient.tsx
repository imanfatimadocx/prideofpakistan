'use client'
import { useState } from 'react'

export default function ChangePasswordClient() {
  const [current, setCurrent] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (newPass !== confirm) {
      setError('New passwords do not match.')
      return
    }
    if (newPass.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: newPass }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Something went wrong.')
        return
      }
      setSuccess(true)
      setCurrent('')
      setNewPass('')
      setConfirm('')
    } catch {
      setError('Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white border border-border rounded-xl p-6">
      <h2 className="font-display text-base font-bold text-green mb-5">Change Password</h2>

      {success && (
        <div className="bg-green/10 border border-green/20 rounded-lg px-4 py-3 mb-5 text-sm text-green font-semibold font-body">
          Password updated successfully.
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5 text-sm text-red-600 font-body">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
            Current Password
          </label>
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
            className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold transition-colors"
            placeholder="Enter current password"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
            New Password
          </label>
          <input
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            required
            className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold transition-colors"
            placeholder="Minimum 8 characters"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold transition-colors"
            placeholder="Repeat new password"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-gold text-white rounded-md py-2.5 text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors disabled:opacity-50 mt-2"
        >
          {saving ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}