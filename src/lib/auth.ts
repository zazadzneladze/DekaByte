import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { authConfig } from "@/auth.config";
import { getDb } from "@/db";
import { adminUsers } from "@/db/schema";
import { adminGetUserByEmail } from "@/db/queries";
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

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
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

        const passwordOk = await compare(
          parsed.data.password,
          user.passwordHash,
        );
        if (!passwordOk) {
          await recordFailedLogin(user.id, user.failedLoginCount);
          return null;
        }

        await recordSuccessfulLogin(user.id);

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id && token.email) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },
});
