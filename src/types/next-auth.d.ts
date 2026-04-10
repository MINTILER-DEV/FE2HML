import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "USER" | "MODERATOR" | "ADMIN";
      username?: string;
    };
  }

  interface User {
    role: "USER" | "MODERATOR" | "ADMIN";
    username?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "USER" | "MODERATOR" | "ADMIN";
    username?: string;
  }
}
