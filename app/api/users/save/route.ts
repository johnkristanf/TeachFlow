import { db } from '@/database'
import { users, accounts } from '@/database/schema'

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
            id: crypto.randomUUID(),
            userId: body.id,
            type: 'oauth',
            provider: body.provider,
            providerAccountId: body.providerAccountId,
        })

        return new Response('User inserted', { status: 201 })
    } catch (err) {
        console.error(err)
        return new Response('Insert failed', { status: 500 })
    }
}
