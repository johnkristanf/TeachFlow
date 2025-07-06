import { auth } from '@/auth'
import { db } from '@/database'
import { users } from '@/database/schema'
import { updateProfileSchema } from '@/lib/zod'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export const PUT = auth(async function PUT(req) {
    if (!req.auth || !req.auth.user?.id) {
        return NextResponse.json({ error: 'User unauthenticated' }, { status: 401 })
    }
    const body = await req.json()
    const validated = updateProfileSchema.parse(body)
    const userId = req.auth.user.id

    try {
        // CHECK FOR EXISTING USER
        const existingUser = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.email, validated.email))
            .limit(1)

        if (existingUser.length > 0 && existingUser[0].id !== userId) {
            return NextResponse.json(
                {
                    error: 'Email address is already taken.',
                    code: 'DUPLICATE_EMAIL',
                },
                { status: 409 }
            )
        }

        const updatedUser = await db
            .update(users)
            .set({
                name: validated.name,
                email: validated.email,
                phone: validated.phone?.trim() ? validated.phone : null,
                location: validated.location?.trim() ? validated.location : null,
            })
            .where(eq(users.id, userId))
            .returning({
                name: users.name,
                email: users.email,
                phone: users.phone,
                location: users.location,
            })

        const user = updatedUser[0]
        return NextResponse.json({ message: 'Profile updated successfully', user: user })
    } catch (error) {
        console.error('Error updating user data: ', error)
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation failed', errors: error.errors },
                { status: 400 }
            )
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
})
