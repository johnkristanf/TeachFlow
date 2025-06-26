import { auth } from '@/auth'
import { db } from '@/database'
import { classes } from '@/database/schema'
import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const PUT = auth(async function PUT(req) {
    if (!req.auth || !req.auth.user?.id) {
        return NextResponse.json({ message: 'User unauthenticated' }, { status: 401 })
    }

    const userId = req.auth.user.id

    const id = req.nextUrl.pathname.split('/').pop()
    const classID = Number(id)

    if (!classID || isNaN(classID)) {
        return NextResponse.json({ message: 'Invalid class ID' }, { status: 400 })
    }

    try {
        // Parse request body
        const body = await req.json()
        const { name, description, studentCount } = body

        // Validate required fields
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return NextResponse.json({ message: 'Class name is required' }, { status: 400 })
        }

        if (studentCount !== undefined && (typeof studentCount !== 'number' || studentCount < 0)) {
            return NextResponse.json(
                { message: 'Student count must be a non-negative number' },
                { status: 400 }
            )
        }

        // Check if the class exists and belongs to the user
        const existingClass = await db
            .select()
            .from(classes)
            .where(and(eq(classes.id, classID), eq(classes.userId, userId)))
            .limit(1)

        if (existingClass.length === 0) {
            return NextResponse.json(
                { message: 'Class not found or unauthorized' },
                { status: 404 }
            )
        }

        // Prepare update data
        const updateData = {
            name: name.trim(),
            description: description?.trim() || null,
            studentCount: studentCount || 0,
        }

        // Update the class
        await db
            .update(classes)
            .set(updateData)
            .where(and(eq(classes.id, classID), eq(classes.userId, userId)))

        return NextResponse.json({ message: 'Class updated successfully' }, { status: 200 })
    } catch (error) {
        console.error('Error updating class:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
})

export const DELETE = auth(async function PUT(req) {
    if (!req.auth || !req.auth.user?.id) {
        return NextResponse.json({ message: 'User unauthenticated' }, { status: 401 })
    }

    const userId = req.auth.user.id
    const id = req.nextUrl.pathname.split('/').pop()
    const classID = Number(id)

    if (!classID || isNaN(classID)) {
        return NextResponse.json({ message: 'Invalid class ID' }, { status: 400 })
    }

    try {
        await db.delete(classes).where(and(eq(classes.id, classID), eq(classes.userId, userId)))

        return NextResponse.json({ message: 'Class deleted successfully' }, { status: 200 })
    } catch (error) {
        console.error('Error deleting class:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
})
