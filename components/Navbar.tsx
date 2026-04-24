"use client"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function Navbar() {
  const { data: session } = useSession()
  return (
    <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="font-bold text-white text-lg">Discord Auth</Link>
      {session && (
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{session.user.username}</span>
          <button onClick={() => signOut()} className="btn-ghost">Sign out</button>
        </div>
      )}
    </nav>
  )
}
