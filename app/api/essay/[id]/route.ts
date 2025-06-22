import { auth } from '@/auth'
import { db } from '@/database'
import { essay } from '@/database/schema'
import { and, eq, sql } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export const DELETE = auth(async function DELETE(req) {
    if (!req.auth || !req.auth.user?.id) {
        return NextResponse.json({ message: 'User unauthenticated' }, { status: 401 })
    }

    const userId = req.auth.user.id;
    const url = new URL(req.url)
    const essayID = Number(url.pathname.split('/').pop())

    if (isNaN(essayID)) {
        return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 })
    }

    try {
        await db.transaction(async (tx) => {
            // DELETE THE CHILD DATA TABLE FIRST TO AVOID FK CONSTRAINTS ERROR
            await tx.execute(sql`DELETE FROM essay_evaluations WHERE essay_id = ${essayID}`)
            await tx.execute(sql`DELETE FROM essay_summaries WHERE essay_id = ${essayID}`)

            await tx.delete(essay).where(
                and(
                    eq(essay.id, essayID),
                    eq(essay.userId, userId) // 👈 additional condition
                )
            )
        })

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (err) {
        console.error('Failed to delete rubric:', err)
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
    }
})
