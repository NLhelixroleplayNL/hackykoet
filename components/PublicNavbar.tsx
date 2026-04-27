"use client"

import { useSession, signIn } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const DISCORD_INVITE = "https://discord.gg/he7VUYBBZ4"

const LINKS = [
  { href: "/", label: "Informatie", exact: true },
  { href: "/leden", label: "Leden" },
  { href: "/regels", label: "Regels" },
]

export default function PublicNavbar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-6">

        <Link
          href="/"
          className="font-black text-primary text-xl tracking-widest shrink-0 hover:text-primary/80 transition-colors"
          style={{ textShadow: "0 0 24px rgba(34,197,94,0.5)" }}
        >
          GSF
        </Link>

        <div className="hidden md:flex items-center gap-1 flex-1">
          {LINKS.map(link => {
            const active = link.exact ? pathname === link.href : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button asChild variant="outline" size="sm" className="font-bold text-xs tracking-wider hover:text-primary hover:border-primary/40">
            <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
              <DiscordIcon className="w-3.5 h-3.5 mr-1.5" />
              Discord
            </a>
          </Button>

          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
          ) : session ? (
            <Button asChild size="sm" className="font-black text-xs tracking-widest uppercase" style={{ boxShadow: "0 0 16px rgba(34,197,94,0.3)" }}>
              <Link href="/member">Portaal</Link>
            </Button>
          ) : (
            <Button
              size="sm"
              className="font-black text-xs tracking-widest uppercase"
              style={{ boxShadow: "0 0 16px rgba(34,197,94,0.3)" }}
              onClick={() => signIn("discord", { callbackUrl: "/member" })}
            >
              <DiscordIcon className="w-3.5 h-3.5 mr-1.5" />
              Login
            </Button>
          )}
        </div>

      </nav>
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
