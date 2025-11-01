// src/lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import type { AuthOptions, User } from "next-auth";
import type { Account, Session, TokenSet, User as NextAuthUser } from "next-auth";
import type { JWT } from "next-auth/jwt";


export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { twoFactorAuth: true },
        });

        if (!user || !user.password) return null;

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        // If 2FA is enabled, return user with twoFactorPending flag
        if (user.twoFactorAuth?.enabled) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            twoFactorPending: true,
          };
        }

        return user;
      },

    }),
  ],
  
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allow relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      // Allow whitelisted absolute URLs
      const allowed = [
        baseUrl,                                      // resolves from NEXTAUTH_URL
        "https://zestlead.onrender.com",              // Render subdomain
        "https://www.zestlead.com",                   // (add your custom domain later)
        "https://zestlead.com",
      ];
      if (allowed.some(a => url.startsWith(a))) return url;

      // Fallback after login
      return `${baseUrl}/user`;
    },
    async signIn({ user, account }: { user: NextAuthUser; account: Account | null }) {
      // If Google account, check if user already exists
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (existingUser) {
          const linkedAccount = await prisma.account.findFirst({
            where: {
              provider: "google",
              providerAccountId: account.providerAccountId,
            },
          });

          if (!linkedAccount) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            });
          }

          user.id = existingUser.id;
        }
      }

      return true;
    },
    async jwt({ token, user }: { token: JWT; user?: NextAuthUser }) {
      // If user is signing in, add their ID and role to the token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.twoFactorPending = user.twoFactorPending || false; // 👈 carry forward
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      // Add user ID and role to session
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.twoFactorPending = token.twoFactorPending || false; // 👈 expose to client
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",       // ← ensure it's sent on /api/cart calls
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};
