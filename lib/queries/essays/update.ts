import { db } from '@/database'
import { essay } from '@/database/schema'
import { eq } from 'drizzle-orm'

export async function updateEssayStatus(essayID: string, status: string) {
    try {
        await db.update(essay).set({ status: status }).where(eq(essay.id, essayID))
    } catch (error) {
        const errorMessage = `Failed to update essay status for ID ${essayID} to '${status}'.`
        console.error(errorMessage, error)
        throw new Error(errorMessage, { cause: error })
    }
}
