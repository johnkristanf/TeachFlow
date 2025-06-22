// app/api/classes/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/database'
import { classes, essay } from '@/database/schema'
import { eq, sql } from 'drizzle-orm'
import { auth } from '@/auth'

export const GET = auth(async function GET(req) {
    if (!req.auth || !req.auth.user?.id) {
        return NextResponse.json({ message: 'User unauthenticated' }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(req.url)
        const component = searchParams.get('component')
        const userId = req.auth.user.id

        let allClasses

        if (component === 'dropdown') {
            allClasses = await db
                .select({
                    id: classes.id,
                    name: classes.name,
                })
                .from(classes)
                .where(eq(classes.userId, userId))
        } else {
            // Default behavior: Fetch all details including essay count
            allClasses = await db
                .select({
                    id: classes.id,
                    name: classes.name,
                    description: classes.description,
                    studentCount: classes.studentCount,
                    createdAt: classes.createdAt,
                    essayCount: sql<number>`cast(count(${essay.id}) as int)`.as('essay_count'),
                })
                .from(classes)
                .where(eq(classes.userId, userId))
                .leftJoin(essay, sql`${classes.id} = ${essay.classId}`) // LEFT JOIN to include classes even if they have no essays
                .groupBy(
                    classes.id,
                    classes.name,
                    classes.description,
                    classes.studentCount,
                    classes.createdAt
                )
        }
        return NextResponse.json(allClasses, { status: 200 })
    } catch (error) {
        console.error('Error fetching classes:', error)
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 })
    }
})

// POST handler to create a new class
export const POST = auth(async function POST(req) {
    if (!req.auth || !req.auth.user?.id) {
        return NextResponse.json({ message: 'User unauthenticated' }, { status: 401 })
    }

    try {
        const body = await req.json()
        const userID = req.auth.user.id
        const { name, description, studentCount } = body

        // Insert new class into the database using Drizzle ORM
        const result = await db.insert(classes).values({
            name: name,
            description: description,
            studentCount: studentCount,
            userId: userID,
        })

        return NextResponse.json({ message: 'Class created successfully!' }, { status: 201 })
    } catch (error) {
        console.error('API Error creating class:', error)
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 })
    }
})
