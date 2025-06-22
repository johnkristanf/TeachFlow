import { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

export const nextAuthConfig: NextAuthConfig = {
    secret: process.env.AUTH_SECRET,
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
                // Fetch the existing user from DB by email or provider ID
                const respData = await fetch(`${process.env.NEXTAUTH_URL}/api/users/save?email=${user.email}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                })

                const existingUser = await respData.json()

                if (existingUser) {
                    token.id = existingUser.id
                    token.email = existingUser.email
                    token.name = existingUser.name
                    token.picture = existingUser.image
                    token.role = existingUser.role // if you store roles
                } else {
                    // First time login → insert user
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

                    token.id = user.id
                    token.email = user.email
                    token.name = user.name
                    token.picture = user.image
                }
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
                // session.user.role = token.role as string
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
