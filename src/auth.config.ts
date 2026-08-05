import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible Auth.js config (no Node-only imports).
 * Full Credentials provider lives in `src/lib/auth.ts`.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isAdmin = pathname.startsWith("/admin");
      const isLogin = pathname === "/admin/login";

      if (!isAdmin) return true;
      if (isLogin) return true;

      return !!auth?.user;
    },
  },
} satisfies NextAuthConfig;
