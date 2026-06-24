// /types/next-auth.d.ts

import NextAuth, {
  DefaultSession,
} from "next-auth"

import { DefaultJWT } from "next-auth/jwt"

export type UserRole =
  | "buyer"
  | "supplier"
  | "admin"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      firstName?: string
      lastName?: string
      role: UserRole
      verified?: boolean
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    firstName?: string
    lastName?: string
    email: string
    role: UserRole
    verified?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    email: string
    firstName?: string
    lastName?: string
    role: UserRole
    verified?: boolean
  }
}