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
  const biz = await prisma.business.findUnique({ where: { id: Number(id) } })
  if (!biz) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(biz)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await adminCheck()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const { id } = await params
  const body = await req.json()

  try {
    const updated = await prisma.business.update({
      where: { id: Number(id) },
      data: {
        ...(body.company_name         !== undefined && { company_name: body.company_name }),
        ...(body.shortdesc            !== undefined && { shortdesc: body.shortdesc }),
        ...(body.company_description  !== undefined && { company_description: body.company_description }),
        ...(body.city                 !== undefined && { city: body.city }),
        ...(body.country              !== undefined && { country: body.country }),
        ...(body.email                !== undefined && { email: body.email }),
        ...(body.phone                !== undefined && { phone: body.phone }),
        ...(body.address              !== undefined && { address: body.address }),
        ...(body.site_url             !== undefined && { site_url: body.site_url }),
        ...(body.status               !== undefined && { status: Number(body.status) }),
        ...(body.image                !== undefined && { image: body.image }),
        ...(body.busniss_id           !== undefined && { busniss_id: Number(body.busniss_id) }),
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
    await prisma.business.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}