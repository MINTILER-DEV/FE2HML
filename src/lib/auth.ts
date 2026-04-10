import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";

const mockUsers = [
  {
    id: "mock-admin",
    name: "Demo Admin",
    email: "admin@fhml.local",
    password: "demo-pass-123",
    role: "ADMIN" as const,
    username: "AblazePixel",
  },
  {
    id: "mock-mod",
    name: "Demo Moderator",
    email: "moderator@fhml.local",
    password: "demo-pass-123",
    role: "MODERATOR" as const,
    username: "GraniteBlink",
  },
  {
    id: "mock-user",
    name: "Demo User",
    email: "user@fhml.local",
    password: "demo-pass-123",
    role: "USER" as const,
    username: "CascadeKite",
  },
];

const useDatabase = Boolean(process.env.DATABASE_URL);

export const authOptions: NextAuthOptions = {
  adapter: useDatabase ? PrismaAdapter(prisma) : undefined,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        if (useDatabase) {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
            include: { playerProfile: true },
          });

          if (!user?.hashedPassword) {
            return null;
          }

          const matches = await bcrypt.compare(
            credentials.password,
            user.hashedPassword,
          );

          if (!matches) {
            return null;
          }

          return {
            id: user.id,
            name: user.name ?? user.playerProfile?.username ?? user.email,
            email: user.email,
            role: user.role,
            username: user.playerProfile?.username,
          };
        }

        const demoUser = mockUsers.find(
          (user) =>
            user.email === credentials.email.toLowerCase() &&
            user.password === credentials.password,
        );

        if (!demoUser) {
          return null;
        }

        return {
          id: demoUser.id,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role,
          username: demoUser.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.username = user.username;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role ?? "USER";
        session.user.username = token.username;
      }

      return session;
    },
  },
};

export function getAuthSession() {
  return getServerSession(authOptions);
}
