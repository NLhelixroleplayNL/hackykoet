"use client"
import { signIn } from "next-auth/react"

export default function SignInButton({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <button onClick={() => signIn("discord")} className="btn-discord">
      Sign in with Discord
    </button>
  )
}
