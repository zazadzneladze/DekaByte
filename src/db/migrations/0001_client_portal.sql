CREATE TYPE "public"."client_project_status" AS ENUM('upcoming', 'in_progress', 'review', 'done', 'archived');--> statement-breakpoint
CREATE TYPE "public"."client_asset_kind" AS ENUM('screenshot', 'document', 'other');--> statement-breakpoint
CREATE TYPE "public"."client_message_role" AS ENUM('admin', 'client');--> statement-breakpoint
CREATE TYPE "public"."client_invoice_status" AS ENUM('draft', 'sent', 'paid');--> statement-breakpoint
CREATE TABLE "client_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"display_name" varchar(160),
	"image" text,
	"avatar_url" text,
	"avatar_pathname" text,
	"google_sub" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "client_users_email_unique" UNIQUE("email"),
	CONSTRAINT "client_users_google_sub_unique" UNIQUE("google_sub")
);--> statement-breakpoint
CREATE TABLE "client_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(200) NOT NULL,
	"status" "client_project_status" DEFAULT 'upcoming' NOT NULL,
	"client_email" varchar(255) NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE "client_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"url" text NOT NULL,
	"pathname" text NOT NULL,
	"filename" varchar(255) NOT NULL,
	"mime" varchar(120) NOT NULL,
	"size" integer,
	"kind" "client_asset_kind" DEFAULT 'other' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE "client_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"author_role" "client_message_role" NOT NULL,
	"author_email" varchar(255) NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE "client_invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"title" varchar(200) NOT NULL,
	"amount_gel" integer NOT NULL,
	"status" "client_invoice_status" DEFAULT 'draft' NOT NULL,
	"pdf_url" text,
	"pdf_pathname" text,
	"due_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE "push_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_user_id" uuid NOT NULL,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "push_subscriptions_endpoint_unique" UNIQUE("endpoint")
);--> statement-breakpoint
ALTER TABLE "client_assets" ADD CONSTRAINT "client_assets_project_id_client_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."client_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_messages" ADD CONSTRAINT "client_messages_project_id_client_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."client_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_invoices" ADD CONSTRAINT "client_invoices_project_id_client_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."client_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_admin_user_id_admin_users_id_fk" FOREIGN KEY ("admin_user_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "client_users_email_idx" ON "client_users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "client_projects_email_idx" ON "client_projects" USING btree ("client_email");--> statement-breakpoint
CREATE INDEX "client_projects_status_idx" ON "client_projects" USING btree ("status");--> statement-breakpoint
CREATE INDEX "client_assets_project_id_idx" ON "client_assets" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "client_messages_project_created_idx" ON "client_messages" USING btree ("project_id","created_at");--> statement-breakpoint
CREATE INDEX "client_invoices_project_id_idx" ON "client_invoices" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "push_subscriptions_admin_idx" ON "push_subscriptions" USING btree ("admin_user_id");
