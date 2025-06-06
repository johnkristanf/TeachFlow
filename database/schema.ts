import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core'

export const rubrics = pgTable('rubrics', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    grade: text('grade').notNull(),
    intensity: text('intensity').notNull(),
    language: text('language').notNull(),
    type: text('type'), // advanced or simple 
    createdAt: timestamp('created_at').defaultNow(),
})

export const criteria = pgTable('criteria', {
    id: serial('id').primaryKey(),
    rubricId: integer('rubric_id')
        .references(() => rubrics.id, { onDelete: 'cascade' })
        .notNull(),
    title: text('title').notNull(),
})

export const levels = pgTable('levels', {
    id: serial('id').primaryKey(),
    criterionId: integer('criterion_id')
        .references(() => criteria.id, { onDelete: 'cascade' })
        .notNull(),
    label: text('label').notNull(),
    score: integer('score').notNull(),
    description: text('description'),
})
