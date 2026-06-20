import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash("your-admin-password", 12)
  await prisma.user.upsert({
    where: { email: "admin@prideofpakistan.com" },
    update: {},
    create: { email: "admin@prideofpakistan.com", password: hash }
  })
}
main()