import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function generateQuiz(
    extractedText: string,
    multiple_choice: string,
    fill_in_blank: string,
    true_or_false: string
) {
    try {
        const systemPrompt = `
            You are an expert educational content creator. Your job is to analyze provided learning material and generate high-quality quiz questions in three formats: multiple choice, fill-in-the-blank, and true or false. All content must be based strictly on the source material.
            Return the result in structured JSON only, with no extra commentary.
        `

        const userPrompt = `
            ### Learning Material:
            """
            ${extractedText}
            """

            ### Instructions:
            - Based on the material, generate **at least 2 full quiz sets**.
            - **Do not repeat or duplicate any question** between sets.
            - Generate exactly:
            - ${multiple_choice} Multiple Choice Questions (MCQ)
            - ${fill_in_blank} Fill-in-the-Blank Questions
            - ${true_or_false} True or False Questions

            ### Guidelines:
            - Wrap all quiz sets in a top-level array.
            - Each MCQ must have 4 choices and one clearly correct answer.
            - Fill-in-the-Blank questions must omit a key word or phrase.
            - True or False questions must be factually answerable from the material.
            - Keep all questions clear and relevant.
            

            ### Return data in this strict JSON format:
            [
                {
                    "multiple_choice": [
                        {
                            "question": "What is the capital of France?",
                            "choices": ["London", "Berlin", "Paris", "Rome"],
                            "answer": "Paris"
                        },
                        {
                            "question": "Which planet is known as the Red Planet?",
                            "choices": ["Earth", "Mars", "Jupiter", "Venus"],
                            "answer": "Mars"
                        }
                    ],

                    "fill_in_blank": [
                        {
                            "question": "The chemical symbol for water is ___.",
                            "answer": "H2O"
                        },
                        {
                            "question": "The process by which plants make food is called ___.",
                            "answer": "photosynthesis"
                        }
                    ],

                    "true_or_false": [
                        {
                            "question": "The sun rises in the west.",
                            "answer": false
                        },
                        {
                            "question": "Sound travels slower than light.",
                            "answer": true
                        }
                    ]
                },

                {
                    "multiple_choice": [...],
                    "fill_in_blank": [...],
                    "true_or_false": [...]
                }
            ]
        `

        const completion = await openai.chat.completions.create({
            model: 'gpt-4.1-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 1000,
        })

        const content = completion.choices[0].message.content
        return content

    } catch (error: any) {
        console.error('Error in generating quiz: ', error)
        throw new Error(error)
    }
}


