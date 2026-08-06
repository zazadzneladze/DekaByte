import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth, signIn } from "@/lib/auth";
import { getPublicSiteSettings } from "@/db/queries";
import { Logo } from "@/components/public/logo";
import { Button } from "@/components/ui/button";

export default function PortalLoginPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <Suspense
      fallback={<p className="text-sm text-muted-foreground">იტვირთება…</p>}
    >
      <PortalLoginContent {...props} />
    </Suspense>
  );
}

async function PortalLoginContent({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user?.role === "client") {
    redirect(session.user.needsOnboarding ? "/portal/onboarding" : "/portal");
  }

  const settings = await getPublicSiteSettings();
  const params = await searchParams;
  const googleConfigured =
    Boolean(process.env.AUTH_GOOGLE_ID) &&
    Boolean(process.env.AUTH_GOOGLE_SECRET);

  const denied =
    params.error === "AccessDenied" ||
    params.error === "accessdenied" ||
    params.error === "OAuthAccountNotLinked";

  async function googleLogin() {
    "use server";
    try {
      await signIn("google", { redirectTo: "/portal" });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect("/portal/login?error=AccessDenied");
      }
      throw error;
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,#dbeafe_0%,transparent_50%),linear-gradient(180deg,#f5f6f8_0%,#ffffff_70%)]"
      />
      <div className="relative w-full max-w-sm space-y-6 rounded-2xl border border-border/80 bg-card/95 p-6 shadow-[0_8px_32px_rgb(18_21_26/0.06)]">
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo href="/" size="md" src={settings.logoUrl} />
          <div className="space-y-1">
            <h1 className="text-lg font-semibold tracking-tight">
              კლიენტის პორტალი
            </h1>
            <p className="text-sm text-muted-foreground">
              შესვლა მხოლოდ მოწვეული Google ანგარიშით
            </p>
          </div>
        </div>

        {!googleConfigured ? (
          <p className="text-sm text-destructive" role="alert">
            Google Sign-In ჯერ არ არის კონფიგურირებული (AUTH_GOOGLE_ID /
            AUTH_GOOGLE_SECRET).
          </p>
        ) : (
          <form action={googleLogin}>
            <Button type="submit" className="w-full">
              Google-ით შესვლა
            </Button>
          </form>
        )}

        {denied ? (
          <p className="text-sm text-destructive" role="alert">
            წვდომა უარყოფილია. ეს ელფოსტა არ არის მოწვეული პროექტზე. დაუკავშირდით
            DekaByte-ს.
          </p>
        ) : null}
      </div>
    </div>
  );
}
