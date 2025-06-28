import { NextAuthConfig } from 'next-auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'

import Resend from 'next-auth/providers/resend'
import Google from 'next-auth/providers/google'
import Facebook from 'next-auth/providers/facebook'
import { db } from '@/database'

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

        Facebook({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: 'email public_profile ',
                },
            },

            profile(profile) {
                return {
                    id: profile.id,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture?.data?.url,
                }
            },
        }),

        Resend({
            apiKey: process.env.RESEND_API_KEY,
            from: process.env.EMAIL_FROM,

            sendVerificationRequest: async ({ identifier, url, provider }) => {
                const { host } = new URL(url)

                const html = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                            <h1 style="color: white; margin: 0;">Welcome to TeachFlow</h1>
                        </div>

                        <div style="padding: 40px; background: #f8f9fa;">
                            <h2 style="color: #333; margin-bottom: 20px;">Sign in to your account</h2>
                            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                                Click the button below to securely sign in to your account. This link will expire in 24 hours.
                            </p>

                            <a href="${url}" style="
                                display: inline-block;
                                background: #667eea;
                                color: white;
                                padding: 15px 30px;
                                text-decoration: none;
                                border-radius: 8px;
                                font-weight: bold;
                                margin-bottom: 20px;
                            ">
                                Sign In to TeachFlow
                            </a>

                            <p style="color: #999; font-size: 14px;">
                                If you didn't request this email, you can safely ignore it.
                            </p>
                        </div>
                        <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
                        © 2025 TeachFlow. All rights reserved.
                        </div>
                    </div>
                    `

                const res = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${provider.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        from: provider.from,
                        to: identifier,
                        subject: `Sign in to ${host}`,
                        html: html,
                        text: `Sign in to ${host}\n\nClick here to sign in: ${url}\n\nIf you didn't request this email, you can safely ignore it.`,
                    }),
                })

                if (!res.ok) {
                    throw new Error('Failed to send email')
                }
            },
        }),
    ],

    callbacks: {
        async signIn({ user, account, profile }) {
            // Optional: Add custom validation logic here

            // if (account?.provider === 'google') {
            //     // Example: Only allow verified Google emails
            //     return profile?.email_verified === true
            // }

            // if (account?.provider === 'facebook') {
            //     // Example: Ensure Facebook account has email
            //     return !!user.email
            // }

            // For email provider, NextAuth handles verification
            return true
        },

        // PURPOSE OF SESSION IS TO FORMAT WHAT DATA THE USER CAN SEE
        async session({ session, user }) {
            // User data comes fresh from database
            if (user) {
                session.user.id = user.id
                session.user.email = user.email
                session.user.name = user.name
                session.user.image = user.image
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

            // You can add custom logic here for new users
            if (isNewUser) {
                console.log('New user created:', user.email)
                // Send welcome email, create default settings, etc.
            }
        },

        async createUser({ user }) {
            console.log('New user created in database:', {
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
        strategy: 'database',
    },

    pages: {
        verifyRequest: '/auth/verify-request',
    },

    debug: process.env.NODE_ENV === 'development',
}
