import { getGangStats, getLeaderboard } from "@/lib/queries"
import { readFileSync } from "fs"
import { join } from "path"
import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const revalidate = 60
export const metadata = { title: "Stats — Grove Street Families" }

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  return `${h}u ${m}m`
}

function getTicketStats() {
  try {
    const p = join(process.cwd(), "..", "Menendez", "data", "tickets", "stats.json")
    const raw = JSON.parse(readFileSync(p, "utf-8"))
    const srv = raw._server || {}
    return {
      totaalGeopend: srv.totaalGeopend || 0,
      totaalGesloten: srv.totaalGesloten || 0,
      actief: Math.max(0, (srv.totaalGeopend || 0) - (srv.totaalGesloten || 0)),
      rating: srv.totalRatings ? (srv.ratingSum / srv.totalRatings).toFixed(1) : null,
      totalRatings: srv.totalRatings || 0,
      categories: srv.categories || {},
    }
  } catch {
    return null
  }
}

const RANK_COLOR: Record<string, string> = {
  Kingpin: "text-yellow-400", Underboss: "text-orange-400", "Shot Caller": "text-red-400",
  Lieutenant: "text-purple-400", Enforcer: "text-blue-400", Shooter: "text-green-400",
  Hustler: "text-green-300", "Corner Boy": "text-emerald-400", Runner: "text-teal-400",
  Hangaround: "text-gray-400",
}

export default async function StatsPage() {
  const [gangStats, leaderboard] = await Promise.all([
    getGangStats(),
    getLeaderboard(5),
  ])
  const ticketStats = getTicketStats()
  const board = leaderboard as Record<string, unknown>[]

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-16">

        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-12 bg-primary" />
          <h1 className="text-4xl font-black text-foreground">
            Gang <span className="text-primary">Stats</span>
          </h1>
        </div>
        <p className="text-muted-foreground text-sm mb-12 ml-[60px]">Live statistieken van Grove Street Families.</p>

        {/* Gang stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <BigStat label="Actieve Leden" value={String(gangStats.memberCount)} color="text-primary" />
          <BigStat label="Totaal Uren" value={`${gangStats.totalClockHours}u`} color="text-blue-400" />
          <BigStat label="Activiteiten" value={String(gangStats.activityCount)} color="text-purple-400" />
          <BigStat label="Waarschuwingen" value={String(gangStats.warningCount)} color="text-red-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Top 5 clock leaderboard */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Top Clock Uren</CardTitle>
                <Link href="/leaderboard" className="text-xs text-primary hover:text-primary/80 transition-colors">
                  Alles zien →
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {board.length === 0 && (
                  <p className="text-muted-foreground/50 text-sm">Nog geen clock data.</p>
                )}
                {board.map((m, i) => {
                  const name = (m.nickname as string) ?? (m.username as string)
                  const avatar = (m.avatar_url as string) ?? "https://cdn.discordapp.com/embed/avatars/0.png"
                  return (
                    <Link
                      key={m.discord_id as string}
                      href={`/leden/${m.discord_id}`}
                      className="flex items-center gap-3 hover:bg-accent rounded-lg p-2 -mx-2 transition-colors"
                    >
                      <span className="text-muted-foreground/60 font-bold w-5 text-center text-sm">#{i + 1}</span>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={avatar} alt={name} />
                        <AvatarFallback>{name[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground text-sm font-semibold truncate">{name}</p>
                        <p className={`text-xs ${RANK_COLOR[m.gang_rank as string] ?? "text-muted-foreground"}`}>{m.gang_rank as string}</p>
                      </div>
                      <span className="text-primary font-bold text-sm shrink-0">
                        {formatMinutes(Number(m.total_minutes))}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Ticket stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ticket Statistieken</CardTitle>
            </CardHeader>
            <CardContent>
              {!ticketStats ? (
                <p className="text-muted-foreground/50 text-sm">Geen ticket data beschikbaar.</p>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <MiniStat label="Geopend" value={String(ticketStats.totaalGeopend)} color="text-blue-400" />
                    <MiniStat label="Gesloten" value={String(ticketStats.totaalGesloten)} color="text-primary" />
                    <MiniStat label="Actief" value={String(ticketStats.actief)} color="text-yellow-400" />
                  </div>
                  {ticketStats.rating && (
                    <div className="mb-5 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 text-center">
                      <p className="text-yellow-400 font-black text-2xl">{ticketStats.rating}<span className="text-sm">/5</span></p>
                      <p className="text-muted-foreground text-xs">{ticketStats.totalRatings} beoordelingen</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    {Object.entries(ticketStats.categories).map(([cat, data]) => {
                      const d = data as { geopend: number; gesloten: number }
                      const label = cat.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
                      return (
                        <div key={cat} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="text-foreground font-semibold">{d.geopend} tickets</span>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}

function BigStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Card>
      <CardContent className="p-5 text-center">
        <p className={`font-black text-3xl ${color}`}>{value}</p>
        <p className="text-muted-foreground text-xs mt-1 uppercase tracking-wider">{label}</p>
      </CardContent>
    </Card>
  )
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="text-center p-3 rounded-lg bg-secondary border border-border">
      <p className={`font-black text-xl ${color}`}>{value}</p>
      <p className="text-muted-foreground text-xs mt-0.5">{label}</p>
    </div>
  )
}
