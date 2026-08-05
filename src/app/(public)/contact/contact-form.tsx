"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { submitContact } from "@/actions/contact";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CONTACT_METHODS,
  LEAD_PROJECT_TYPES,
} from "@/config/categories";
import { trackMetaEvent } from "@/lib/meta-pixel";

const CONTACT_METHOD_LABELS: Record<(typeof CONTACT_METHODS)[number], string> = {
  phone: "ტელეფონი",
  whatsapp: "WhatsApp",
  email: "ელფოსტა",
};

type FormState = {
  name: string;
  phone: string;
  email: string;
  projectType: string;
  message: string;
  preferredContactMethod: string;
  company_website: string;
};

const initialForm: FormState = {
  name: "",
  phone: "",
  email: "",
  projectType: "",
  message: "",
  preferredContactMethod: "",
  company_website: "",
};

export function ContactForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [formStartedAt] = useState(() => Date.now());
  const [form, setForm] = useState<FormState>(() => ({
    ...initialForm,
    message: searchParams.get("summary") ?? "",
  }));
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[] | undefined>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    startTransition(async () => {
      const result = await submitContact({
        name: form.name,
        phone: form.phone,
        email: form.email,
        projectType: form.projectType || undefined,
        message: form.message,
        preferredContactMethod: form.preferredContactMethod || undefined,
        company_website: form.company_website,
        formStartedAt,
      });

      if (!result.ok) {
        setError(result.error);
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        return;
      }

      trackMetaEvent("form_success", { source: "contact_form" });
      setSuccess(true);
      setForm(initialForm);
      if (searchParams.get("summary")) {
        router.replace("/contact", { scroll: false });
      }
    });
  }

  if (success) {
    return (
      <Alert className="border-border bg-surface p-5">
        <AlertTitle className="text-base">შეტყობინება მიღებულია</AlertTitle>
        <AlertDescription className="mt-2">
          თქვენი მოთხოვნა შენახულია. მალე დაგიკავშირდებით მითითებული
          საკონტაქტო საშუალებით.
        </AlertDescription>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => setSuccess(false)}
        >
          ახალი შეტყობინება
        </Button>
      </Alert>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative flex flex-col gap-5"
      noValidate
    >
      <FieldGroup>
        <Field data-invalid={Boolean(fieldErrors.name)}>
          <FieldLabel htmlFor="contact-name">სახელი *</FieldLabel>
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
            required
          />
          <FieldError errors={fieldErrors.name?.map((message) => ({ message }))} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={Boolean(fieldErrors.phone)}>
            <FieldLabel htmlFor="contact-phone">ტელეფონი</FieldLabel>
            <Input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              aria-invalid={Boolean(fieldErrors.phone)}
            />
            <FieldError
              errors={fieldErrors.phone?.map((message) => ({ message }))}
            />
          </Field>

          <Field data-invalid={Boolean(fieldErrors.email)}>
            <FieldLabel htmlFor="contact-email">ელფოსტა</FieldLabel>
            <Input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
            />
            <FieldError
              errors={fieldErrors.email?.map((message) => ({ message }))}
            />
          </Field>
        </div>

        <p className="text-xs text-muted-foreground">
          მიუთითეთ ტელეფონი ან ელფოსტა (ერთი საკმარისია).
        </p>

        <Field data-invalid={Boolean(fieldErrors.projectType)}>
          <FieldLabel>პროექტის ტიპი *</FieldLabel>
          <Select
            value={form.projectType || null}
            onValueChange={(value) => update("projectType", value ?? "")}
          >
            <SelectTrigger
              className="w-full"
              aria-invalid={Boolean(fieldErrors.projectType)}
            >
              <SelectValue placeholder="აირჩიეთ ტიპი" />
            </SelectTrigger>
            <SelectContent>
              {LEAD_PROJECT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError
            errors={fieldErrors.projectType?.map((message) => ({ message }))}
          />
        </Field>

        <Field data-invalid={Boolean(fieldErrors.message)}>
          <FieldLabel htmlFor="contact-message">შეტყობინება *</FieldLabel>
          <Textarea
            id="contact-message"
            name="message"
            rows={6}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            aria-invalid={Boolean(fieldErrors.message)}
            required
          />
          <FieldError
            errors={fieldErrors.message?.map((message) => ({ message }))}
          />
        </Field>

        <Field>
          <FieldLabel>სასურველი საკონტაქტო საშუალება</FieldLabel>
          <Select
            value={form.preferredContactMethod || null}
            onValueChange={(value) =>
              update("preferredContactMethod", value ?? "")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="არ არის მითითებული" />
            </SelectTrigger>
            <SelectContent>
              {CONTACT_METHODS.map((method) => (
                <SelectItem key={method} value={method}>
                  {CONTACT_METHOD_LABELS[method]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* Honeypot */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
        >
          <label htmlFor="company_website">Company website</label>
          <input
            id="company_website"
            name="company_website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.company_website}
            onChange={(e) => update("company_website", e.target.value)}
          />
        </div>
      </FieldGroup>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>შეცდომა</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Button type="submit" size="lg" disabled={pending} className="self-start">
        {pending ? "იგზავნება…" : "გაგზავნა"}
      </Button>
    </form>
  );
}
