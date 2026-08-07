ALTER TABLE "client_users" ADD COLUMN IF NOT EXISTS "phone" varchar(40);--> statement-breakpoint
ALTER TABLE "client_users" ADD COLUMN IF NOT EXISTS "address" text;--> statement-breakpoint
ALTER TABLE "client_projects" ADD COLUMN IF NOT EXISTS "portfolio_project_id" uuid;--> statement-breakpoint
ALTER TABLE "client_projects" ADD COLUMN IF NOT EXISTS "admin_messages_read_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "client_invoices" ADD COLUMN IF NOT EXISTS "body_html" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "client_invoices" ADD COLUMN IF NOT EXISTS "recipient_name" varchar(200);--> statement-breakpoint
ALTER TABLE "client_invoices" ADD COLUMN IF NOT EXISTS "recipient_personal_id" varchar(40);--> statement-breakpoint
ALTER TABLE "client_invoices" ADD COLUMN IF NOT EXISTS "recipient_address" text;--> statement-breakpoint
ALTER TABLE "client_invoices" ADD COLUMN IF NOT EXISTS "recipient_phone" varchar(40);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_projects" ADD CONSTRAINT "client_projects_portfolio_project_id_projects_id_fk" FOREIGN KEY ("portfolio_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
