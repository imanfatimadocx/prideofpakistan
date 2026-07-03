import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  try {
    const posts = await prisma.blog.findMany({
      where: { status: 'active' },
      orderBy: { date: 'desc' },
      take: 20,
    })
    return NextResponse.json(posts)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
