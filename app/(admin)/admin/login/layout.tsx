import AuthProvider from '@/app/components/admin/AuthProvider'

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
} 