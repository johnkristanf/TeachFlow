import { NextRequest, NextResponse } from 'next/server'
import { and, eq, inArray } from 'drizzle-orm'
import { db } from '@/database'
import { rubrics, criteria, levels } from '@/database/schema'
import { Levels } from '@/types/rubrics'
import { auth } from '@/auth'

export const PUT = auth(async function PUT(req) {
    if (!req.auth || !req.auth.user?.id) {
        return NextResponse.json({ message: 'User unauthenticated' }, { status: 401 })
    }

    const userId = req.auth.user.id
    const id = req.nextUrl.pathname.split('/').pop()
    const rubricID = Number(id)

    if (isNaN(rubricID)) {
        return NextResponse.json({ success: false, message: 'Invalid rubric ID' }, { status: 400 })
    }

    const body = await req.json()

    const { name, grade, intensity, category, language, created_by, criteria: criteriaData } = body

    try {
        // 1. Update rubric
        await db
            .update(rubrics)
            .set({ name, grade, intensity, category, language, created_by })
            .where(and(eq(rubrics.id, rubricID), eq(rubrics.userId, userId)))

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
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
})

export const DELETE = auth(async function DELETE(req) {
    if (!req.auth || !req.auth.user?.id) {
        return NextResponse.json({ message: 'User unauthenticated' }, { status: 401 })
    }

    const userId = req.auth.user.id
    const id = req.nextUrl.pathname.split('/').pop()
    const rubricID = Number(id)

    if (isNaN(rubricID)) {
        return NextResponse.json({ success: false, message: 'Invalid rubric ID' }, { status: 400 })
    }

    try {
        await db.delete(rubrics).where(and(eq(rubrics.id, rubricID), eq(rubrics.userId, userId)))
        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('Failed to delete rubric:', err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
})
