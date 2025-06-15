// app/api/feedback/route.ts
import { db } from '@/database'
import { feedback } from '@/database/schema'
import { NextRequest, NextResponse } from 'next/server'


export async function POST(req: NextRequest) {
    try {
        const data = await req.json()


        await db.insert(feedback).values({
            rating: data.rating,
            liked: data.liked,
            bugs: data.bugs,
            confusing: data.confusing,
            suggestions: data.suggestions,
            contact: data.contact,
            easeOfUse: data.easeOfUse,
            performance: data.performance,
            willingToPay: data.willingToPay,
            wouldUseAgain: data.wouldUseAgain
        })

        return NextResponse.json({ message: 'Feedback saved' }, { status: 201 })
    } catch (error) {
        console.error('Failed to save feedback:', error)
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}
