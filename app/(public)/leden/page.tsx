import Image from "next/image"
import Link from "next/link"
import { getPlayersWithJob, type VertexPlayer } from "@/lib/vertex-api"
import { fetchAvatarMap } from "@/lib/discord"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const revalidate = 60

const GRADE_ORDER = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0] as const

const GRADE_BADGE: Record<number, string> = {
  9: "text-yellow-400 border-yellow-400/40 bg-yellow-400/5",
  8: "text-orange-400 border-orange-400/40 bg-orange-400/5",
  7: "text-red-400    border-red-400/40    bg-red-400/5",
  6: "text-purple-400 border-purple-400/40 bg-purple-400/5",
  5: "text-blue-400   border-blue-400/40   bg-blue-400/5",
  4: "text-green-400  border-green-400/40  bg-green-400/5",
  3: "text-green-300  border-green-300/40  bg-green-300/5",
  2: "text-emerald-400 border-emerald-400/40 bg-emerald-400/5",
  1: "text-teal-400   border-teal-400/40   bg-teal-400/5",
  0: "text-gray-400   border-gray-400/40   bg-gray-400/5",
}

function getDefaultAvatar(discordId: string) {
  const index = Number(BigInt(discordId) >> 22n) % 6
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`
}

function groupByGrade(players: VertexPlayer[]) {
  const grouped: Record<number, VertexPlayer[]> = {}
  for (const grade of GRADE_ORDER) grouped[grade] = []
  for (const player of players) {
    if (grouped[player.grade]) {
      grouped[player.grade].push(player)
    } else {
      grouped[player.grade] = [player]
    }
  }
  return grouped
}

export default async function LedenPage() {
  const [players, avatarMap] = await Promise.all([
    getPlayersWithJob("gsf"),
    fetchAvatarMap(),
  ])

  console.log(avatarMap)

  const grouped = groupByGrade(players)
  const activeGrades = GRADE_ORDER.filter((g) => grouped[g]?.length > 0)

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-12 bg-primary" />
          <h1 className="text-4xl font-black text-foreground">
            Leden <span className="text-primary">Lijst</span>
          </h1>
        </div>
        <p className="text-muted-foreground text-sm mb-2 ml-[60px]">
          Alle actieve leden van Grove Street Families, gegroepeerd op rang.
        </p>
        <p className="text-primary/60 text-xs mb-12 ml-[60px]">
          {players.length} actieve leden
        </p>

        {activeGrades.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Geen leden gevonden.</p>
          </div>
        ) : (
          <div className="space-y-14">
            {activeGrades.map((grade) => {
              const members = grouped[grade]
              const label = members[0].gradeLabel
              return (
                <section key={grade}>
                  <div className="flex items-center gap-4 mb-6">
                    <Badge className={cn(GRADE_BADGE[grade] ?? GRADE_BADGE[0])}>
                      {label}
                    </Badge>
                    <span className="text-muted-foreground/60 text-xs">
                      {members.length} lid{members.length !== 1 ? "en" : ""}
                    </span>
                    <div className="flex-1 border-t border-primary/5" />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {members.map((player) => {
                      const avatar = avatarMap.get(player.discordId) ?? getDefaultAvatar(player.discordId)
                      return (
                        <Link
                          key={player.license}
                          href={`/leden/${player.discordId}`}
                        >
                          <Card className="flex flex-col items-center text-center gap-3 p-4 hover:border-primary/30 transition-colors group cursor-pointer h-full">
                            <CardContent className="p-0 flex flex-col items-center gap-3 w-full">
                              <Image
                                src={avatar}
                                alt={player.name}
                                width={56}
                                height={56}
                                className="rounded-full ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
                                unoptimized
                              />
                              <div className="w-full">
                                <p className="text-foreground font-semibold text-sm leading-tight truncate">
                                  {player.name}
                                </p>
                                <p className="text-muted-foreground/60 text-xs mt-0.5 truncate">
                                  {label}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
