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
  const profile = await prisma.hallOfFame.findUnique({ where: { id: Number(id) } })
  if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(profile)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await adminCheck()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const { id } = await params
  const body = await req.json()

  try {
    const updated = await prisma.hallOfFame.update({
      where: { id: Number(id) },
      data: {
        ...(body.title       !== undefined && { title: body.title }),
        ...(body.Profession  !== undefined && { Profession: body.Profession }),
        ...(body.City        !== undefined && { City: body.City }),
        ...(body.Country     !== undefined && { Country: body.Country }),
        ...(body.Email       !== undefined && { Email: body.Email }),
        ...(body.shortdesc   !== undefined && { shortdesc: body.shortdesc }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.status      !== undefined && { status: Number(body.status) }),
        ...(body.image       !== undefined && { image: body.image }),
        ...(body.facebook    !== undefined && { facebook: body.facebook }),
        ...(body.twitter     !== undefined && { twitter: body.twitter }),
        ...(body.linkedin    !== undefined && { linkedin: body.linkedin }),
        ...(body.threads !== undefined && { threads: body.threads }),
      },
    })
    return NextResponse.json({ success: true, updated })
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
    await prisma.hallOfFame.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}