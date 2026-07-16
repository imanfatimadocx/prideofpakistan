import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })
  }

  try {
    const { name, country, description } = await req.json()

    if (!name?.trim() || !country?.trim()) {
      return NextResponse.json({ error: 'City name and country are required.' }, { status: 400 })
    }

    await prisma.citySubmission.create({
      data: {
        name: name.trim(),
        country: country.trim(),
        description: description?.trim() ?? '',
        authorId: session.user.email ?? 'unknown',
        authorName: session.user.name ?? session.user.email ?? 'Anonymous',
        authorEmail: session.user.email ?? '',
        status: 'pending',
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('City submit error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}