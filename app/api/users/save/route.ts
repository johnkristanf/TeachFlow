import { db } from '@/database'
import { users, accounts } from '@/database/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: Request) {
    const body = await req.json()

    try {
        await db.insert(users).values({
            id: body.id,
            email: body.email,
            name: body.name,
            image: body.image,
        })

        await db.insert(accounts).values({
            userId: body.id,
            type: 'oauth',
            provider: body.provider,
            providerAccountId: body.providerAccountId,
        })

        return new Response('User inserted', { status: 201 })
    } catch (error) {
        console.error('Error in creating new user: ', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    try {
        const existingUser = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                image: users.image,
            })
            .from(users)
            .where(eq(users.email, email))
            .then((res) => res[0] ?? null) // 👈 returns null if not found

        return NextResponse.json(existingUser, { status: 200 })
    } catch (error) {
        console.error('Error in checking existing user: ', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
