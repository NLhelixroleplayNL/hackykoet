import Link from "next/link"
import Image from "next/image"
import { getGangStats } from "@/lib/queries"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const revalidate = 60

const LOGO = "https://cdn.discordapp.com/attachments/1484289535972999209/1490862432992628766/IMG_5849.png?ex=69f0a016&is=69ef4e96&hm=da1b7f69b85fd6c16971f41562cab84d104701d69dc7d761986ac1c1c84c7b3e&"
const DISCORD_INVITE = "https://discord.gg/he7VUYBBZ4"

export default async function HomePage() {
  const stats = await getGangStats()

  return (
    <div className="min-h-screen overflow-hidden">

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-4 pt-16 pb-24">
        {/* Glow blobs */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(34,197,94,0.07) 0%, transparent 70%)" }}
        />

        <div className="relative flex flex-col items-center text-center gap-10">

          {/* Logo */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full blur-2xl opacity-40"
              style={{ background: "radial-gradient(circle, rgba(34,197,94,0.5) 0%, transparent 70%)" }}
            />
            <Image
              src={LOGO}
              alt="Grove Street Families"
              width={160}
              height={160}
              className="relative rounded-full ring-4 ring-primary/30 shadow-2xl"
              unoptimized
              priority
            />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/25 bg-primary/5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-xs font-bold tracking-widest uppercase">
              Los Santos — San Andreas
            </span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-7xl sm:text-9xl font-black text-foreground leading-none tracking-tighter mb-3">
              Grove<br />
              <span className="text-primary" style={{ textShadow: "0 0 80px rgba(34,197,94,0.45)" }}>
                Street
              </span>
            </h1>
            <p className="text-muted-foreground text-xl font-semibold tracking-widest uppercase">
              Families — <span className="text-primary">GSF</span>
            </p>
          </div>

          <p className="text-muted-foreground/70 text-base leading-relaxed max-w-lg">
            De sterkste en meest loyale crew van Los Santos.
            Groen vloeit door onze aderen. Grove Street is voor altijd.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="font-black tracking-wide px-8" style={{ boxShadow: "0 0 28px rgba(34,197,94,0.35)" }}>
              <Link href="/leden">Bekijk Leden</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-bold tracking-wide hover:text-primary hover:border-primary/40">
              <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
                <DiscordIcon className="w-4 h-4 mr-2" />
                Join Discord
              </a>
            </Button>
          </div>

          {/* Live stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl pt-4">
            <LiveStat value={stats.memberCount} label="Actieve Leden" glow />
            <LiveStat value={`${stats.totalClockHours}u`} label="Totaal Uren" />
            <LiveStat value={stats.activityCount} label="Activiteiten" />
            <LiveStat value={stats.warningCount} label="Waarschuwingen" />
          </div>

        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="border-t border-border/30" />
      </div>

      {/* Info cards */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="flex items-center gap-3 mb-12">
          <div className="h-px w-12 bg-primary" />
          <h2 className="text-3xl font-black text-foreground tracking-tight">
            Over <span className="text-primary">GSF</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: "🤝",
              title: "Loyaliteit",
              body: "Grove Street Families staan voor loyaliteit boven alles. Eén voor allen, allen voor één. Eens GSF, altijd GSF.",
            },
            {
              icon: "🗺️",
              title: "Territorium",
              body: "Wij domineren Los Santos van Ganton tot Idlewood. Grove Street is ons thuis en wij verdedigen het met alles wat we hebben.",
            },
            {
              icon: "🛡️",
              title: "Respect",
              body: "Respect wordt verdiend, niet gegeven. Bewijs je waarde aan de familia en stijg op in de rangen van Grove Street.",
            },
          ].map(card => (
            <Card key={card.title} className="group hover:border-primary/20 transition-all">
              <CardContent className="p-6">
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="text-foreground font-bold text-lg mb-2">{card.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{card.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="relative rounded-2xl border border-primary/20 bg-primary/5 p-10 text-center overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.08) 0%, transparent 60%)" }}
          />
          <p className="text-primary text-xs font-bold tracking-widest uppercase mb-3">Wil je bij ons horen?</p>
          <h2 className="text-3xl font-black text-foreground mb-4">Join Grove Street Families</h2>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-sm leading-relaxed">
            Lees de regels, join de Discord en bewijs je waarde aan de familia.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button asChild className="font-black tracking-wide" style={{ boxShadow: "0 0 20px rgba(34,197,94,0.25)" }}>
              <Link href="/regels">Lees de Regels</Link>
            </Button>
            <Button asChild variant="outline" className="font-bold hover:text-primary hover:border-primary/40">
              <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
                <DiscordIcon className="w-4 h-4 mr-2" />
                Join Discord
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8">
        <p className="text-center text-muted-foreground/40 text-sm tracking-wider">
          © Grove Street Families —{" "}
          <span className="text-primary/60">Grove Street 4 Life</span>
        </p>
      </footer>

    </div>
  )
}

function LiveStat({ value, label, glow = false }: { value: string | number; label: string; glow?: boolean }) {
  return (
    <Card className={glow ? "border-primary/30 bg-primary/5" : ""}>
      <CardContent className="p-4 text-center">
        <p
          className={`font-black text-2xl ${glow ? "text-primary" : "text-foreground"}`}
          style={glow ? { textShadow: "0 0 20px rgba(34,197,94,0.4)" } : undefined}
        >
          {value}
        </p>
        <p className="text-muted-foreground text-xs mt-1 uppercase tracking-wide">{label}</p>
      </CardContent>
    </Card>
  )
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.1.12 18.14.149 18.16a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
    </svg>
  )
}
