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
    linkedin: '',
    threads: '',
    meta_title: '',
    meta_keywords: '',
    meta_description: '',
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <main className="flex-1 p-4 lg:p-8">
        <ProfileEditClient
          profile={emptyProfile}
          categories={categories}
          isNew
        />
      </main>
    </div>
  )
}