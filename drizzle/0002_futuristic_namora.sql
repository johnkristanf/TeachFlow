CREATE TYPE "public"."performance_enum" AS ENUM('fast', 'acceptable', 'slow');--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"rating" integer NOT NULL,
	"liked" text NOT NULL,
	"bugs" text NOT NULL,
	"confusing" text,
	"suggestions" text NOT NULL,
	"contact" varchar(255),
	"ease_of_use" integer NOT NULL,
	"performance" "performance_enum" NOT NULL,
	"created_at" timestamp DEFAULT now()
);
