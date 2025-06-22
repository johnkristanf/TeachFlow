import { extractTextFromImage } from '@/lib/aws-textract/extract'
import { getEssays } from '@/lib/queries/essays/get'
import { createEssay } from '@/lib/queries/essays/post'
import { publishToQueue } from '@/lib/rabbitmq/publisher'
import { Essay } from '@/types/essay'
import { NextRequest, NextResponse } from 'next/server'
import { getFileExtension } from '@/lib/utils'
import { auth } from '@/auth'

export const POST = auth(async function POST(req) {
    if (!req.auth || !req.auth.user?.id) {
        return NextResponse.json({ message: 'User unauthenticated' }, { status: 401 })
    }

    const formData = await req.formData()
    const files = formData.getAll('files')
    const userId = req.auth.user.id

    // Get other form data fields
    const rubricID = formData.get('rubric_id') as string
    const rubricCategory = formData.get('rubric_category') as string
    const gradeLevel = formData.get('grade_level') as string
    const gradeIntensity = formData.get('grade_intensity') as string
    const rubricCriteria = formData.get('rubric_criteria') as string
    const classID = formData.get('class_id')
    const gradingMethod = formData.get('gradingMethod') as string

    console.log('Form Fields:')
    console.log('- rubric_id:', rubricID)
    console.log('- rubric_category:', rubricCategory)
    console.log('- grade_level:', gradeLevel)
    console.log('- grade_intensity:', gradeIntensity)
    console.log('- gradingMethod:', gradingMethod)
    console.log('- rubric_criteria:', rubricCriteria)

    let processedClassID: number | null = null
    if (classID !== null && classID !== '') {
        processedClassID = Number(classID)
    }

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
                if (mimeType.startsWith('image/') || ['.jpg', '.jpeg', '.png'].includes(fileExt)) {
                    extractedText = await extractTextFromImage(buffer)
                }

                // Case 2: PDF
                // if (fileExt === '.pdf' || mimeType === 'application/pdf') {
                //     extractedText = await extractTextFromPDF(buffer)
                // }

                const essayData: Essay = {
                    name: fileName,
                    rubricID: Number(rubricID),
                    classId: processedClassID,
                    sourceType: gradingMethod,
                    essayText: extractedText,
                    status: 'pending',
                    userId: userId,
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
                console.error(`Failed to extract text from ${file.name}:`, error)
            }
        }
    }

    return NextResponse.json({
        message: 'Essay created and event published successfully',
    })
})

export const GET = auth(async function GET(req) {
    if (!req.auth || !req.auth.user?.id) {
        return NextResponse.json({ message: 'User unauthenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const selectClassFilter = searchParams.get('selectClassFilter')
    const userId = req.auth.user.id

    try {
        const essays = await getEssays(selectClassFilter, userId)
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
})
