import Image from "next/image"
import Link from "next/link"
import { getInactiveMembers } from "@/lib/queries"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export const revalidate = 60
export const metadata = { title: "Oud-leden — Grove Street Families" }

function fmtDate(date: Date | string) {
  return new Date(date).toLocaleDateString("nl-NL", { day: "2-digit", month: "long", year: "numeric" })
}

export default async function OudLedenPage() {
  const members = await getInactiveMembers()

  const inactive = members.filter(m => m.status === "inactive")
  const banned = members.filter(m => m.status === "banned")

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-16">

        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-10 bg-primary" />
          <h1 className="font-display text-3xl text-foreground">
            Oud <span className="text-primary">Leden</span>
          </h1>
        </div>
        <p className="text-muted-foreground text-sm mb-12 ml-[52px]">
          Voormalige leden van Grove Street Families.
        </p>

        {members.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Geen oud-leden gevonden.</p>
          </div>
        ) : (
          <div className="space-y-12">

            {inactive.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-5">
                  <Badge className="text-gray-400 border-gray-400/40 bg-gray-400/5">Inactief</Badge>
                  <span className="text-muted-foreground/60 text-xs">{inactive.length} voormalige leden</span>
                  <div className="flex-1 border-t border-border/40" />
                </div>
                <MemberGrid members={inactive} fmtDate={fmtDate} />
              </section>
            )}

            {banned.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-5">
                  <Badge className="text-red-400 border-red-400/40 bg-red-400/5">Verbannen</Badge>
                  <span className="text-muted-foreground/60 text-xs">{banned.length} leden</span>
                  <div className="flex-1 border-t border-red-400/10" />
                </div>
                <MemberGrid members={banned} fmtDate={fmtDate} />
              </section>
            )}

          </div>
        )}
      </div>
    </div>
  )
}

function MemberGrid({
  members,
  fmtDate,
}: {
  members: Awaited<ReturnType<typeof getInactiveMembers>>
  fmtDate: (d: Date | string) => string
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {members.map((member) => {
        const avatar = member.avatar_url ?? "https://cdn.discordapp.com/embed/avatars/0.png"
        const displayName = member.nickname ?? member.username
        return (
          <Card key={member.discord_id} className="flex flex-col items-center text-center gap-3 p-4 opacity-60">
            <CardContent className="p-0 flex flex-col items-center gap-3 w-full">
              <Image
                src={avatar}
                alt={displayName}
                width={48}
                height={48}
                className="rounded-md ring-1 ring-border grayscale"
                unoptimized
              />
              <div className="w-full">
                <p className="text-foreground font-medium text-sm leading-tight truncate">{displayName}</p>
                <p className="text-muted-foreground/60 text-xs mt-0.5 truncate">@{member.username}</p>
                <p className="text-muted-foreground/40 text-xs mt-1">{member.gang_rank}</p>
                <p className="text-muted-foreground/30 text-[10px] mt-0.5">
                  Lid t/m {fmtDate(member.updated_at)}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
