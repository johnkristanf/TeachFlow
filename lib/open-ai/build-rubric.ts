import { BuildWithAIRubricCreate } from "@/types/rubrics"
import { getGradingPerformanceLevels } from "../utils"
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function buildRubric(data: BuildWithAIRubricCreate) {
    const systemPrompt = `You are an expert educational evaluator. Generate detailed grading rubrics in valid JSON format only. Adapt complexity to grade level and subject area.`

    const userPrompt = `Create a grading rubric with these exact specifications:

            NAME: "${data.name}"
            GRADE: ${data.grade}
            CATEGORY: ${data.category}
            INTENSITY: ${data.intensity}
            LANGUAGE: ${data.language}

            CRITERIA TO EVALUATE:
            ${
                data.criteria?.map((c) => `- ${c.title}`).join('\n') ||
                'Generate appropriate criteria for this assignment type'
            }

            PERFORMANCE LEVELS:
            ${getGradingPerformanceLevels(data.intensity)}

            Generate each criterion with specific, measurable descriptions appropriate for ${data.grade} ${data.category} writing in ${data.language}.

            JSON FORMAT:
            {
                "name": "${data.name}",
                "grade": "${data.grade}",
                "category": "${data.category}",
                "intensity": "${data.intensity}",
                "language": "${data.language}",
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
        max_tokens: 1000,
    })

    const content = completion.choices[0].message.content
    if (!content) {
        throw new Error('No content received from OpenAI rubric generate')
    }

    return content
}
