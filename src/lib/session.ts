import "server-only";
import { auth } from "@/lib/auth";

export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function requireClientSession() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "client") {
    throw new Error("Unauthorized");
  }
  return session.user;
}
