CREATE TABLE "classes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"student_count" integer NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "essay" ADD COLUMN "class_id" integer;--> statement-breakpoint
ALTER TABLE "essay" ADD CONSTRAINT "essay_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE set null ON UPDATE no action;