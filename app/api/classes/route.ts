// app/api/classes/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod' // Import z from zod
import { db } from '@/database'
import { classes, essay } from '@/database/schema'
import { sql } from 'drizzle-orm'

export async function GET() {
    try {
        const allClasses = await db
            .select({
                id: classes.id,
                name: classes.name,
                description: classes.description,
                studentCount: classes.studentCount,
                createdAt: classes.createdAt,
                essayCount: sql<number>`cast(count(${essay.id}) as int)`.as(
                    'essay_count'
                ),
            })
            .from(classes)
            .leftJoin(essay, sql`${classes.id} = ${essay.classId}`) // LEFT JOIN to include classes even if they have no essays
            .groupBy(
                classes.id,
                classes.name,
                classes.description,
                classes.studentCount,
                classes.createdAt
            )
        return NextResponse.json(allClasses, { status: 200 })
    } catch (error) {
        console.error('Error fetching classes:', error)
        return NextResponse.json(
            { message: 'Internal server error.' },
            { status: 500 }
        )
    }
}

// POST handler to create a new class
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, description, studentCount } = body

        // Insert new class into the database using Drizzle ORM
        const result = await db
            .insert(classes)
            .values({
                name: name,
                description: description,
                studentCount: studentCount,
            })
            .returning({
                id: classes.id,
                name: classes.name,
                studentCount: classes.studentCount,
                description: classes.description,
                createdAt: classes.createdAt,
            }) // Return the inserted data

        if (result.length === 0) {
            return NextResponse.json(
                { message: 'Failed to create class in database.' },
                { status: 500 }
            )
        }

        return NextResponse.json(
            {
                message: 'Class created successfully!',
                class: result[0], // Return the newly created class object
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('API Error creating class:', error)
        return NextResponse.json(
            { message: 'Internal server error.' },
            { status: 500 }
        )
    }
}
