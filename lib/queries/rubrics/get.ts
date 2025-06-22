import { db } from '@/database'
import { criteria, levels, rubrics } from '@/database/schema'
import { Criteria } from '@/types/rubrics'
import { and, desc, eq, inArray } from 'drizzle-orm'

export async function getAllRubrics() {
    const data = await db.select().from(rubrics).orderBy(desc(rubrics.createdAt))
    return data
}

export async function getRubricsWithDetails(source: string | null, userID: string) {
    const conditions = [eq(rubrics.userId, userID)]

    if (source) {
        conditions.push(eq(rubrics.created_by, source))
    }

    const rubricList = await db
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
        .where(and(...conditions))
        .orderBy(desc(rubrics.createdAt)) // 🆕 Sort by latest

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

export async function getRubricCriteria(rubricName: string, userID: string) {
    try {
        const result = await db
            .select({
                // Rubric fields
                rubricId: rubrics.id,
                rubricName: rubrics.name,
                grade: rubrics.grade,
                intensity: rubrics.intensity,
                category: rubrics.category,
                language: rubrics.language,
                created_by: rubrics.created_by,
                createdAt: rubrics.createdAt,
                // Criteria fields
                criterionId: criteria.id,
                criterionTitle: criteria.title,
                // Level fields
                levelId: levels.id,
                levelLabel: levels.label,
                levelScore: levels.score,
                levelDescription: levels.description,
            })
            .from(rubrics)
            .leftJoin(criteria, eq(rubrics.id, criteria.rubricId))
            .leftJoin(levels, eq(criteria.id, levels.criterionId))
            .where(and(eq(rubrics.name, rubricName), eq(rubrics.userId, userID)))
        if (!result.length) {
            console.log(`Rubric '${rubricName}' not found`)
            return null
        }

        // Transform flat result into nested structure
        const rubricData = result[0]
        const criteriaMap = new Map<number, Criteria>()

        result.forEach((row) => {
            if (row.criterionId) {
                // Add criterion if not exists
                if (!criteriaMap.has(row.criterionId)) {
                    criteriaMap.set(row.criterionId, {
                        id: row.criterionId,
                        rubricId: row.rubricId,
                        title: row.criterionTitle!,
                        levels: [],
                    })
                }

                // Add level if exists
                if (row.levelId) {
                    const criterion = criteriaMap.get(row.criterionId)!
                    criterion.levels.push({
                        id: row.levelId,
                        criterionId: row.criterionId,
                        label: row.levelLabel!,
                        score: row.levelScore!,
                        description: row.levelDescription ?? '',
                    })
                }
            }
        })

        return {
            id: rubricData.rubricId,
            name: rubricData.rubricName,
            grade: rubricData.grade,
            intensity: rubricData.intensity,
            category: rubricData.category,
            language: rubricData.language,
            created_by: rubricData.created_by,
            createdAt: rubricData.createdAt,
            criteria: Array.from(criteriaMap.values()),
        }
    } catch (error) {
        console.error('Error in POST /api/essay/re-grade:', error)
        throw error
    }
}
