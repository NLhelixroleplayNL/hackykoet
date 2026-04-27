import { NextResponse } from "next/server"
import { getGangStats } from "@/lib/queries"

export const revalidate = 30

export async function GET() {
  const stats = await getGangStats()
  return NextResponse.json(stats)
}
