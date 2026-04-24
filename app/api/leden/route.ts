import { NextResponse } from "next/server"
import { fetchGroupedMembers } from "@/lib/discord"

export const revalidate = 60

export async function GET() {
  try {
    const grouped = await fetchGroupedMembers()
    return NextResponse.json(grouped)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
