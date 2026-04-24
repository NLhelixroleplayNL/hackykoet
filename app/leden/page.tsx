import Image from "next/image"
import { fetchGroupedMembers, ROLE_HIERARCHY, type GsfMember } from "@/lib/discord"

export const revalidate = 60

const ROLE_BADGE: Record<string, string> = {
  Kingpin:      "text-yellow-400 border-yellow-400/40 bg-yellow-400/5",
  Underboss:    "text-orange-400 border-orange-400/40 bg-orange-400/5",
  "Shot Caller":"text-red-400   border-red-400/40    bg-red-400/5",
  Lieutenant:   "text-purple-400 border-purple-400/40 bg-purple-400/5",
  Enforcer:     "text-blue-400  border-blue-400/40   bg-blue-400/5",
  Shooter:      "text-green-400 border-green-400/40  bg-green-400/5",
  Hustler:      "text-green-300 border-green-300/40  bg-green-300/5",
  "Corner Boy": "text-emerald-400 border-emerald-400/40 bg-emerald-400/5",
  Runner:       "text-teal-400  border-teal-400/40   bg-teal-400/5",
  Hangaround:   "text-gray-400  border-gray-400/40   bg-gray-400/5",
}

export default async function LedenPage() {
  let grouped: Record<string, GsfMember[]> = {}
  let error: string | null = null

  try {
    grouped = await fetchGroupedMembers()
  } catch (e) {
    error = e instanceof Error ? e.message : "Onbekende fout"
  }

  const activeRoles = ROLE_HIERARCHY.filter((r) => grouped[r]?.length > 0)

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-12 bg-green-500" />
          <h1 className="text-4xl font-black text-white">
            Leden <span className="text-green-400">Lijst</span>
          </h1>
        </div>
        <p className="text-gray-500 text-sm mb-12 ml-[60px]">
          Alle actieve leden van Grove Street Families, gegroepeerd op rang.
        </p>

        {error ? (
          <div className="gsf-card border-red-500/30">
            <p className="font-bold text-red-400 mb-1">Fout bij ophalen van leden</p>
            <p className="text-sm text-red-400/60">{error}</p>
          </div>
        ) : activeRoles.length === 0 ? (
          <p className="text-gray-500 text-center py-20">
            Geen leden gevonden met een GSF rang. Controleer je bot token en guild ID.
          </p>
        ) : (
          <div className="space-y-14">
            {activeRoles.map((role) => (
              <section key={role}>
                {/* Role header */}
                <div className="flex items-center gap-4 mb-6">
                  <span
                    className={`text-sm font-black tracking-widest uppercase px-4 py-1.5 rounded-md border ${ROLE_BADGE[role]}`}
                  >
                    {role}
                  </span>
                  <span className="text-gray-600 text-xs">
                    {grouped[role].length} lid{grouped[role].length !== 1 ? "en" : ""}
                  </span>
                  <div className="flex-1 border-t border-green-500/5" />
                </div>

                {/* Member grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {grouped[role].map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function MemberCard({ member }: { member: GsfMember }) {
  return (
    <div className="gsf-card flex flex-col items-center text-center gap-3 p-4 hover:border-green-500/30 transition-colors group cursor-default">
      <Image
        src={member.avatarUrl}
        alt={member.displayName}
        width={56}
        height={56}
        className="rounded-full ring-2 ring-green-500/20 group-hover:ring-green-500/50 transition-all"
        unoptimized
      />
      <div className="w-full">
        <p className="text-white font-semibold text-sm leading-tight truncate">
          {member.displayName}
        </p>
        <p className="text-gray-600 text-xs mt-0.5 truncate">@{member.username}</p>
      </div>
    </div>
  )
}
