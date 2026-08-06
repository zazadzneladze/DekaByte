import "server-only";
import { auth } from "@/lib/auth";

export function userIsAdmin(user: {
  role?: string;
  isAdmin?: boolean;
} | null | undefined) {
  return user?.role === "admin" || user?.isAdmin === true;
}

export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user?.id || !userIsAdmin(session.user)) {
    throw new Error("Unauthorized");
  }
  const adminId =
    session.user.adminId ??
    (session.user.role === "admin" ? session.user.id : null);
  if (!adminId) {
    throw new Error("Unauthorized");
  }
  return { ...session.user, id: adminId };
}

export async function requireClientSession() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "client") {
    throw new Error("Unauthorized");
  }
  return session.user;
}
