import { NextRequest, NextResponse } from "next/server"
import { upsertMember } from "@/lib/queries"
import { env } from "@/env"

// Called by the Discord bot to sync a member into the database
// POST /api/sync  { secret, members: [{ discord_id, username, nickname, avatar_url, gang_rank }] }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 })

  if (body.secret !== env.API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const members: Array<{
    discord_id: string
    username: string
    nickname?: string | null
    avatar_url?: string | null
    gang_rank?: string
  }> = body.members ?? []

  if (!Array.isArray(members) || members.length === 0) {
    return NextResponse.json({ error: "No members provided" }, { status: 400 })
  }

  for (const m of members) {
    if (!m.discord_id || !m.username) continue
    await upsertMember(m)
  }

  return NextResponse.json({ ok: true, synced: members.length })
}
