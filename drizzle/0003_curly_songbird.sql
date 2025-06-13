CREATE TABLE "essay_grading_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"essay_id" uuid NOT NULL,
	"logged_at" timestamp DEFAULT now(),
	"failure_type" varchar(50) NOT NULL,
	"error_message" text NOT NULL,
	"error_details" jsonb
);
--> statement-breakpoint
ALTER TABLE "essay_grading_logs" ADD CONSTRAINT "essay_grading_logs_essay_id_essay_id_fk" FOREIGN KEY ("essay_id") REFERENCES "public"."essay"("id") ON DELETE cascade ON UPDATE no action;