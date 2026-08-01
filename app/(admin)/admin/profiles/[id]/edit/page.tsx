import { notFound } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import AdminNav from '@/app/components/admin/AdminNav'
import ProfileEditClient from './ProfileEditClient'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProfileEditPage({ params }: Props) {
  const { id } = await params
  const profileId = Number(id)
  if (Number.isNaN(profileId)) notFound()

  const [profile, categories] = await Promise.all([
    prisma.hallOfFame.findUnique({ where: { id: profileId } }),
    prisma.hallCategory.findMany({ orderBy: { categoryname: 'asc' } }),
  ])

  if (!profile) notFound()

  const serialized = {
    id: profile.id,
    title: profile.title ?? '',
    Profession: profile.Profession ?? '',
    City: profile.City ?? '',
    Country: profile.Country ?? '',
    Email: profile.Email ?? '',
    shortdesc: profile.shortdesc ?? '',
    description: profile.description ?? '',
    image: profile.image ?? null,
    status: profile.status ?? 0,
    featured: profile.feature ?? 0,
    categoryid: profile.categoryid ?? null,
    facebook: profile.facebook ?? '',
    twitter: profile.twitter ?? '',
    linkedin: profile.linkedin ?? '',
    meta_title: profile.meta_title ?? '',
    meta_keywords: profile.meta_keyword ?? '',
    meta_description: profile.meta_desc ?? '',
  }

  const cats = categories.map((c) => ({
    categoryid: c.categoryid,
    categoryname: c.categoryname,
  }))

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminNav />
      <main className="flex-1 p-4 lg:ml-64 pt-14 lg:pt-8 lg:p-8">
        <ProfileEditClient profile={serialized} categories={cats} />
      </main>
    </div>
  )
}