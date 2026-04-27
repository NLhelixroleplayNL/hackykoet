import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { logApplication } from "@/lib/iplog"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 })
  }

  const body = await req.json() as {
    rpName?: string
    leeftijd?: string
    motivatie?: string
    ervaring?: string
    uren?: string
  }

  const { rpName, leeftijd, motivatie, ervaring, uren } = body

  if (!rpName?.trim() || !leeftijd?.trim() || !motivatie?.trim() || !ervaring?.trim() || !uren?.trim()) {
    return NextResponse.json({ error: "Velden ontbreken" }, { status: 400 })
  }

  const { discordId, username, email, avatar } = session.user

  await logApplication({
    discordId,
    username,
    email,
    avatar,
    rpName: rpName.trim(),
    leeftijd: leeftijd.trim(),
    motivatie: motivatie.trim(),
    ervaring: ervaring.trim(),
    uren: uren.trim(),
  })

  return NextResponse.json({ ok: true })
}
