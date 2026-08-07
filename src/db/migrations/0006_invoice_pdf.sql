ALTER TABLE "client_invoices" ADD COLUMN IF NOT EXISTS "invoice_number" varchar(40);--> statement-breakpoint
ALTER TABLE "client_invoices" ADD COLUMN IF NOT EXISTS "issued_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "client_invoices" ADD COLUMN IF NOT EXISTS "payment_stage" varchar(120) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "client_invoices" ADD COLUMN IF NOT EXISTS "currency" varchar(8) DEFAULT 'GEL' NOT NULL;--> statement-breakpoint
ALTER TABLE "client_invoices" ADD COLUMN IF NOT EXISTS "contract_ref" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "client_invoices" ADD COLUMN IF NOT EXISTS "recipient_contact_person" varchar(200);--> statement-breakpoint
ALTER TABLE "client_invoices" ADD COLUMN IF NOT EXISTS "recipient_email" varchar(255);--> statement-breakpoint
ALTER TABLE "client_invoices" ADD COLUMN IF NOT EXISTS "line_items" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "client_invoices" ADD COLUMN IF NOT EXISTS "discount_gel" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "client_invoices" ADD COLUMN IF NOT EXISTS "subtotal_gel" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "client_invoices" ADD COLUMN IF NOT EXISTS "tax_withheld_gel" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "client_invoices" ADD COLUMN IF NOT EXISTS "net_gel" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
UPDATE "client_invoices" SET "invoice_number" = 'DB-LEGACY-' || substr(replace(id::text, '-', ''), 1, 8) WHERE "invoice_number" IS NULL;--> statement-breakpoint
UPDATE "client_invoices" SET "issued_at" = coalesce("issued_at", "created_at", now()) WHERE "issued_at" IS NULL;--> statement-breakpoint
UPDATE "client_invoices" SET "net_gel" = "amount_gel", "subtotal_gel" = "amount_gel" WHERE "net_gel" = 0 AND "amount_gel" > 0;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "client_invoices" ALTER COLUMN "invoice_number" SET NOT NULL;
EXCEPTION WHEN others THEN NULL;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "client_invoices" ALTER COLUMN "issued_at" SET NOT NULL;
EXCEPTION WHEN others THEN NULL;
END $$;--> statement-breakpoint
DO $$ BEGIN
  CREATE UNIQUE INDEX "client_invoices_invoice_number_unique" ON "client_invoices" ("invoice_number");
EXCEPTION WHEN duplicate_table THEN NULL;
WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "client_invoices_number_idx" ON "client_invoices" USING btree ("invoice_number");
