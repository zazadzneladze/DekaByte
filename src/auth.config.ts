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
        // Static assets under /admin (matcher usually excludes these)
        if (
          pathname.endsWith(".js") ||
          pathname.endsWith(".webmanifest") ||
          pathname.endsWith(".png")
        ) {
          return true;
        }
        if (auth?.user?.role === "admin") return true;
        // Legacy JWT without role — let the Node layout backfill + enforce
        if (auth?.user?.email) return true;
        return false;
      }

      if (isPortalArea) {
        if (isPortalLogin) return true;
        return auth?.user?.role === "client";
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
