import { auth } from '@/auth'
import { buildRubric } from '@/lib/open-ai/build-rubric'
import { cleanAIJSONResponse, getGradingPerformanceLevels } from '@/lib/utils'
import { BuildWithAIRubricCreate } from '@/types/rubrics'
import { NextRequest, NextResponse } from 'next/server'

export const POST = auth(async function POST(req) {
    if (!req.auth || !req.auth.user?.id) {
        return NextResponse.json({ error: 'User unauthenticated' }, { status: 401 })
    }

    try {
        const body = await req.json()
        const data: BuildWithAIRubricCreate = body

        const generatedRubric = await buildRubric(data)
        const cleanedContent = cleanAIJSONResponse(generatedRubric)

        return NextResponse.json(cleanedContent)
    } catch (error: any) {
        console.error('Rubric API error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
})
