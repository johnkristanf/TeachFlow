// lib/auth-actions.ts (or actions/auth.ts)
'use server'

import { signIn, signOut } from '@/auth'

export async function signInWithGoogle() {
    await signIn('google', { redirectTo: '/essays' })
}

export async function signInWithFacebook() {
    await signIn('facebook', { redirectTo: '/essays' })
}

export async function signOutUser() {
    await signOut({ redirectTo: '/' })
}
