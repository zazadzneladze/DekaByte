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
        return auth?.user?.role === "admin";
      }

      if (isPortalArea) {
        if (isPortalLogin) return true;
        return auth?.user?.role === "client";
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
