import Image from "next/image"
import Link from "next/link"
import { getLeaderboard } from "@/lib/queries"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const revalidate = 60
export const metadata = { title: "Leaderboard — Grove Street Families" }

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  return `${h}u ${m}m`
}

const MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" }

const RANK_COLOR: Record<string, string> = {
  Kingpin:       "text-yellow-400",
  Underboss:     "text-orange-400",
  "Shot Caller": "text-red-400",
  Lieutenant:    "text-purple-400",
  Enforcer:      "text-blue-400",
  Shooter:       "text-green-400",
  Hustler:       "text-green-300",
  "Corner Boy":  "text-emerald-400",
  Runner:        "text-teal-400",
  Hangaround:    "text-gray-400",
}

export default async function LeaderboardPage() {
  const board = (await getLeaderboard(10)) as Record<string, unknown>[]

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-16">

        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-12 bg-primary" />
          <h1 className="text-4xl font-black text-foreground">
            Clock <span className="text-primary">Leaderboard</span>
          </h1>
        </div>
        <p className="text-muted-foreground text-sm mb-12 ml-[60px]">
          Top 10 leden met de meeste dienst uren.
        </p>

        {board.length === 0 ? (
          <p className="text-muted-foreground text-center py-20">Nog geen clock data beschikbaar.</p>
        ) : (
          <div className="space-y-3">
            {board.map((member, i) => {
              const pos = i + 1
              const displayName = (member.nickname as string) ?? (member.username as string)
              const avatar = (member.avatar_url as string) ?? "https://cdn.discordapp.com/embed/avatars/0.png"
              const minutes = Number(member.total_minutes)
              const isTop3 = pos <= 3

              return (
                <Link key={member.discord_id as string} href={`/leden/${member.discord_id}`}>
                  <Card
                    className={cn(
                      "flex items-center gap-4 p-4 transition-all group cursor-pointer hover:scale-[1.01]",
                      isTop3
                        ? "border-primary/30 bg-primary/5 hover:border-primary/60"
                        : "hover:border-border/80"
                    )}
                  >
                    <CardContent className="p-0 flex items-center gap-4 w-full">
                      {/* Position */}
                      <div className="w-10 text-center flex-shrink-0">
                        {MEDAL[pos] ? (
                          <span className="text-2xl">{MEDAL[pos]}</span>
                        ) : (
                          <span className="text-muted-foreground font-bold text-lg">#{pos}</span>
                        )}
                      </div>

                      {/* Avatar */}
                      <Avatar className="h-11 w-11 ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all flex-shrink-0">
                        <AvatarImage src={avatar} alt={displayName} />
                        <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground font-bold truncate">{displayName}</p>
                        <p className={`text-xs font-semibold ${RANK_COLOR[member.gang_rank as string] ?? "text-muted-foreground"}`}>
                          {member.gang_rank as string}
                        </p>
                      </div>

                      {/* Hours */}
                      <div className="text-right flex-shrink-0">
                        <p className={`font-black text-lg ${isTop3 ? "text-primary" : "text-foreground"}`}>
                          {formatMinutes(minutes)}
                        </p>
                        <p className="text-muted-foreground/60 text-xs">{Number(member.session_count)} diensten</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
