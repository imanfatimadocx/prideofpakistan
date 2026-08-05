import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const email = session.user.email ?? ''

  try {
    const [profiles, businesses, stories, cities] = await Promise.all([
      prisma.hallOfFame.findMany({
        where: { Email: email },
        select: { id: true, title: true, status: true },
        orderBy: { id: 'desc' },
      }),
      prisma.business.findMany({
        where: { email },
        select: { id: true, company_name: true, status: true },
        orderBy: { id: 'desc' },
      }),
      prisma.story.findMany({
        where: { authorId: email },
        select: { id: true, title: true, status: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.citySubmission.findMany({
        where: { authorEmail: email },
        select: { id: true, name: true, status: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    const submissions = [
      ...profiles.map((p) => ({
        id: p.id,
        type: 'profile' as const,
        title: p.title ?? 'Untitled Profile',
        status: String(p.status ?? 0),
        createdAt: new Date().toISOString(),
      })),
      ...businesses.map((b) => ({
        id: b.id,
        type: 'business' as const,
        title: b.company_name,
        status: String(b.status),
        createdAt: new Date().toISOString(),
      })),
      ...stories.map((s) => ({
        id: s.id,
        type: 'story' as const,
        title: s.title,
        status: s.status,
        createdAt: s.createdAt.toISOString(),
      })),
      ...cities.map((c) => ({
        id: c.id,
        type: 'city' as const,
        title: c.name,
        status: c.status,
        createdAt: c.createdAt.toISOString(),
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json(submissions)
  } catch (err) {
    console.error('Dashboard submissions error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}