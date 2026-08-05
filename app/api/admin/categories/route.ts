import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

async function adminCheck() {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string })?.role
  return role === 'ADMIN'
}

export async function POST(req: NextRequest) {
  if (!await adminCheck()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const { categoryname } = await req.json()
  if (!categoryname?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 })

  const cat = await prisma.hallCategory.create({
    data: { categoryname: categoryname.trim(), status: 1 },
  })
  return NextResponse.json({ categoryid: cat.categoryid })
}