import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const entityType = searchParams.get('entityType')
  const entityId   = searchParams.get('entityId')

  if (!entityType || !entityId) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  const comments = await prisma.comment.findMany({
    where: { entityType, entityId: Number(entityId), approved: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(comments)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json(
      { error: 'You must be signed in to leave a comment.', requiresAuth: true },
      { status: 401 }
    )
  }

  try {
    const { content, entityType, entityId } = await req.json()

    if (!content?.trim() || !entityType || !entityId) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    if (content.trim().length < 3) {
      return NextResponse.json({ error: 'Comment is too short.' }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorName: session.user.name ?? session.user.email ?? 'Anonymous',
        authorEmail: session.user.email ?? '',
        userId: session.user.email ?? '',
        entityType,
        entityId: Number(entityId),
        approved: true,
      },
    })

    return NextResponse.json({ success: true, comment })
  } catch (err) {
    console.error('Comment error:', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string })?.role
  if (!session || role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  await prisma.comment.delete({ where: { id: Number(id) } })
  return NextResponse.json({ success: true })
}