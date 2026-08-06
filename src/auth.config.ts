import type { NextAuthConfig } from "next-auth";
import type { AppRole } from "@/types/next-auth";

/**
 * Edge-compatible Auth.js config (no Node-only imports).
 * Providers live in `src/lib/auth.ts`.
 *
 * IMPORTANT: `session` must live here too — middleware only loads this file,
 * and without mapping JWT → session, `auth.user.role` is always undefined on
 * the edge (which caused /portal ↔ /portal/login refresh loops).
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
    error: "/portal/login",
  },
  providers: [],
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        if (typeof token.id === "string") session.user.id = token.id;
        else if (typeof token.sub === "string") session.user.id = token.sub;
        if (typeof token.email === "string") session.user.email = token.email;
        if (token.role === "admin" || token.role === "client") {
          session.user.role = token.role as AppRole;
        }
        session.user.displayName =
          typeof token.displayName === "string" ? token.displayName : null;
        session.user.image =
          typeof token.picture === "string" ? token.picture : null;
        session.user.needsOnboarding = Boolean(token.needsOnboarding);
      }
      return session;
    },
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
        // Fallback while JWT role is present but session mapping lagged
        if (auth?.user?.email) return true;
        return false;
      }

      if (isPortalArea) {
        if (isPortalLogin) return true;
        if (auth?.user?.role === "client") return true;
        // Never bounce to /admin/login — that loops with dual-role emails.
        return Response.redirect(new URL("/portal/login", request.nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
