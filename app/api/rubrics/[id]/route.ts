import { NextRequest, NextResponse } from 'next/server'
import { eq, inArray } from 'drizzle-orm'
import { db } from '@/database'
import { rubrics, criteria, levels } from '@/database/schema'
import { Levels } from '@/types/rubrics'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const rubricID = Number(params.id)

    if (isNaN(rubricID)) {
        return NextResponse.json(
            { success: false, message: 'Invalid ID' },
            { status: 400 }
        )
    }

    const body = await req.json()

    const {
        name,
        grade,
        intensity,
        category,
        language,
        created_by,
        criteria: criteriaData,
    } = body

    try {
        // 1. Update rubric
        await db
            .update(rubrics)
            .set({ name, grade, intensity, category, language, created_by })
            .where(eq(rubrics.id, rubricID))

        // 2. Delete old criteria and levels
        const existingCriteria = await db
            .select({ id: criteria.id })
            .from(criteria)
            .where(eq(criteria.rubricId, rubricID))

        const criteriaIds = existingCriteria.map((c) => c.id)

        if (criteriaIds.length > 0) {
            await db.delete(levels).where(inArray(levels.criterionId, criteriaIds))
            await db.delete(criteria).where(inArray(criteria.id, criteriaIds))
        }

        // 3. Insert new criteria and levels
        for (const criterion of criteriaData) {
            const insertedCriterion = await db
                .insert(criteria)
                .values({
                    rubricId: rubricID,
                    title: criterion.title,
                })
                .returning({ id: criteria.id })

            const newCriterionId = insertedCriterion[0].id

            const levelInserts = criterion.levels.map((level: Levels) => ({
                criterionId: newCriterionId,
                label: level.label,
                score: level.score,
                description: level.description ?? '',
            }))

            await db.insert(levels).values(levelInserts)
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('Error updating rubric:', err)
        return NextResponse.json(
            { success: false, error: 'Server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(req: Request) {
    const url = new URL(req.url)
    const rubricID = Number(url.pathname.split('/').pop())

    if (isNaN(rubricID)) {
        return NextResponse.json(
            { success: false, message: 'Invalid ID' },
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
