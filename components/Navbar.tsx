"use client"

import { useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const PUBLIC_LINKS = [
  { href: "/leden", label: "Leden" },
  { href: "/regels", label: "Regels" },
  { href: "/stats", label: "Stats" },
  { href: "/aanmelden", label: "Aanmelden" },
]

const MEMBER_LINKS = [
  { href: "/leden", label: "Leden" },
  { href: "/oud-leden", label: "Oud-leden" },
  { href: "/gangpot", label: "Gangpot" },
  { href: "/regels", label: "Regels" },
  { href: "/stats", label: "Stats" },
]

export default function Navbar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = session ? MEMBER_LINKS : PUBLIC_LINKS

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/90 backdrop-blur-xl">
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">

        <Link
          href="/"
          className="relative flex items-center gap-2.5 shrink-0 transition-opacity hover:opacity-80"
        >
          <Image src="/logo.png" alt="GSF" width={28} height={28} className="rounded-sm" />
          <span className="font-display text-base tracking-[0.25em] text-primary">GSF</span>
        </Link>

        <div className="hidden md:flex items-center gap-0.5 flex-1">
          {links.map(link => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-sm text-[13px] font-medium transition-colors",
                  active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-sm bg-muted animate-pulse" />
          ) : session ? (
            <>
              <Button
                asChild
                size="sm"
                variant={pathname === "/dashboard" ? "default" : "ghost"}
                className={cn(
                  "hidden sm:inline-flex text-[13px] font-medium",
                  pathname !== "/dashboard" && "text-muted-foreground hover:text-foreground"
                )}
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>

              <div className="hidden sm:block w-px h-4 bg-border/50" />

              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7 rounded-sm">
                  <AvatarImage src={session.user.avatar} alt={session.user.username} />
                  <AvatarFallback className="rounded-sm text-xs">{session.user.username[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="hidden lg:block text-sm text-muted-foreground">
                  {session.user.username}
                </span>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-xs text-muted-foreground/50 hover:text-red-400 transition-colors ml-1"
              >
                Uit
              </button>
            </>
          ) : (
            <Button
              size="sm"
              className="text-[13px] font-medium"
              onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
            >
              <DiscordIcon className="w-3.5 h-3.5 mr-1.5" />
              Login
            </Button>
          )}

          <button
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 rounded-sm hover:bg-accent transition-colors"
            aria-label="Menu"
          >
            <span className={cn("block w-4 h-0.5 bg-foreground transition-all duration-300", mobileOpen && "rotate-45 translate-y-[3px]")} />
            <span className={cn("block w-4 h-0.5 bg-foreground mt-1 transition-all duration-300", mobileOpen && "-rotate-45 -translate-y-[3px]")} />
          </button>
        </div>

      </nav>

      <div className={cn(
        "md:hidden overflow-hidden transition-all duration-300 ease-out border-t border-border/40",
        mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0 border-t-transparent"
      )}>
        <div className="px-4 py-3 space-y-0.5">
          {links.map(link => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-sm text-sm font-medium transition-colors",
                  active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {link.label}
              </Link>
            )
          })}
          {session && (
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block sm:hidden px-3 py-2 rounded-sm text-sm font-medium transition-colors",
                pathname === "/dashboard"
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              Dashboard
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.1.12 18.14.149 18.16a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
    </svg>
  )
}
