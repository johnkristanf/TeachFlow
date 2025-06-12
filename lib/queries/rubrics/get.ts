import { db } from '@/database'
import { criteria, levels, rubrics } from '@/database/schema'
import { desc, eq, inArray } from 'drizzle-orm'

export async function getAllRubrics() {
    const data = await db.select().from(rubrics).orderBy(desc(rubrics.createdAt))
    return data
}

export async function getRubricsWithDetails(source: string | null) {
    const baseQuery = db
        .select({
            id: rubrics.id,
            name: rubrics.name,
            grade: rubrics.grade,
            intensity: rubrics.intensity,
            category: rubrics.category,
            language: rubrics.language,
            created_by: rubrics.created_by,
        })
        .from(rubrics)
        .orderBy(desc(rubrics.createdAt)) // 🆕 Sort by latest

    const rubricList = source
        ? await baseQuery.where(eq(rubrics.created_by, source))
        : await baseQuery

    const rubricIds = rubricList.map((r) => r.id)

    // STEP 2: Get all criteria for those rubrics
    const criteriaList = await db
        .select()
        .from(criteria)
        .where(inArray(criteria.rubricId, rubricIds))

    const criterionIds = criteriaList.map((c) => c.id)

    // STEP 3: Get all levels for those criteria
    const levelsList = await db
        .select()
        .from(levels)
        .where(inArray(levels.criterionId, criterionIds))

    // STEP 4: Nest levels under criteria
    const criteriaWithLevels = criteriaList.map((crit) => ({
        ...crit,
        levels: levelsList.filter((lvl) => lvl.criterionId === crit.id),
    }))

    // STEP 5: Nest criteria under rubrics
    const rubricsWithDetails = rubricList.map((rubric) => ({
        ...rubric,
        criteria: criteriaWithLevels.filter((crit) => crit.rubricId === rubric.id),
    }))

    return rubricsWithDetails
}
