import { auth } from '@/auth'
import { generateQuiz } from '@/lib/open-ai/generate_quiz'
import { extractTextFromPDF } from '@/lib/server/quiz-utils'
import { getFileExtension } from '@/lib/utils'
import { NextResponse } from 'next/server'

export const POST = auth(async function POST(req) {
    if (!req.auth || !req.auth.user?.id) {
        return NextResponse.json({ message: 'User unauthenticated' }, { status: 401 })
    }

    try {
        const formData = await req.formData()
        const source_file = formData.get('source_file') as File
        const userId = req.auth.user.id

        // Get other form data fields
        const multiple_choice = formData.get('multiple_choice') as string
        const fill_in_blank = formData.get('fill_in_blank') as string
        const true_or_false = formData.get('true_or_false') as string

        console.log('userId: ', userId)
        console.log('multiple_choice: ', multiple_choice)
        console.log('fill_in_blank: ', fill_in_blank)
        console.log('true_or_false: ', true_or_false)
        console.log('File Name: ', source_file.name)
        console.log('Mime Type: ', source_file.type)

        const fileName = source_file.name
        const mimeType = source_file.type
        const fileExt = getFileExtension(fileName)

        let extractedText = ''

        if (fileExt === '.pdf' || mimeType === 'application/pdf') {
            extractedText = await extractTextFromPDF(source_file)
        }

        const generatedQuizJSON = await generateQuiz(
            extractedText,
            multiple_choice,
            fill_in_blank,
            true_or_false
        )

        return NextResponse.json(generatedQuizJSON)
    } catch (error) {
        console.error('Error in generating quiz: ', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
})
