import { db } from '@/database'
import { rubrics } from '@/database/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.pathname.split('/').pop()
    const rubricID = Number(id)

    if (isNaN(rubricID)) {
        return NextResponse.json(
            { success: false, message: 'Invalid rubric ID' },
            { status: 400 }
        )
    }

    try {
        await db.delete(rubrics).where(eq(rubrics.id, rubricID))
        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('Failed to delete rubric:', err)
        return NextResponse.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        )
    }
}
