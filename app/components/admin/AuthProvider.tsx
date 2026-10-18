"use client";
import { SessionProvider } from "next-auth/react";
import TabSessionGuard from "./TabSessionGuard";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <TabSessionGuard />
      {children}
    </SessionProvider>
  );
}
