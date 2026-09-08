import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

async function adminCheck() {
  const session = await getServerSession(authOptions)
  return (session?.user as { role?: string })?.role === 'ADMIN'
}

export async function GET() {
  if (!await adminCheck()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const sections = await prisma.homepageContent.findMany({ orderBy: { section: 'asc' } })
  return NextResponse.json(sections)
}