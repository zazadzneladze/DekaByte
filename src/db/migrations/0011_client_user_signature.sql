ALTER TABLE "client_users" ADD COLUMN IF NOT EXISTS "invoice_signature_url" text;--> statement-breakpoint
ALTER TABLE "client_users" ADD COLUMN IF NOT EXISTS "invoice_signature_pathname" text;--> statement-breakpoint
ALTER TABLE "client_users" ADD COLUMN IF NOT EXISTS "invoice_signature_transform" jsonb;--> statement-breakpoint
UPDATE "client_users" u
SET
  "invoice_signature_url" = p."client_signature_url",
  "invoice_signature_pathname" = p."client_signature_pathname",
  "invoice_signature_transform" = p."client_signature_transform"
FROM "client_projects" p
WHERE lower(u."email") = lower(p."client_email")
  AND p."client_signature_url" IS NOT NULL
  AND u."invoice_signature_url" IS NULL;
