import Link from "next/link"
import Image from "next/image"
import { getGangStats } from "@/lib/queries"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const revalidate = 60

const LOGO = "/logo.png"
const DISCORD_INVITE = "https://discord.gg/he7VUYBBZ4"

export default async function HomePage() {
  const stats = await getGangStats()

  return (
    <div className="min-h-screen overflow-hidden relative">

      <div className="absolute inset-0 grid-bg grid-bg-fade pointer-events-none" />

      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none opacity-40"
        style={{ background: "radial-gradient(ellipse at center, rgba(34,197,94,0.12) 0%, transparent 60%)" }}
      />

      <section className="relative max-w-5xl mx-auto px-4 pt-24 pb-32">
        <div className="relative flex flex-col items-center text-center gap-10">

          <div className="relative">
            <div
              className="absolute inset-0 blur-3xl opacity-25"
              style={{ background: "radial-gradient(circle, rgba(34,197,94,0.6) 0%, transparent 60%)" }}
            />
            <Image
              src={LOGO}
              alt="Grove Street Families"
              width={120}
              height={120}
              className="relative rounded ring-1 ring-primary/20"
              unoptimized
              priority
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5">
            <span className="w-1.5 h-1.5 bg-primary animate-pulse" />
            <span className="text-primary text-[11px] font-mono font-medium tracking-widest uppercase">
              GSF - Vertex Roleplay
            </span>
          </div>

          <div>
            <h1 className="text-7xl sm:text-9xl font-display text-foreground leading-[0.85] tracking-tight ">
              Grove<br />
              <span className="text-primary">Street</span>
            </h1>
            <p className="text-muted-foreground text-base font-mono tracking-widest uppercase mt-4">
              Families — <span className="text-primary font-semibold">GSF</span>
            </p>
          </div>

          <p className="text-muted-foreground/60 text-sm leading-relaxed max-w-md">
            GSF, staat altijd op #1, enigste officiele organisatie + level 5!
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="font-medium tracking-wide">
              <Link href="/leden">Bekijk Leden</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="hover:text-primary hover:border-primary/40">
              <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
                <DiscordIcon className="w-4 h-4 mr-2" />
                Join Discord
              </a>
            </Button>
          </div>

          <div className="pt-6">
            <LiveStat value={stats.memberCount} label="Actieve Leden" glow />
          </div>

        </div>
      </section>

      <div className="relative max-w-5xl mx-auto px-4">
        <div className="border-t border-border/30" />
      </div>

      <section className="relative max-w-5xl mx-auto px-4 py-28">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px w-12 bg-primary" />
          <h2 className="font-display text-3xl text-foreground tracking-tight">
            Quote&apos;s van <span className="text-primary">GSF</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              tag: "01",
              quote: "Het zijn altijd de mensen die koran lezen die t verkankeren voor de andere",
              author: "Dimi",
            },
            {
              tag: "02",
              quote: "Hand op de krant, moslims onder het kanker zand",
              author: "Hacky Koet",
            },
            {
              tag: "03",
              quote: "Als jij er moeite mee heb, moet je op je kameel lekker wegrijden",
              author: "Uncle Kush",
            },
          ].map(card => (
            <Card key={card.author} className="group hover:border-primary/20 transition-colors relative overflow-hidden">
              <CardContent className="p-6 flex flex-col gap-4">
                <span className="absolute top-4 right-4 font-mono text-xs text-border select-none">{card.tag}</span>
                <p className="text-muted-foreground text-sm leading-relaxed italic">&ldquo;{card.quote}&rdquo;</p>
                <p className="text-primary font-mono text-xs font-semibold">— {card.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative max-w-5xl mx-auto px-4 pb-28">
        <div className="relative border border-primary/20 bg-primary/5 p-12 text-center overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.08) 0%, transparent 50%)" }}
          />
          <p className="font-mono text-primary text-[11px] font-medium tracking-widest uppercase mb-3">Wil je bij ons horen?</p>
          <h2 className="font-display text-3xl text-foreground mb-4">Join Grove Street Families</h2>
          <p className="text-muted-foreground mb-10 max-w-sm mx-auto text-sm leading-relaxed">
            Lees de regels, join de Discord en bewijs je waarde aan de familia.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button asChild className="font-medium tracking-wide">
              <Link href="/regels">Lees de Regels</Link>
            </Button>
            <Button asChild variant="outline" className="hover:text-primary hover:border-primary/40">
              <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
                <DiscordIcon className="w-4 h-4 mr-2" />
                Join Discord
              </a>
            </Button>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-border/30 py-8">
        <p className="text-center text-muted-foreground/30 text-xs font-mono tracking-wider">
          &copy; Grove Street Families —{" "}
          <span className="text-primary/40">Grove Street 4 Life</span>
        </p>
      </footer>

    </div>
  )
}

function LiveStat({ value, label, glow = false }: { value: string | number; label: string; glow?: boolean }) {
  return (
    <Card className={glow ? "border-primary/30 bg-primary/5" : ""}>
      <CardContent className="p-4 text-center">
        <p className={`stat-mono text-2xl font-semibold ${glow ? "text-primary" : "text-foreground"}`}>
          {value}
        </p>
        <p className="text-muted-foreground text-[10px] mt-1.5 font-mono uppercase tracking-widest">{label}</p>
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
