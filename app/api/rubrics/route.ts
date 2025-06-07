// /app/api/rubrics/route.ts
import { getAllRubrics, getRubricsWithDetails } from '@/lib/queries/rubrics/get'
import { createRubric } from '@/lib/queries/rubrics/post'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const data = await req.json()
    console.log('data createRubric', data)

    try {
        const rubric = await createRubric(data)
        return NextResponse.json({
            message: 'Rubric created successfully',
            rubric: JSON.parse(JSON.stringify(rubric)), // ensure it's serializable
        })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Failed to save rubric' }, { status: 500 })
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const source = searchParams.get('source')

    try {
        const data = source
            ? await getRubricsWithDetails(source) // filtered by tab source
            : await getAllRubrics() // get everything (for full table view)

        return NextResponse.json(data)
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Failed to fetch rubrics' }, { status: 500 })
    }
}
