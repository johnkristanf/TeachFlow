import { extractTextFromImage } from '@/lib/google-vision/extract'
import { getEssays } from '@/lib/queries/essays/get'
import { createEssay } from '@/lib/queries/essays/post'
import { publishToQueue } from '@/lib/rabbitmq/publisher'
import { Essay } from '@/types/essay'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const formData = await req.formData()

    const files = formData.getAll('files')

    // Get other form data fields
    const rubricName = formData.get('rubric_name') as string
    const rubricCriteria = formData.get('rubric_criteria') as string
    const gradingMethod = formData.get('gradingMethod') as string

    console.log('Form Fields:')
    console.log('- rubric_name:', rubricName)
    console.log('- rubric_criteria:', rubricCriteria)
    console.log('- gradingMethod:', gradingMethod)

    for (const file of files) {
        if (file instanceof File) {
            console.log(`Processing file: ${file.name} (${file.size} bytes, ${file.type})`)

            try {
                const buffer = Buffer.from(await file.arrayBuffer())
                const extractedText = await extractTextFromImage(buffer)

                const essayData: Essay = {
                    name: file.name,
                    rubricUsed: rubricName,
                    sourceType: gradingMethod,
                    essayText: extractedText,
                    status: 'pending',
                }

                const essayID = await createEssay(essayData)
                // EVENT TRIGGER BELOW

                await publishToQueue('grading_events', {
                    event: 'ESSAY_SUBMITTED',
                    essay_id: essayID,
                    essay_text: extractedText,
                    rubric_criteria: JSON.parse(rubricCriteria),
                })
            } catch (error) {
                console.error(`Failed to extract text from ${file.name}:`, error)
            }
        }
    }

    return NextResponse.json({
        message: 'Essay created and event published successfully',
    })
}

export async function GET() {
    try {
        const essays = await getEssays()
        return NextResponse.json(essays)
    } catch (error) {
        console.error(`Failed to get essays:`, error)
        return NextResponse.json(
            {
                message: 'Server Error Occured',
            },
            { status: 500 }
        )
    }
}
