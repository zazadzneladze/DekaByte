import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible Auth.js config (no Node-only imports).
 * Providers live in `src/lib/auth.ts`.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
    error: "/portal/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      const isAdminArea = pathname.startsWith("/admin");
      const isAdminLogin = pathname === "/admin/login";
      const isPortalArea = pathname.startsWith("/portal");
      const isPortalLogin = pathname === "/portal/login";

      if (isAdminArea) {
        if (isAdminLogin) return true;
        if (
          pathname.endsWith(".js") ||
          pathname.endsWith(".webmanifest") ||
          pathname.endsWith(".png")
        ) {
          return true;
        }
        if (auth?.user?.role === "admin") return true;
        if (auth?.user?.email) return true;
        return false;
      }

      if (isPortalArea) {
        if (isPortalLogin) return true;
        if (auth?.user?.role === "client") return true;
        // Never send portal users to /admin/login (default pages.signIn) —
        // that caused an infinite redirect loop with dual admin/client emails.
        return Response.redirect(new URL("/portal/login", request.nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
