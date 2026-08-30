import type { NextAuthConfig } from "next-auth";

// ⚠️ This file is Edge-safe — NO Prisma imports here
// Used by proxy.ts (middleware) which runs on the Edge runtime
export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        // On first sign-in, set activeRole = role
        if (!token.activeRole) {
          token.activeRole = (user as any).role;
        }
        token.enabledRoles = (user as any).enabledRoles ?? [(user as any).role];
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        if (token.id) session.user.id = token.id as string;
        if (token.email) session.user.email = token.email as string;
        if (token.name) session.user.name = token.name as string;
        const mainRole = (token.role as string) || "ADVERTISER";
        (session.user as any).role = mainRole;
        (session.user as any).activeRole = mainRole === "ADMIN" ? "ADMIN" : ((token.activeRole ?? mainRole) as string);
        (session.user as any).enabledRoles = (token.enabledRoles ?? [mainRole]) as string[];
      }
      return session;
    },
  },
  providers: [], // Credentials/Google providers added in lib/auth.ts
};
