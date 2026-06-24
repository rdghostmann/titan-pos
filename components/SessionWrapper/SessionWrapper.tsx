// components/SessionWrapper/SessionWrapper.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

interface SessionWrapperProps {
  children: React.ReactNode;
  session?: Session | null;
}

export default function SessionWrapper({ children, session }: SessionWrapperProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}