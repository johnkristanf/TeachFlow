import { auth } from '@/auth'
import { updateEssayStatus } from '@/lib/queries/essays/update'
import { getRubricCriteria } from '@/lib/queries/rubrics/get'
import { publishToQueue } from '@/lib/rabbitmq/publisher'
import { NextRequest, NextResponse } from 'next/server'

export const POST = auth(async function POST(req) {
    if (!req.auth) {
        return NextResponse.json(
            {
                message: 'User unauthenticated',
            },
            { status: 401 }
        )
    }
    try {
        const formData = await req.formData()

        const essayID = formData.get('essay_id') as string
        const essayText = formData.get('essay_text') as string
        const rubricName = formData.get('rubric_name') as string
        const rubricCategory = formData.get('rubric_category') as string
        const gradeLevel = formData.get('grade_level') as string
        const gradeIntensity = formData.get('grade_intensity') as string

        console.log('Form Fields:')
        console.log('- essay_id:', essayID)
        console.log('- essayText:', essayText)
        console.log('- rubric_name:', rubricName)
        console.log('- rubric_category:', rubricCategory)
        console.log('- grade_level:', gradeLevel)
        console.log('- grade_intensity:', gradeIntensity)

        const rubricCriteria = await getRubricCriteria(rubricName)
        console.log('- rubricCriteria:', rubricCriteria)

        await publishToQueue('grading_events', {
            event: 'ESSAY_SUBMITTED',
            essay_id: essayID,
            essay_text: essayText,
            rubric_category: rubricCategory,
            grade_level: gradeLevel,
            grade_intensity: gradeIntensity,
            rubric_criteria: rubricCriteria,
        })

        const parsedEssayID = Number(essayID)
        await updateEssayStatus(parsedEssayID, 'pending')

        return NextResponse.json({ message: 'Submitted for Regrading' })
    } catch (error) {
        console.error('Failed regrade essay:', error)
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
})
