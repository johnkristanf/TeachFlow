// lib/auth-actions.ts (or actions/auth.ts)
'use server'

import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'

export async function signInWithGoogle() {
    await signIn('google', { redirectTo: '/essays' })
}

export async function signInWithFacebook() {
    await signIn('facebook', { redirectTo: '/essays' })
}

export async function signInWithMagicLink(formData: FormData) {
    await signIn('resend', formData)
}

export async function signInWithCredentials(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    console.log('🚀 Starting credentials sign in for:', email)

    try {
        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        })

        return result
    } catch (error: any) {
        console.log('Sign in error caught:', error)

        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    throw new Error('Invalid login credentials.')
                case 'OAuthAccountNotLinked':
                    throw new Error('Please sign in with the same account you used originally.')
                default:
                    throw new Error('Something went wrong during login.')
            }
        }

        // Re-throw other errors (like NEXT_REDIRECT)
        throw error
    }
}

export async function signOutUser() {
    await signOut({ redirectTo: '/' })
}
