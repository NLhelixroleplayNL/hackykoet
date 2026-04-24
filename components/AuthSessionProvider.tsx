"use client"

import { SessionProvider } from "next-auth/react"

/**
 * Thin client wrapper around NextAuth's SessionProvider.
 * Required so that client components can call useSession().
 * Server components should use getServerSession(authOptions) directly.
 */
export default function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <SessionProvider>{children}</SessionProvider>
}
