import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { authConfig } from "@/auth.config";
import { getDb } from "@/db";
import { adminUsers } from "@/db/schema";
import {
  adminGetUserByEmail,
  clientEmailHasProjectAccess,
  getClientUserByEmail,
  upsertClientUserFromGoogle,
} from "@/db/queries";
import { loginSchema } from "@/validators/auth";

const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_MINUTES = 15;

async function recordFailedLogin(userId: string, currentCount: number) {
  const db = getDb();
  const failedLoginCount = currentCount + 1;
  const lockedUntil =
    failedLoginCount >= LOCKOUT_THRESHOLD
      ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
      : null;

  await db
    .update(adminUsers)
    .set({
      failedLoginCount,
      lockedUntil,
      updatedAt: new Date(),
    })
    .where(eq(adminUsers.id, userId));
}

async function recordSuccessfulLogin(userId: string) {
  const db = getDb();
  await db
    .update(adminUsers)
    .set({
      failedLoginCount: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(adminUsers.id, userId));
}

const googleConfigured =
  Boolean(process.env.AUTH_GOOGLE_ID) && Boolean(process.env.AUTH_GOOGLE_SECRET);

const providers = [
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const parsed = loginSchema.safeParse(credentials);
      if (!parsed.success) return null;

      const email = parsed.data.email.toLowerCase();
      const user = await adminGetUserByEmail(email);
      if (!user || !user.isActive) return null;

      if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
        return null;
      }

      const passwordOk = await compare(parsed.data.password, user.passwordHash);
      if (!passwordOk) {
        await recordFailedLogin(user.id, user.failedLoginCount);
        return null;
      }

      await recordSuccessfulLogin(user.id);

      return {
        id: user.id,
        email: user.email,
        role: "admin" as const,
        isAdmin: true,
        adminId: user.id,
        displayName: null,
        image: null,
        needsOnboarding: false,
      };
    },
  }),
  ...(googleConfigured
    ? [
        Google({
          clientId: process.env.AUTH_GOOGLE_ID!,
          clientSecret: process.env.AUTH_GOOGLE_SECRET!,
          allowDangerousEmailAccountLinking: true,
        }),
      ]
    : []),
];

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  ...authConfig,
  trustHost: true,
  session: { strategy: "jwt" },
  providers,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") return true;

      const email = (user.email ?? profile?.email)?.toLowerCase();
      if (!email) return "/portal/login?error=AccessDenied";

      const allowed = await clientEmailHasProjectAccess(email);
      if (!allowed) return "/portal/login?error=AccessDenied";

      const googleSub =
        typeof account.providerAccountId === "string"
          ? account.providerAccountId
          : null;
      const image =
        typeof user.image === "string"
          ? user.image
          : typeof profile === "object" &&
              profile &&
              "picture" in profile &&
              typeof profile.picture === "string"
            ? profile.picture
            : null;

      const row = await upsertClientUserFromGoogle({
        email,
        googleSub,
        image,
      });

      user.id = row.id;
      user.email = row.email;
      user.role = "client";
      user.displayName = row.displayName;
      user.image = row.avatarUrl || row.image;
      user.needsOnboarding = !row.displayName?.trim();

      const admin = await adminGetUserByEmail(email);
      user.isAdmin = Boolean(admin?.isActive);
      user.adminId = admin?.isActive ? admin.id : null;

      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? token.email;
        token.role = user.role ?? token.role;
        token.displayName = user.displayName ?? token.displayName ?? null;
        token.picture = user.image ?? token.picture ?? null;
        token.needsOnboarding = Boolean(user.needsOnboarding);
        token.isAdmin = Boolean(user.isAdmin ?? user.role === "admin");
        token.adminId =
          typeof user.adminId === "string"
            ? user.adminId
            : user.role === "admin"
              ? user.id
              : (token.adminId ?? null);
      }

      if (trigger === "update" && session) {
        const patch =
          session.user && typeof session.user === "object"
            ? session.user
            : session;
        if (typeof patch.displayName === "string") {
          token.displayName = patch.displayName;
          token.needsOnboarding = !patch.displayName.trim();
        }
        if ("image" in patch) {
          token.picture =
            typeof patch.image === "string" ? patch.image : null;
        }
        if (typeof patch.needsOnboarding === "boolean") {
          token.needsOnboarding = patch.needsOnboarding;
        }
      }

      const email = token.email ? String(token.email).toLowerCase() : null;

      // Persist / repair role. Keep client as active role for Google sessions,
      // but still attach isAdmin/adminId when the same email is an admin.
      if (
        email &&
        (account?.provider === "google" ||
          !token.role ||
          token.role === "client")
      ) {
        try {
          if (account?.provider === "google" || token.role === "client") {
            if (account?.provider === "google" || !token.id) {
              const allowed = await clientEmailHasProjectAccess(email);
              if (allowed) {
                const row = await getClientUserByEmail(email);
                if (row) {
                  token.id = row.id;
                  token.role = "client";
                  token.displayName = row.displayName;
                  token.picture = row.avatarUrl || row.image;
                  token.needsOnboarding = !row.displayName?.trim();
                }
              }
            }
            const admin = await adminGetUserByEmail(email);
            token.isAdmin = Boolean(admin?.isActive);
            token.adminId = admin?.isActive ? admin.id : null;
          } else if (!token.role) {
            const admin = await adminGetUserByEmail(email);
            if (admin?.isActive) {
              token.role = "admin";
              token.id = admin.id;
              token.isAdmin = true;
              token.adminId = admin.id;
              token.needsOnboarding = false;
            }
          }
        } catch {
          /* ignore lookup errors */
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.email) {
        session.user.id = token.id ?? session.user.id ?? "";
        session.user.email = token.email;
        if (token.role) {
          session.user.role = token.role;
        }
        session.user.isAdmin = Boolean(token.isAdmin);
        session.user.adminId =
          typeof token.adminId === "string" ? token.adminId : null;
        session.user.displayName = token.displayName ?? null;
        session.user.image = token.picture ?? null;
        session.user.needsOnboarding = Boolean(token.needsOnboarding);
      }
      return session;
    },
  },
});
