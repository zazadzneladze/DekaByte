import "server-only";

/** Pure helper — safe to import from server components that already use auth. */
export function userIsAdmin(user: {
  role?: string;
  isAdmin?: boolean;
} | null | undefined) {
  return user?.role === "admin" || user?.isAdmin === true;
}
