import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/app/lib/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    // Admin login
    CredentialsProvider({
      id: 'admin-credentials',
      name: 'Admin',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          if (!user || !user.password) return null

          const ok = await bcrypt.compare(credentials.password, user.password)
          if (!ok) return null

          return { id: user.id, email: user.email, role: 'ADMIN' }
        } catch (err) {
          console.error('Admin auth error:', err)
          return null
        }
      },
    }),

    // Public user login
    CredentialsProvider({
      id: 'public-credentials',
      name: 'Account',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const user = await prisma.publicUser.findUnique({
            where: { email: credentials.email },
          })

          if (!user) return null

          const ok = await bcrypt.compare(credentials.password, user.password)
          if (!ok) return null

          return { id: user.id, email: user.email, name: user.name, role: 'USER' }
        } catch (err) {
          console.error('Public auth error:', err)
          return null
        }
      },
    }),
  ],

  session: { strategy: 'jwt' },

  // Both login pages are custom — NextAuth never shows its own UI
  pages: {
    signIn: '/admin/login',
    error:  '/admin/login',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as { role?: string }).role = token.role as string
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  // Disable the built-in NextAuth pages entirely
  debug: false,
}