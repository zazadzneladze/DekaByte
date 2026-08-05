import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth, signIn } from "@/lib/auth";
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
  // Admin credentials session must not block portal Google login UI
  if (session?.user?.role === "admin") {
    // stay on login — user may still want to open portal with Google
  }

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
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold tracking-tight">
            კლიენტის პორტალი
          </h1>
          <p className="text-sm text-muted-foreground">
            შესვლა მხოლოდ მოწვეული Google ანგარიშით
          </p>
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
