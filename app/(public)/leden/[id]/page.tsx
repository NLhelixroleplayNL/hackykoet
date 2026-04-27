import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getMemberProfile } from "@/lib/queries"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const revalidate = 60

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  return `${h}u ${m}m`
}

function fmtDate(date: Date | string) {
  return new Date(date).toLocaleDateString("nl-NL", { day: "2-digit", month: "long", year: "numeric" })
}

function fmtDateTime(date: Date | string) {
  return new Date(date).toLocaleString("nl-NL", {
    timeZone: "Europe/Amsterdam",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

const RANK_BADGE: Record<string, string> = {
  Kingpin:       "text-yellow-400 border-yellow-400/30 bg-yellow-400/5",
  Underboss:     "text-orange-400 border-orange-400/30 bg-orange-400/5",
  "Shot Caller": "text-red-400 border-red-400/30 bg-red-400/5",
  Lieutenant:    "text-purple-400 border-purple-400/30 bg-purple-400/5",
  Enforcer:      "text-blue-400 border-blue-400/30 bg-blue-400/5",
  Shooter:       "text-green-400 border-green-400/30 bg-green-400/5",
  Hustler:       "text-green-300 border-green-300/30 bg-green-300/5",
  "Corner Boy":  "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
  Runner:        "text-teal-400 border-teal-400/30 bg-teal-400/5",
  Hangaround:    "text-gray-400 border-gray-400/30 bg-gray-400/5",
}

export default async function LidProfielPage({ params }: { params: { id: string } }) {
  const profile = await getMemberProfile(params.id)
  if (!profile) notFound()

  const displayName = profile.nickname ?? profile.username
  const avatar = profile.avatar_url ?? "https://cdn.discordapp.com/embed/avatars/0.png"
  const rankStyle = RANK_BADGE[profile.gang_rank] ?? "text-gray-400 border-gray-400/30 bg-gray-400/5"

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16">

        <Button asChild variant="ghost" size="sm" className="mb-10 text-muted-foreground hover:text-primary">
          <Link href="/leden">← Terug naar ledenlijst</Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Profile card */}
          <Card className="flex flex-col items-center text-center gap-4 p-6">
            <Avatar className="ring-4 ring-primary/30" style={{ height: 96, width: 96 }}>
              <AvatarImage src={avatar} alt={displayName} />
              <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-xl font-black text-foreground">{displayName}</h1>
              <p className="text-muted-foreground text-sm">@{profile.username}</p>
              <Badge className={cn("mt-3", rankStyle)}>
                {profile.gang_rank}
              </Badge>
            </div>

            <div className="w-full border-t border-border pt-4 space-y-2 text-sm text-left">
              <Row label="Lid sinds" value={fmtDate(profile.joined_at)} />
              <Row label="Status" value={profile.status === "active" ? "Actief" : profile.status} />
              <Row label="Discord ID" value={profile.discord_id} mono />
            </div>
          </Card>

          {/* Right column */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Clock stats */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Totaal uren" value={formatMinutes(profile.total_minutes)} color="text-primary" />
              <StatCard label="Diensten" value={String(profile.session_count)} color="text-blue-400" />
              <StatCard
                label="Gem. per dienst"
                value={profile.session_count > 0
                  ? formatMinutes(Math.round(profile.total_minutes / profile.session_count))
                  : "—"}
                color="text-purple-400"
              />
            </div>

            {/* Rang geschiedenis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Rang Geschiedenis</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.rank_history.length === 0 ? (
                  <p className="text-muted-foreground/50 text-sm">Nog geen rang wijzigingen.</p>
                ) : (
                  <div className="space-y-3">
                    {(profile.rank_history as Record<string, string>[]).map((rh, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {rh.old_rank ? (
                            <>
                              <span className="text-muted-foreground">{rh.old_rank}</span>
                              <span className="text-muted-foreground/50">→</span>
                            </>
                          ) : null}
                          <span className="text-foreground font-semibold">{rh.new_rank}</span>
                        </div>
                        <span className="text-muted-foreground/60 text-xs shrink-0 ml-4">
                          {fmtDateTime(rh.changed_at)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recente diensten */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recente Diensten</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.recent_sessions.length === 0 ? (
                  <p className="text-muted-foreground/50 text-sm">Nog geen diensten geregistreerd.</p>
                ) : (
                  <div className="space-y-3">
                    {(profile.recent_sessions as Record<string, string>[]).map((s, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-foreground">{fmtDateTime(s.start_time)}</p>
                          <p className="text-muted-foreground text-xs">→ {fmtDateTime(s.end_time)}</p>
                        </div>
                        <span className="text-primary font-bold shrink-0 ml-4">
                          {formatMinutes(Number(s.duration_minutes))}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activiteiten */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activiteiten</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.activities.length === 0 ? (
                  <p className="text-muted-foreground/50 text-sm">Nog geen activiteiten bijgewoond.</p>
                ) : (
                  <div className="space-y-3">
                    {(profile.activities as Record<string, string>[]).map((a, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-foreground font-medium">{a.name}</p>
                          <p className="text-muted-foreground text-xs">{a.type ?? "Activiteit"}</p>
                        </div>
                        <span className="text-muted-foreground/60 text-xs shrink-0 ml-4">
                          {fmtDate(a.date)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Waarschuwingen */}
            {profile.warnings.length > 0 && (
              <Card className="border-red-400/20">
                <CardHeader>
                  <CardTitle className="text-base text-red-400">
                    Waarschuwingen ({profile.warnings.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(profile.warnings as Record<string, string>[]).map((w, i) => (
                      <div key={i} className="text-sm border-l-2 border-red-400/30 pl-3">
                        <p className="text-foreground">{w.reason}</p>
                        <p className="text-muted-foreground/60 text-xs mt-0.5">
                          Uitgedeeld door <span className="font-mono">{w.issued_by}</span> · {fmtDate(w.created_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={`text-foreground/80 truncate max-w-[160px] ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">{label}</p>
        <p className={`font-black text-lg ${color}`}>{value}</p>
      </CardContent>
    </Card>
  )
}
