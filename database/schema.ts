import { pgTable, serial, text, uuid, varchar, timestamp, integer } from 'drizzle-orm/pg-core'

// RUBRICS
export const rubrics = pgTable('rubrics', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    grade: text('grade').notNull(),
    intensity: text('intensity').notNull(),
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
export const essay = pgTable("essay", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }),
  rubricUsed: text("rubric_used").notNull(),
  sourceType: text("source_type").notNull(), // 'files upload' or 'text'
  essayText: text("essay_text").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

