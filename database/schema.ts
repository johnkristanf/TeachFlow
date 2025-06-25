import { pgTable, serial, text, varchar, timestamp, integer, jsonb } from 'drizzle-orm/pg-core'

// RUBRICS
export const rubrics = pgTable('rubrics', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    grade: text('grade').notNull(),
    intensity: text('intensity').notNull(),
    category: text('category').notNull(),
    language: text('language').notNull(),
    created_by: text('created_by'),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
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
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }),

    rubricID: integer('rubric_id').references(() => rubrics.id, {
        onDelete: 'set null',
    }),

    classId: integer('class_id').references(() => classes.id, {
        onDelete: 'set null',
    }),

    sourceType: text('source_type').notNull(), // 'files upload' or 'webcam'
    essayText: text('essay_text').notNull(),
    status: text('status').notNull(),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),

    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
})

// GRADING ERROR LOGS
export const essayGradingLogs = pgTable('essay_grading_logs', {
    id: serial('id').primaryKey(),
    essayId: integer('essay_id') // Corrected: Should be integer, not serial
        .references(() => essay.id, { onDelete: 'cascade' })
        .notNull(),
    loggedAt: timestamp('logged_at', { mode: 'date' }).defaultNow(),
    failureType: varchar('failure_type', { length: 50 }).notNull(), // (e.g., 'retry_exhausted', 'permanent_error', 'llm_api_error', 'invalid_rubric')
    errorMessage: text('error_message').notNull(),
    errorDetails: jsonb('error_details'), // Potentially including stack traces or full API error responses
})

// FEEDBACK
export const feedback = pgTable('feedback', {
    id: serial('id').primaryKey(),
    rating: integer('rating').notNull(),
    liked: text('liked').notNull(),
    bugs: text('bugs').notNull(),
    confusing: text('confusing'),
    suggestions: text('suggestions').notNull(),
    contact: varchar('contact', { length: 255 }),
    easeOfUse: integer('ease_of_use').notNull(),
    wouldUseAgain: varchar('would_use_again', { length: 255 }).notNull(),
    willingToPay: varchar('willing_to_pay', { length: 255 }).notNull(),
    performance: varchar('performance', { length: 255 }),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),

    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
})

export const classes = pgTable('classes', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    studentCount: integer('student_count').notNull(),
    description: text('description'),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
})

// USERS
export const users = pgTable('users', {
    id: text('id').primaryKey(),
    email: text('email').unique(),
    name: text('name'),
    image: text('image'),
    emailVerified: timestamp('email_verified', { mode: 'date' }),
    password: text('password'), // hashed
    role: text('role').default('USER'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})

// ACCOUNTS
export const accounts = pgTable('accounts', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(), // 'oauth' | 'credentials'
    provider: text('provider').notNull(), // 'google' | 'github' | 'credentials'
    providerAccountId: text('provider_account_id').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
})
