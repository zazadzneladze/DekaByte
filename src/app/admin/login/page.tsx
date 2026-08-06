import { Suspense } from "react";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";
import { userIsAdmin } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <Suspense
      fallback={<p className="text-sm text-muted-foreground">იტვირთება…</p>}
    >
      <AdminLoginContent {...props} />
    </Suspense>
  );
}

async function AdminLoginContent({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (userIsAdmin(session?.user)) {
    redirect("/admin");
  }
  if (session?.user?.role === "client") {
    redirect("/portal");
  }

  const params = await searchParams;
  const showError = params.error === "CredentialsSignin" || params.error === "1";

  async function loginAction(formData: FormData) {
    "use server";

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: "/admin",
      });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect("/admin/login?error=1");
      }
      throw error;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold tracking-tight">ადმინ შესვლა</h1>
          <p className="text-sm text-muted-foreground">
            შეიყვანეთ თქვენი ელფოსტა და პაროლი
          </p>
        </div>

        <form action={loginAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">ელფოსტა</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">პაროლი</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          {showError ? (
            <p className="text-sm text-destructive" role="alert">
              შესვლა ვერ მოხერხდა. შეამოწმეთ მონაცემები ან სცადეთ მოგვიანებით.
            </p>
          ) : null}

          <Button type="submit" className="w-full">
            შესვლა
          </Button>
        </form>
      </div>
    </div>
  );
}
