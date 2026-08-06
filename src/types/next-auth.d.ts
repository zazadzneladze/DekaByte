import type { DefaultSession } from "next-auth";
import "next-auth/jwt";

export type AppRole = "admin" | "client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: AppRole;
      /** True when email is an active admin_users row (even if role is client). */
      isAdmin?: boolean;
      /** admin_users.id when dual-role; used by admin actions. */
      adminId?: string | null;
      displayName?: string | null;
      image?: string | null;
      needsOnboarding?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    role: AppRole;
    isAdmin?: boolean;
    adminId?: string | null;
    displayName?: string | null;
    image?: string | null;
    needsOnboarding?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    role?: AppRole;
    isAdmin?: boolean;
    adminId?: string | null;
    displayName?: string | null;
    picture?: string | null;
    needsOnboarding?: boolean;
  }
}

export {};
