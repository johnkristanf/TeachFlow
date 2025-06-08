import { db } from '@/database'
import { essay } from '@/database/schema'
import { Essay } from '@/types/essay'

export async function createEssay(data: Essay) {
    const [result] = await db.insert(essay).values(data).returning({ id: essay.id }) // Only return the ID
    console.log('Inserted Essay ID:', result.id)
    return result.id
}
