"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SignOutButtonProps {
  className?: string
}

export default function SignOutButton({ className }: SignOutButtonProps) {
  return (
    <Button
      variant="secondary"
      className={cn("w-full", className)}
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Uitloggen
    </Button>
  )
}
