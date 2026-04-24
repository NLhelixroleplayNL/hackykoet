"use client"

import { signOut } from "next-auth/react"

interface SignOutButtonProps {
  className?: string
}

export default function SignOutButton({ className }: SignOutButtonProps) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className={className ?? "btn-ghost"}
    >
      Sign out
    </button>
  )
}
