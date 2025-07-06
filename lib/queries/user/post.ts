import { db } from '@/database'
import { users } from '@/database/schema'
import { eq } from 'drizzle-orm'

export async function updateUserAvatar(userID: string, avatarURL: string) {
    try {
        await db.update(users).set({ image: avatarURL }).where(eq(users.id, userID))
    } catch (error) {
        console.error('Error updating user avatar: ', error)
        throw error
    }
}
