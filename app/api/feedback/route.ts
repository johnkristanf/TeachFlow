// app/api/feedback/route.ts
import { auth } from '@/auth'
import { db } from '@/database'
import { feedback } from '@/database/schema'
import { NextRequest, NextResponse } from 'next/server'

export const POST = auth(async function POST(req) {
    if (!req.auth) {
        return NextResponse.json(
            {
                message: 'User unauthenticated',
            },
            { status: 401 }
        )
    }
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
            wouldUseAgain: data.wouldUseAgain,
        })

        return NextResponse.json({ message: 'Feedback saved' }, { status: 201 })
    } catch (error) {
        console.error('Failed to save feedback:', error)
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
})
