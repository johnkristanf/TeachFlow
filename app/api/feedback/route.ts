// app/api/feedback/route.ts
import { db } from '@/database'
import { feedback } from '@/database/schema'
import { NextRequest, NextResponse } from 'next/server'


export async function POST(req: NextRequest) {
    try {
        const data = await req.json()

        // Validate minimal required fields (optional: use Zod or similar in prod)
        const { rating, liked, bugs, confusing, suggestions, contact, easeOfUse, performance } =
            data

        await db.insert(feedback).values({
            rating,
            liked,
            bugs,
            confusing,
            suggestions,
            contact,
            easeOfUse,
            performance,
        })

        return NextResponse.json({ message: 'Feedback saved' }, { status: 201 })
    } catch (error) {
        console.error('Failed to save feedback:', error)
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}
