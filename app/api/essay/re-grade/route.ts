import { updateEssayStatus } from '@/lib/queries/essays/update'
import { getRubricCriteria } from '@/lib/queries/rubrics/get'
import { publishToQueue } from '@/lib/rabbitmq/publisher'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()

        const essayID = formData.get('essay_id') as string
        const essayText = formData.get('essay_text') as string
        const rubricUsed = formData.get('rubric_used') as string

        console.log('Form Fields:')
        console.log('- essay_id:', essayID)
        console.log('- essayText:', essayText)
        console.log('- rubric_used:', rubricUsed)

        const rubricCriteria = await getRubricCriteria(rubricUsed)
        console.log('- rubricCriteria:', rubricCriteria)

        await publishToQueue('grading_events', {
            event: 'ESSAY_SUBMITTED',
            essay_id: essayID,
            essay_text: essayText,
            rubric_criteria: rubricCriteria,
        })

        await updateEssayStatus(essayID, 'pending')

        return NextResponse.json({ message: 'Submitted for Regrading' })

    } catch (error) {
        console.error('Failed regrade essay:', error)
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}
