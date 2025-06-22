import { db } from '@/database'
import { essay } from '@/database/schema'
import { and, eq } from 'drizzle-orm'

export async function updateEssayStatus(essayID: number, userID: string, status: string) {
    try {
        await db
            .update(essay)
            .set({ status: status })
            .where(and(eq(essay.id, essayID), eq(essay.userId, userID)))
    } catch (error) {
        const errorMessage = `Failed to update essay status for ID ${essayID} to '${status}'.`
        console.error(errorMessage, error)
        throw new Error(errorMessage, { cause: error })
    }
}
