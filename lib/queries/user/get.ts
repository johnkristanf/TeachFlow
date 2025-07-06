import { db } from '@/database'
import { users } from '@/database/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt'
import { User } from '@/types/user'

export async function authenticate(email: string, password: string): Promise<User | null> {
    const [user] = await db
        .select({
            id: users.id,
            name: users.name,
            image: users.image,
            email: users.email,
            password: users.password,

            phone: users.phone,
            location: users.location,
            created_at: users.createdAt,
        })
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

    const isValidPassword = await bcrypt.compare(password, user.password ?? '')
    if (!user || !isValidPassword) {
        return null
    }

    return user
}
