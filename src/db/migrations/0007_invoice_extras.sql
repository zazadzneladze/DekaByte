ALTER TABLE "client_invoices" ADD COLUMN IF NOT EXISTS "discount_percent" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "client_invoices" ADD COLUMN IF NOT EXISTS "recipient_is_company" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "client_invoices" ADD COLUMN IF NOT EXISTS "supplier_signature_url" text;--> statement-breakpoint
ALTER TABLE "client_invoices" ADD COLUMN IF NOT EXISTS "client_signature_url" text;
