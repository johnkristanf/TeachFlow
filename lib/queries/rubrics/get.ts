import { db } from '@/database'
import { rubrics } from '@/database/schema'
import { desc } from 'drizzle-orm'

export async function getRubrics() {
    const data = await db.select().from(rubrics).orderBy(desc(rubrics.createdAt))
    return data
}
