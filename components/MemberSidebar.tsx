"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const LINKS = [
  { href: "/member/regels",      label: "Regels",      icon: "📋" },
  { href: "/member/outfit",      label: "Outfit",      icon: "👕" },
  { href: "/member/porto",       label: "Porto",       icon: "📻" },
  { href: "/member/sancties",    label: "Sancties",    icon: "⚠️" },
  { href: "/member/porto-namen", label: "Porto Namen", icon: "🎙️" },
  { href: "/member/auto-kleur",  label: "Auto Kleur",  icon: "🚗" },
  { href: "/member/gangpot",     label: "Gang Pot",    icon: "💰" },
]

export default function MemberSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="w-56 shrink-0 min-h-screen bg-card border-r border-border/60 flex flex-col">

      {/* Logo */}
      <div className="px-5 py-6 border-b border-border/60">
        <p
          className="text-primary font-black text-2xl tracking-widest"
          style={{ textShadow: "0 0 20px rgba(34,197,94,0.45)" }}
        >
          GSF
        </p>
        <p className="text-muted-foreground/40 text-[11px] tracking-widest uppercase mt-0.5">Leden Portaal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        {LINKS.map(link => {
          const active = pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60 border border-transparent"
              )}
            >
              <span className="text-base leading-none">{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* User info + controls */}
      <div className="p-4 border-t border-border/60 space-y-3">
        {session && (
          <div className="flex items-center gap-2.5 px-1">
            <Avatar className="h-8 w-8 ring-2 ring-primary/20 shrink-0">
              <AvatarImage src={session.user.avatar} alt={session.user.username} />
              <AvatarFallback className="text-xs">{session.user.username[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-foreground text-sm font-semibold truncate leading-tight">{session.user.username}</p>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-muted-foreground/50 text-xs hover:text-red-400 transition-colors leading-tight"
              >
                Uitloggen
              </button>
            </div>
          </div>
        )}

        <Link
          href="/"
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-bold tracking-widest uppercase text-muted-foreground/50 hover:text-foreground hover:bg-accent/60 transition-all border border-transparent hover:border-border/40"
        >
          <span className="text-base">←</span>
          Terug
        </Link>
      </div>

    </aside>
  )
}
