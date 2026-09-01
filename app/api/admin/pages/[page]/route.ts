import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

async function adminCheck() {
  const session = await getServerSession(authOptions)
  return (session?.user as { role?: string })?.role === 'ADMIN'
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  const { page } = await params
  const record = await prisma.pageContent.findUnique({ where: { page } })
  return NextResponse.json(record?.content ?? null)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  if (!await adminCheck()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const { page } = await params
  const content = await req.json()

  await prisma.pageContent.upsert({
    where: { page },
    update: { content },
    create: { page, content },
  })

  return NextResponse.json({ success: true })
}