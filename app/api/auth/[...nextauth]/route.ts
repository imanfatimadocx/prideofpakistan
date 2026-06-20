// import NextAuth from "next-auth"
// import CredentialsProvider from "next-auth/providers/credentials"
// import { prisma } from "@/lib/prisma"
// import bcrypt from "bcryptjs"

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       credentials: {
//         email: { type: "email" },
//         password: { type: "password" }
//       },
//       async authorize(credentials) {
//         const user = await prisma.user.findUnique({
//           where: { email: credentials?.email }
//         })
//         if (!user || !credentials?.password) return null
//         const ok = await bcrypt.compare(
//           credentials.password, user.password ?? ""
//         )
//         return ok ? user : null
//       }
//     })
//   ],
//   pages: { signIn: "/admin/login" },
//   callbacks: {
//     session({ session, token }) {
//       if (session.user) session.user.role = token.role as string
//       return session
//     }
//   }
// })

// export { handler as GET, handler as POST }