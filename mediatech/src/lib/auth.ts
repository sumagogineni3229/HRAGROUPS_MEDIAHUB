// Full auth config — runs on Node.js runtime (server only, NOT edge)
// Prisma adapter is safe here
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;

        const existingUser = await db.user.findUnique({
          where: { email: user.email },
          select: { id: true },
        });

        // If user does not exist in DB and didn't initiate signup from /register, block login
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const signupRole = cookieStore.get("signup_role")?.value;

        if (!existingUser && !signupRole) {
          return "/login?error=NoAccountFound";
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session: sessionUpdate }) {
      if (user) {
        token.id = user.id;
        if ((user as any).role === "ADMIN" || (user as any).role === "EDITOR") {
          token.role = (user as any).role;
          token.activeRole = (user as any).role;
        }
      }
      // Support client-side session.update({ activeRole }) call
      if (trigger === "update" && sessionUpdate?.activeRole && token.role !== "ADMIN" && token.role !== "EDITOR") {
        token.activeRole = sessionUpdate.activeRole;
      }
      if (token.id) {
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, isSuspended: true, enabledRoles: true },
        });
        if (dbUser) {
          if (dbUser.isSuspended) {
            token.role = undefined;
            token.isSuspended = true;
          } else {
            token.role = dbUser.role;
            token.isSuspended = false;
            // Populate enabledRoles from DB (may be empty for old rows)
            token.enabledRoles =
              dbUser.enabledRoles && dbUser.enabledRoles.length > 0
                ? dbUser.enabledRoles
                : [dbUser.role];
            // Only override activeRole from DB if not set in token yet, but ADMIN and EDITOR always force activeRole
            if (dbUser.role === "ADMIN" || dbUser.role === "EDITOR") {
              token.activeRole = dbUser.role;
            } else if (!token.activeRole) {
              token.activeRole = dbUser.role;
            }
          }
        }
      }
      return token;
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const identifier = (credentials?.email || (credentials as any)?.login) as string | undefined;
        if (!identifier || !credentials?.password) return null;

        // Allow identifier to match either email or phone
        const user = await db.user.findFirst({
          where: {
            OR: [
              { email: identifier },
              { phone: identifier },
            ],
          },
          select: { id: true, email: true, name: true, avatar: true, role: true, password: true, isSuspended: true },
        });

        if (!user?.password) return null;
        if (user.isSuspended) throw new Error("ACCOUNT_SUSPENDED");

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return { id: user.id, email: user.email, name: user.name, image: user.avatar, role: user.role };
      },
    }),
  ],
});
