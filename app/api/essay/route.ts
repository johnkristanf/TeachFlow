import { enchanceImage } from '@/lib/enchancer/image_enchancer'
import { extractTextFromImage } from '@/lib/aws-textract/extract'
import { getEssays } from '@/lib/queries/essays/get'
import { createEssay } from '@/lib/queries/essays/post'
import { publishToQueue } from '@/lib/rabbitmq/publisher'
import { Essay } from '@/types/essay'
import { NextRequest, NextResponse } from 'next/server'
import { getFileExtension } from '@/lib/utils'

export async function POST(req: NextRequest) {
    const formData = await req.formData()

    const files = formData.getAll('files')

    // Get other form data fields
    const rubricID = formData.get('rubric_id') as string
    const rubricCategory = formData.get('rubric_category') as string
    const gradeLevel = formData.get('grade_level') as string
    const gradeIntensity = formData.get('grade_intensity') as string
    const rubricCriteria = formData.get('rubric_criteria') as string
    const gradingMethod = formData.get('gradingMethod') as string

    console.log('Form Fields:')
    console.log('- rubric_id:', rubricID)
    console.log('- rubric_category:', rubricCategory)
    console.log('- grade_level:', gradeLevel)
    console.log('- grade_intensity:', gradeIntensity)
    console.log('- gradingMethod:', gradingMethod)
    console.log('- rubric_criteria:', rubricCriteria)

    for (const file of files) {
        if (file instanceof File) {
            try {
                const fileName = file.name
                const mimeType = file.type
                const fileExt = getFileExtension(fileName)
                const buffer = Buffer.from(await file.arrayBuffer())

                console.log('fileName: ', fileName)
                console.log('mimeType: ', mimeType)
                console.log('fileExt: ', fileExt)

                let extractedText = ''

                // Case 1: Image file
                if (
                    mimeType.startsWith('image/') ||
                    ['.jpg', '.jpeg', '.png'].includes(fileExt)
                ) {
                    extractedText = await extractTextFromImage(buffer)
                }

                // Case 2: PDF
                // if (fileExt === '.pdf' || mimeType === 'application/pdf') {
                //     extractedText = await extractTextFromPDF(buffer)
                // }

                const essayData: Essay = {
                    name: fileName,
                    rubricID: Number(rubricID),
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
                    rubric_category: rubricCategory,
                    grade_level: gradeLevel,
                    grade_intensity: gradeIntensity,
                    rubric_criteria: JSON.parse(rubricCriteria),
                })

            } catch (error) {
                console.error(
                    `Failed to extract text from ${file.name}:`,
                    error
                )
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
