export const runtime = 'nodejs'

import NextAuth from 'next-auth'
import { nextAuthConfig } from './lib/next-auth/config'

export const { handlers, signIn, signOut, auth } = NextAuth(nextAuthConfig)
