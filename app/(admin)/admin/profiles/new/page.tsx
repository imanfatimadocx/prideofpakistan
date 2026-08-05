import AdminNav from '@/app/components/admin/AdminNav'
import { prisma } from '@/app/lib/prisma'
import ProfileEditClient from '../[id]/edit/ProfileEditClient'

export default async function NewProfilePage() {
  const categories = await prisma.hallCategory.findMany({
    orderBy: { categoryname: 'asc' },
    select: { categoryid: true, categoryname: true },
  })

  const emptyProfile = {
    id: 0,
    title: '',
    Profession: '',
    City: '',
    Country: '',
    Email: '',
    shortdesc: '',
    description: '',
    image: null,
    status: 0,
    featured: 0,
    categoryid: null,
    facebook: '',
    twitter: '',
    linkedin: '',
    threads: '',
    meta_title: '',
    meta_keywords: '',
    meta_description: '',
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminNav />
      <main className="flex-1 p-4 lg:ml-64 pt-14 lg:pt-0 lg:p-8">
        <ProfileEditClient
          profile={emptyProfile}
          categories={categories}
          isNew
        />
      </main>
    </div>
  )
}