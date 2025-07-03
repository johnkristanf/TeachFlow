import { NextAuthConfig } from 'next-auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/database'

import Resend from 'next-auth/providers/resend'
import Google from 'next-auth/providers/google'
import Facebook from 'next-auth/providers/facebook'
import Credentials from 'next-auth/providers/credentials'
import { ZodError } from 'zod'
import { signInSchema } from '../zod'
import { authenticate } from '../queries/user/get'

export const nextAuthConfig: NextAuthConfig = {
    secret: process.env.AUTH_SECRET,
    adapter: DrizzleAdapter(db),
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
            // Add authorization parameters to request proper scopes
            authorization: {
                params: {
                    scope: 'openid email profile',
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code',
                },
            },
            // Ensure we get the right user info
            profile(profile) {
                console.log('Google Profile Data:', profile)
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                }
            },
        }),

        Credentials({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },

            async authorize(credentials) {
                try {
                    const { email, password } = await signInSchema.parseAsync(credentials)

                    console.log('email: ', email)
                    console.log('password: ', password)

                    const user = await authenticate(email, password)

                    console.log('user: ', user)

                    if (!user) {
                        return null
                    }

                    return user
                } catch (error: any) {
                    console.error('Error in signing in user: ', error.message)
                    return null
                }
            },
        }),
    ],

    callbacks: {
        async signIn({ user, account, profile }) {
            // Optional: Add custom validation logic here before user data 
            // gets sent to the session or jwt
            return true
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.name = user.name
                token.email = user.email
                token.image = user.image
            }
            return token
        },

        async session({ session, token }) {
            // This formats what the frontend session looks like
            if (session.user && token) {
                session.user.id = token.id as string
                session.user.name = token.name as string
                session.user.email = token.email as string
                session.user.image = token.image as string
            }
            return session
        },
    },

    // THINK OF EVENT LIKE A WEBHOOK WHERE YOU PERFORM BACKGROUND TASK
    // IF A CERTAIN EVENT IS FINISHED
    events: {
        async signIn({ user, account, profile, isNewUser }) {
            console.log('User signed in:', {
                userId: user.id,
                email: user.email,
                provider: account?.provider,
                isNewUser,
            })

            if (isNewUser) {
                console.log('New user created:', user.email)
                // Send welcome email, create default settings, etc.
            }
        },

        async createUser({ user }) {
            console.log('New_user_created:', {
                userId: user.id,
                email: user.email,
            })
        },

        async linkAccount({ user, account }) {
            console.log('Account linked:', {
                userId: user.id,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
            })
        },
    },

    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // optional: session valid for 30 days
    },

    pages: {
        signIn: '/auth/signin',
        verifyRequest: '/auth/verify-request',
    },
}
