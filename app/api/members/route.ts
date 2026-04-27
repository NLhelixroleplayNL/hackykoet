import { NextResponse } from "next/server"
import { getAllMembers } from "@/lib/queries"

export const revalidate = 60

export async function GET() {
  const members = await getAllMembers()
  return NextResponse.json(members)
}
