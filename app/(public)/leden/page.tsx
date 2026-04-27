import Image from "next/image"
import Link from "next/link"
import { getMembersByRank, RANK_HIERARCHY } from "@/lib/queries"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const revalidate = 60

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000

const RANK_BADGE: Record<string, string> = {
  Kingpin:       "text-yellow-400 border-yellow-400/40 bg-yellow-400/5",
  Underboss:     "text-orange-400 border-orange-400/40 bg-orange-400/5",
  "Shot Caller": "text-red-400   border-red-400/40    bg-red-400/5",
  Lieutenant:    "text-purple-400 border-purple-400/40 bg-purple-400/5",
  Enforcer:      "text-blue-400  border-blue-400/40   bg-blue-400/5",
  Shooter:       "text-green-400 border-green-400/40  bg-green-400/5",
  Hustler:       "text-green-300 border-green-300/40  bg-green-300/5",
  "Corner Boy":  "text-emerald-400 border-emerald-400/40 bg-emerald-400/5",
  Runner:        "text-teal-400  border-teal-400/40   bg-teal-400/5",
  Hangaround:    "text-gray-400  border-gray-400/40   bg-gray-400/5",
}

function getDefaultAvatar() {
  return `https://cdn.discordapp.com/embed/avatars/0.png`
}

export default async function LedenPage() {
  const grouped = await getMembersByRank()
  const activeRoles = RANK_HIERARCHY.filter((r) => grouped[r]?.length > 0)
  const totalMembers = RANK_HIERARCHY.reduce((acc, r) => acc + (grouped[r]?.length ?? 0), 0)

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
          {totalMembers} actieve leden
        </p>

        {activeRoles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Nog geen leden in de database.</p>
            <p className="text-muted-foreground/50 text-sm mt-2">Leden worden toegevoegd via de Discord bot.</p>
          </div>
        ) : (
          <div className="space-y-14">
            {activeRoles.map((role) => (
              <section key={role}>
                <div className="flex items-center gap-4 mb-6">
                  <Badge className={cn(RANK_BADGE[role])}>
                    {role}
                  </Badge>
                  <span className="text-muted-foreground/60 text-xs">
                    {grouped[role].length} lid{grouped[role].length !== 1 ? "en" : ""}
                  </span>
                  <div className="flex-1 border-t border-primary/5" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {grouped[role].map((member) => {
                    const avatar = member.avatar_url ?? getDefaultAvatar()
                    const displayName = member.nickname ?? member.username
                    const isNew = Date.now() - new Date(member.joined_at).getTime() < THIRTY_DAYS
                    return (
                      <Link
                        key={member.discord_id}
                        href={`/leden/${member.discord_id}`}
                      >
                        <Card className="flex flex-col items-center text-center gap-3 p-4 hover:border-primary/30 transition-colors group cursor-pointer h-full relative">
                          {isNew && (
                            <span className="absolute top-2 right-2 text-[10px] font-bold text-primary border border-primary/40 bg-primary/5 px-1.5 py-0.5 rounded-full leading-none">
                              NIEUW
                            </span>
                          )}
                          <CardContent className="p-0 flex flex-col items-center gap-3 w-full">
                            <Image
                              src={avatar}
                              alt={displayName}
                              width={56}
                              height={56}
                              className="rounded-full ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
                              unoptimized
                            />
                            <div className="w-full">
                              <p className="text-foreground font-semibold text-sm leading-tight truncate">
                                {displayName}
                              </p>
                              <p className="text-muted-foreground/60 text-xs mt-0.5 truncate">@{member.username}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
