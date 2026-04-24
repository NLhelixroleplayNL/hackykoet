import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Image from "next/image"
import Link from "next/link"
import SignInButton from "./SignInButton"
import SignOutButton from "./SignOutButton"

export default async function Navbar() {
  const session = await getServerSession(authOptions)

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-green-500/20">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="font-black text-green-400 text-xl tracking-[0.25em] hover:text-green-300 transition-colors"
          style={{ textShadow: "0 0 20px rgba(34,197,94,0.4)" }}
        >
          GSF
        </Link>

        {/* Nav links + auth */}
        <div className="flex items-center gap-6">
          <Link
            href="/#info"
            className="hidden sm:block text-xs font-bold text-gray-500 hover:text-green-400 tracking-[0.2em] uppercase transition-colors"
          >
            Info
          </Link>

          <Link
            href="/leden"
            className="hidden sm:block text-xs font-bold text-gray-500 hover:text-green-400 tracking-[0.2em] uppercase transition-colors"
          >
            Leden Lijst
          </Link>

          {session ? (
            <div className="flex items-center gap-3">
              <Image
                src={session.user.avatar}
                alt={`${session.user.username}'s avatar`}
                width={32}
                height={32}
                className="rounded-full ring-2 ring-green-500/40"
              />
              <span className="text-sm text-green-300 hidden sm:inline">
                {session.user.username}
              </span>
              <SignOutButton />
            </div>
          ) : (
            <SignInButton variant="nav" />
          )}
        </div>
      </nav>
    </header>
  )
}
