import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      where: { status: 'approved' },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(stories)
  } catch (err) {
    console.error('Stories GET error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'You must be logged in to submit a story.' }, { status: 401 })
  }

  try {
    const { title, content, shortdesc } = await req.json()

    if (!title?.trim() || !content?.trim() || !shortdesc?.trim()) {
      return NextResponse.json({ error: 'Title, summary and content are required.' }, { status: 400 })
    }

    const story = await prisma.story.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        shortdesc: shortdesc.trim(),
        authorId: session.user.email ?? 'unknown',
        authorName: session.user.name ?? session.user.email ?? 'Anonymous',
        status: 'pending',
      },
    })

    return NextResponse.json({ success: true, id: story.id })
  } catch (err) {
    console.error('Story POST error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}