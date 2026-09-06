import AdminNav from '@/app/components/admin/AdminNav'
import NewsEditClient from '../[id]/edit/NewsEditClient'

export default function NewNewsPage() {
  const empty = {
    id: 0,
    title: '',
    description: '',
    shortdesc: '',
    smallimage: null,
    status: 0,
    images: [],
  }

  return (
    <div className="flex min-h-screen bg-cream pt-4">
      <AdminNav />
      <main className="flex-1 p-4 lg:ml-64 lg:pt-0 lg:p-8">
        <NewsEditClient item={empty} isNew />
      </main>
    </div>
  )
}