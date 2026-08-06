import "server-only";
import { auth } from "@/lib/auth";
import { userIsAdmin } from "@/lib/roles";

export { userIsAdmin } from "@/lib/roles";

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
