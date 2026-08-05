import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

async function adminCheck() {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string })?.role
  return role === 'ADMIN'
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await adminCheck()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const { id } = await params
  const { categoryname } = await req.json()
  await prisma.hallCategory.update({
    where: { categoryid: Number(id) },
    data: { categoryname: categoryname.trim() },
  })
  return NextResponse.json({ success: true })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await adminCheck()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const { id } = await params
  await prisma.hallCategory.delete({ where: { categoryid: Number(id) } })
  return NextResponse.json({ success: true })
}