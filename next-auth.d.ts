// /types/next-auth.d.ts

import NextAuth, {
  DefaultSession,
} from "next-auth"

import { DefaultJWT } from "next-auth/jwt"

export type UserRole =
  | "admin"
  | "cashier";

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      name?: string
      email?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    name?: string
    email: string
    role: UserRole
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    email: string
    name?: string
    role: UserRole
  }
}