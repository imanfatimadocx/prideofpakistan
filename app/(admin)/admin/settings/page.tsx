import ChangePasswordClient from './ChangePasswordClient'

export default function AdminSettingsPage() {
  return (
    <div className="flex min-h-screen bg-cream">
      <main className="flex-1 pt-14 lg:pt-0 p-4 lg:p-8">
        <div className="max-w-[500px]">
          <h1 className="font-display text-2xl font-bold text-green mb-1">Settings</h1>
          <p className="text-sm text-ink-muted font-body mb-8">Manage your admin account.</p>
          <ChangePasswordClient />
        </div>
      </main>
    </div>
  )
}