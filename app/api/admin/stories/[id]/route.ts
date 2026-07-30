import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

async function adminCheck() {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string })?.role
  return role === 'ADMIN'
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await adminCheck()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const { id } = await params
  const story = await prisma.story.findUnique({ where: { id: Number(id) } })
  if (!story) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    ...story,
    createdAt: story.createdAt.toISOString(),
    updatedAt: story.updatedAt.toISOString(),
  })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await adminCheck()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const { id } = await params
  const body = await req.json()

  try {
    await prisma.story.update({
      where: { id: Number(id) },
      data: {
        ...(body.title     !== undefined && { title: body.title }),
        ...(body.shortdesc !== undefined && { shortdesc: body.shortdesc }),
        ...(body.content   !== undefined && { content: body.content }),
        ...(body.status    !== undefined && { status: body.status }),
        ...(body.image     !== undefined && { image: body.image }),
      },
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await adminCheck()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const { id } = await params
  try {
    await prisma.story.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}