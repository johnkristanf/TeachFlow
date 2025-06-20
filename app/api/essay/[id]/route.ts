import { db } from '@/database'
import { essay } from '@/database/schema'
import { eq, sql } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest) {
    const url = new URL(req.url)
    const essayID = Number(url.pathname.split('/').pop())

    if (isNaN(essayID)) {
        return NextResponse.json(
            { success: false, message: 'Invalid ID' },
            { status: 400 }
        )
    }

    try {
        await db.transaction(async (tx) => {
            // DELETE THE CHILD DATA TABLE FIRST TO AVOID FK CONSTRAINTS ERROR
            await tx.execute(
                sql`DELETE FROM essay_evaluations WHERE essay_id = ${essayID}`
            )
            await tx.execute(sql`DELETE FROM essay_summaries WHERE essay_id = ${essayID}`)

            await tx.delete(essay).where(eq(essay.id, essayID))
        })

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (err) {
        console.error('Failed to delete rubric:', err)
        return NextResponse.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        )
    }
}
