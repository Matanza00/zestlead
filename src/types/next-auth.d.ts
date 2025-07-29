// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      twoFactorPending?: boolean;
    } & DefaultSession["user"]; // 👈 ensures name, email, image are preserved
  }

  interface User extends DefaultUser {
    id: string;
    role: string;
    twoFactorPending?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    twoFactorPending?: boolean;
  }
}
