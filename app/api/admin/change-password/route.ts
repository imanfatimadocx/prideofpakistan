import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string })?.role
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const { currentPassword, newPassword } = await req.json()

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Both fields are required.' }, { status: 400 })
  }

  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 })
  }

  const email = session?.user?.email
  if (!email) return NextResponse.json({ error: 'Session error.' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.password) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 })
  }

  const valid = await bcrypt.compare(currentPassword, user.password)
  if (!valid) {
    return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 })
  }

  const hash = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({ where: { email }, data: { password: hash } })

  return NextResponse.json({ success: true })
}