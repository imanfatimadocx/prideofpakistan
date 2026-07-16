import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string })?.role
  if (!session || role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const { id, status } = await req.json()
    if (id === undefined || ![0, 1, 2].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    await prisma.hallOfFame.update({
      where: { id: Number(id) },
      data: { status: Number(status) },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Profile update error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}