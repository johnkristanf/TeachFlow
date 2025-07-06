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
import { accounts, users } from '@/database/schema'
import { eq } from 'drizzle-orm'

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

                    phone: null,
                    location: null,
                    created_at: new Date(),
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

        async jwt({ token, user, account, trigger }) {
            if (trigger === 'update') {
                console.log('TRIGGERED JWT KA PART')

                try {
                    const latestUser = await db
                        .select({
                            name: users.name,
                            email: users.email,
                            phone: users.phone,
                            location: users.location,
                            image: users.image,
                            created_at: users.createdAt,
                            provider: accounts.provider,
                        })
                        .from(users)
                        .leftJoin(accounts, eq(users.id, accounts.userId))
                        .where(eq(users.id, token.id as string))
                        .limit(1)

                    if (latestUser[0]) {
                        // Update the token with fresh data from database
                        token.name = latestUser[0].name
                        token.email = latestUser[0].email
                        token.phone = latestUser[0].phone
                        token.location = latestUser[0].location
                        token.image = latestUser[0].image
                        token.provider = latestUser[0].provider!
                        token.created_at = latestUser[0].created_at!
                    }
                } catch (error) {
                    console.error('Error fetching latest user data:', error)
                }
            }

            if (user) {
                token.id = user.id
                token.name = user.name
                token.email = user.email
                token.image = user.image
                token.phone = user.phone
                token.location = user.location
                token.provider = account?.provider
                token.created_at = user.created_at
            }

            return token
        },

        async session({ session, token, trigger }) {
            // This formats what the frontend session looks like

            if (trigger === 'update') {
                console.log('TRIGGERED SESSION KA PART')
            }
            if (session.user && token) {
                session.user.id = token.id as string
                session.user.name = token.name as string
                session.user.email = token.email as string
                session.user.image = token.image as string
                session.user.phone = token.phone as string
                session.user.location = token.location as string
                session.user.provider = token.provider as string
                session.user.created_at = token.created_at as Date
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
