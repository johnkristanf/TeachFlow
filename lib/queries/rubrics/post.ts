import { db } from '@/database'
import { criteria, levels, rubrics } from '@/database/schema'

export async function createRubric(data: any, userID: string) {
    const [rubric] = await db
        .insert(rubrics)
        .values({
            name: data.name,
            grade: data.grade,
            intensity: data.intensity,
            category: data.category,
            language: data.language,
            userId: userID,
            created_by: 'my_rubrics'
        })
        .returning()

    for (const crit of data.criteria) {
        const [critRow] = await db
            .insert(criteria)
            .values({
                rubricId: rubric.id,
                title: crit.title,
            })
            .returning()

        await db.insert(levels).values(
            crit.levels.map((level: any) => ({
                criterionId: critRow.id,
                label: level.label,
                score: level.score,
                description: level.description,
            }))
        )
    }

    return rubric
}
