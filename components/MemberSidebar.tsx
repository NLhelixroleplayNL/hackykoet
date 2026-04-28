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
    <aside className="w-56 shrink-0 min-h-screen bg-card border-r border-border flex flex-col">

      <div className="px-5 py-5 border-b border-border">
        <p className="font-display text-primary text-lg tracking-[0.25em]">
          GSF
        </p>
        <p className="text-muted-foreground/40 text-[10px] font-mono tracking-widest uppercase mt-1">Leden Portaal</p>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {LINKS.map(link => {
          const active = pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-colors",
                active
                  ? "bg-primary/10 text-primary border border-primary/20 font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent"
              )}
            >
              <span className="text-base leading-none">{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-3">
        {session && (
          <div className="flex items-center gap-2.5 px-1">
            <Avatar className="h-7 w-7 rounded-sm shrink-0">
              <AvatarImage src={session.user.avatar} alt={session.user.username} />
              <AvatarFallback className="rounded-sm text-xs">{session.user.username[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-foreground text-sm font-medium truncate leading-tight">{session.user.username}</p>
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
          className="flex items-center gap-2 w-full px-3 py-2 rounded-sm text-xs font-mono font-medium tracking-wider uppercase text-muted-foreground/50 hover:text-foreground hover:bg-accent transition-colors"
        >
          <span className="text-base">←</span>
          Terug
        </Link>
      </div>

    </aside>
  )
}
