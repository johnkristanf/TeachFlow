import { db } from '@/database'
import { accounts, users } from '@/database/schema'
import { NextRequest, NextResponse } from 'next/server'
import brcypt from 'bcrypt'
import { RegisterCredentials } from '@/types/user'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { AdapterAccountType } from 'next-auth/adapters'

export async function POST(req: NextRequest) {
    try {
        const body: RegisterCredentials = await req.json()
        const { name, email, password } = body

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
        }

        // Check for existing user
        const existingUser = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.email, email))

        if (existingUser.length > 0) {
            return NextResponse.json({ error: 'user_already_exists' }, { status: 400 })
        }

        const hashedPassword = await brcypt.hash(password, 10)

        const newUser = {
            id: uuidv4(),
            name,
            email,
            password: hashedPassword,
        }

        await db.insert(users).values(newUser)

        await db.insert(accounts).values({
            userId: newUser.id,
            type: 'credentials' as AdapterAccountType,
            provider: 'credentials',
            providerAccountId: newUser.email,
        })

        return NextResponse.json(
            {
                message: 'User registered successfully',
                email: newUser.email,
                password: body.password, // plain for auto-login use only; do not expose in real apps
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error registering user: ', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
