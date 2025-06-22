import { auth } from '@/auth'
import { getAllRubrics, getRubricsWithDetails } from '@/lib/queries/rubrics/get'
import { createRubric } from '@/lib/queries/rubrics/post'
import { NextResponse } from 'next/server'

export const POST = auth(async function POST(req) {
    if (!req.auth || !req.auth.user?.id) {
        return NextResponse.json({ message: 'User unauthenticated' }, { status: 401 })
    }
    const data = await req.json()
    const userId = req.auth.user.id

    console.log('data createRubric', data)

    try {
        const rubric = await createRubric(data, userId)
        return NextResponse.json({
            message: 'Rubric created successfully',
            rubric: JSON.parse(JSON.stringify(rubric)), // ensure it's serializable
        })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Failed to save rubric' }, { status: 500 })
    }
})

export const GET = auth(async function GET(req) {
    if (!req.auth || !req.auth.user?.id) {
        return NextResponse.json({ message: 'User unauthenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const source = searchParams.get('source')

    try {
        const data = await getRubricsWithDetails(source, req.auth.user.id) // filtered by tab source
        return NextResponse.json(data)
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Failed to fetch rubrics' }, { status: 500 })
    }
})
