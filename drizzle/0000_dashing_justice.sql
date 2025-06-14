CREATE TABLE "criteria" (
	"id" serial PRIMARY KEY NOT NULL,
	"rubric_id" integer NOT NULL,
	"title" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "essay" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"rubric_id" integer,
	"source_type" text NOT NULL,
	"essay_text" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "essay_grading_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"essay_id" integer NOT NULL,
	"logged_at" timestamp DEFAULT now(),
	"failure_type" varchar(50) NOT NULL,
	"error_message" text NOT NULL,
	"error_details" jsonb
);
--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"rating" integer NOT NULL,
	"liked" text NOT NULL,
	"bugs" text NOT NULL,
	"confusing" text,
	"suggestions" text NOT NULL,
	"contact" varchar(255),
	"ease_of_use" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "levels" (
	"id" serial PRIMARY KEY NOT NULL,
	"criterion_id" integer NOT NULL,
	"label" text NOT NULL,
	"score" integer NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "rubrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"grade" text NOT NULL,
	"intensity" text NOT NULL,
	"category" text NOT NULL,
	"language" text NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "criteria" ADD CONSTRAINT "criteria_rubric_id_rubrics_id_fk" FOREIGN KEY ("rubric_id") REFERENCES "public"."rubrics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "essay" ADD CONSTRAINT "essay_rubric_id_rubrics_id_fk" FOREIGN KEY ("rubric_id") REFERENCES "public"."rubrics"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "essay_grading_logs" ADD CONSTRAINT "essay_grading_logs_essay_id_essay_id_fk" FOREIGN KEY ("essay_id") REFERENCES "public"."essay"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "levels" ADD CONSTRAINT "levels_criterion_id_criteria_id_fk" FOREIGN KEY ("criterion_id") REFERENCES "public"."criteria"("id") ON DELETE cascade ON UPDATE no action;