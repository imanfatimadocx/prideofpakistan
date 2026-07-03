// prisma/seed-admin.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('actual-password', 12)
  await prisma.user.upsert({
    where: { email: 'admin@prideofpakistan.com' },
    update: {},
    create: { email: 'admin@prideofpakistan.com', password: hash, role: 'ADMIN' },
  })
  console.log('Admin user created.')
}

main().finally(() => prisma.$disconnect())