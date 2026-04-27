import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { getTreasuryBalance, getRecentTransactions } from "@/lib/queries"

export async function GET() {
  const [balance, transactions] = await Promise.all([
    getTreasuryBalance(),
    getRecentTransactions(20),
  ])
  return NextResponse.json({ balance, transactions })
}

// Called by the bot to update treasury balance or log a transaction
// POST /api/treasury { secret, amount, type, reason, member_id? }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 })

  if (body.secret !== process.env.API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { amount, type, reason, member_id, created_by } = body

  await pool.query(
    "INSERT INTO transactions (member_id, type, amount, reason, created_by) VALUES (?, ?, ?, ?, ?)",
    [member_id ?? null, type ?? "other", amount, reason ?? null, created_by ?? null]
  )

  await pool.query(
    "UPDATE treasury SET balance = balance + ?, updated_at = NOW() WHERE id = 1",
    [amount]
  )

  return NextResponse.json({ ok: true })
}
