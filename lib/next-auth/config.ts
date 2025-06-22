import { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

export const nextAuthConfig: NextAuthConfig = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
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
    ],
    callbacks: {
        async jwt({ token, user, account, profile }) {
            // console.log('=== JWT CALLBACK ===')
            // console.log('Token:', token)
            // console.log('User:', user)
            // console.log('Account:', account)
            // console.log('Profile:', profile)
            // console.log('==================')

            // On first sign in, user object will be available
            if (user && account) {
                // GOOGLE DATA API INSERTION DUE TO EDGERUNTIME NOT SUPPORTING
                // NATIVE MODULES

                await fetch(`${process.env.NEXTAUTH_URL}/api/users/save`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        provider: account.provider,
                        providerAccountId: account.providerAccountId,
                    }),
                })

                // STORE DATA TO TOKEN
                token.id = user.id
                token.email = user.email
                token.name = user.name
                token.picture = user.image
            }

            return token
        },
        async session({ session, token }) {
            // console.log('=== SESSION CALLBACK ===')
            // console.log('Session before:', session)
            // console.log('Token:', token)

            // Send properties to the client
            if (token) {
                session.user.id = token.id as string
                session.user.email = token.email as string
                session.user.name = token.name as string
                session.user.image = token.picture as string
            }

            // console.log('Session after:', session)
            // console.log('=======================')
            return session
        },

    },
    session: {
        strategy: 'jwt',
    },
}
