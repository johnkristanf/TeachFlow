import { auth } from '@/auth'
import { getGradingPerformanceLevels } from '@/lib/utils'
import { BuildWithAIRubricCreate } from '@/types/rubrics'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export const POST = auth(async function POST(req) {
    if (!req.auth || !req.auth.user?.id) {
        return NextResponse.json({ message: 'User unauthenticated' }, { status: 401 })
    }

    try {
        const body = await req.json()

        const { name, grade, category, intensity, language, criteria }: BuildWithAIRubricCreate =
            body

        const systemPrompt = `You are an expert educational evaluator. Generate detailed grading rubrics in valid JSON format only. Adapt complexity to grade level and subject area.`

        const userPrompt = `Create a grading rubric with these exact specifications:

            NAME: "${name}"
            GRADE: ${grade}
            CATEGORY: ${category}
            INTENSITY: ${intensity}
            LANGUAGE: ${language}

            CRITERIA TO EVALUATE:
            ${
                criteria?.map((c) => `- ${c.title}`).join('\n') ||
                'Generate appropriate criteria for this assignment type'
            }

            PERFORMANCE LEVELS:
            ${getGradingPerformanceLevels(intensity)}

            Generate each criterion with specific, measurable descriptions appropriate for ${grade} ${category} writing in ${language}.

            JSON FORMAT:
            {
                "name": "${name}",
                "grade": "${grade}",
                "category": "${category}",
                "intensity": "${intensity}",
                "language": "${language}",
                "criteria": [
                    {
                        "title": "Criterion Title",
                        "levels": [
                            {
                                "label": "Level Name",
                                "score": number,
                                "description": "Specific performance description"
                            }
                        ]
                    }
                ]
            }
        `

        const completion = await openai.chat.completions.create({
            model: 'gpt-4.1-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.2,
            max_tokens: 1500,
        })

        const content = completion.choices[0].message.content
        return NextResponse.json(content)
    } catch (error: any) {
        console.error('Rubric API error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
})
