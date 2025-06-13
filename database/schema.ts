import {
    pgTable,
    serial,
    text,
    uuid,
    varchar,
    timestamp,
    integer,
    pgEnum,
    jsonb,
} from 'drizzle-orm/pg-core'

// RUBRICS
export const rubrics = pgTable('rubrics', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    grade: text('grade').notNull(),
    intensity: text('intensity').notNull(),
    category: text('category').notNull(),
    language: text('language').notNull(),
    created_by: text('created_by'),
    createdAt: timestamp('created_at').defaultNow(),
})

// CRITERIA
export const criteria = pgTable('criteria', {
    id: serial('id').primaryKey(),
    rubricId: integer('rubric_id')
        .references(() => rubrics.id, { onDelete: 'cascade' })
        .notNull(),
    title: text('title').notNull(),
})

// LEVELS
export const levels = pgTable('levels', {
    id: serial('id').primaryKey(),
    criterionId: integer('criterion_id')
        .references(() => criteria.id, { onDelete: 'cascade' })
        .notNull(),
    label: text('label').notNull(),
    score: integer('score').notNull(),
    description: text('description'),
})

// ESSAY
export const essay = pgTable('essay', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }),
    rubricUsed: text('rubric_used').notNull(),
    sourceType: text('source_type').notNull(), // 'files upload' or 'text'
    essayText: text('essay_text').notNull(),
    status: text('status').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
})

// GRADING ERROR LOGS
export const essayGradingLogs = pgTable('essay_grading_logs', {
    id: serial('id').primaryKey(),
    essayId: uuid('essay_id')
        .references(() => essay.id, { onDelete: 'cascade' })
        .notNull(),
    loggedAt: timestamp('logged_at', { mode: 'date' }).defaultNow(),
    failureType: varchar('failure_type', { length: 50 }).notNull(), // (e.g., 'retry_exhausted', 'permanent_error', 'llm_api_error', 'invalid_rubric')
    errorMessage: text('error_message').notNull(),
    errorDetails: jsonb('error_details'), // Potentially including stack traces or full API error responses
})

// FEEDBACK
export const performanceEnum = pgEnum('performance_enum', ['fast', 'acceptable', 'slow'])
export const feedback = pgTable('feedback', {
    id: serial('id').primaryKey(),
    rating: integer('rating').notNull(),
    liked: text('liked').notNull(),
    bugs: text('bugs').notNull(),
    confusing: text('confusing'),
    suggestions: text('suggestions').notNull(),
    contact: varchar('contact', { length: 255 }),
    easeOfUse: integer('ease_of_use').notNull(),
    performance: performanceEnum('performance').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
})
