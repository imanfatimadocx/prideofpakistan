import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const entityType = searchParams.get('entityType')
  const entityId   = searchParams.get('entityId')

  if (!entityType || !entityId) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  const comments = await prisma.comment.findMany({
    where: {
      entityType,
      entityId: Number(entityId),
      approved: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(comments)
}

export async function POST(req: NextRequest) {
  try {
    const { content, authorName, authorEmail, entityType, entityId } = await req.json()

    if (!content || !authorName || !authorEmail || !entityType || !entityId) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    if (content.trim().length < 3) {
      return NextResponse.json({ error: 'Comment is too short.' }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim(),
        entityType,
        entityId: Number(entityId),
        approved: false, // admin must approve
      },
    })

    return NextResponse.json({ success: true, id: comment.id })
  } catch (err) {
    console.error('Comment error:', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}