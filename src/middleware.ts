import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    /*
     * Protect admin + portal, but never run auth on static PWA assets
     * (SW registration fails if the script URL redirects to login).
     */
    "/admin",
    "/admin/((?!sw\\.js$|manifest\\.webmanifest$).*)",
    "/portal/:path*",
  ],
};
