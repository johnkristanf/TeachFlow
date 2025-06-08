import { pgTable, text, uuid,  timestamp, integer } from 'drizzle-orm/pg-core'
import { essay } from './schema';

// ESSAY EVALUATIONS
export const essayEvaluations = pgTable("essay_evaluations", {
  id: uuid("id").primaryKey(),
  essayId: uuid("essay_id").notNull().references(() => essay.id),
  criterion: text("criterion"),
  matchedLabel: text("matched_label"),
  score: integer("score"),
  maxScore: integer("max_score"),
  reason: text("reason"),
  suggestion: text("suggestion"),
  createdAt: timestamp("created_at").defaultNow(),
});


// ESSAY EVALUATIONS OVERALL
export const essayEvaluationOveralls = pgTable("essay_evaluation_overall", {
  id: uuid("id").primaryKey(),
  essayId: uuid("essay_id").notNull().references(() => essay.id).unique(),
  totalScore: integer("total_score"),
  maxTotalScore: integer("max_total_score"),
  overallFeedback: text("overall_feedback"),
  createdAt: timestamp("created_at").defaultNow(),
});
