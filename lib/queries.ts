import pool from "./db"
import { RowDataPacket, ResultSetHeader } from "mysql2"

export const RANK_HIERARCHY = [
  "Kingpin",
  "Underboss",
  "Shot Caller",
  "Lieutenant",
  "Enforcer",
  "Shooter",
  "Hustler",
  "Corner Boy",
  "Runner",
  "Hangaround",
] as const

export type Rank = (typeof RANK_HIERARCHY)[number]

export interface Member extends RowDataPacket {
  id: number
  discord_id: string
  username: string
  nickname: string | null
  avatar_url: string | null
  gang_rank: string
  status: "active" | "inactive" | "banned"
  joined_at: Date
  updated_at: Date
}

export interface ClockSession extends RowDataPacket {
  id: number
  member_id: string
  start_time: Date
  end_time: Date | null
  duration_minutes: number | null
}

export interface Transaction extends RowDataPacket {
  id: number
  member_id: string | null
  type: string
  amount: number
  reason: string | null
  created_by: string | null
  created_at: Date
}

export interface Activity extends RowDataPacket {
  id: number
  name: string
  type: string | null
  date: Date
  description: string | null
  created_by: string | null
  created_at: Date
  participant_count?: number
}

export interface Note extends RowDataPacket {
  id: number
  member_id: string
  written_by: string
  content: string
  created_at: Date
}

export interface Warning extends RowDataPacket {
  id: number
  member_id: string
  issued_by: string
  reason: string
  created_at: Date
}

// ── Members ──────────────────────────────────────────────────────────────────

function cleanRank(raw: string): string {
  return raw.replace(/^[・\-\s]+/, "").trim()
}

export async function getAllMembers() {
  const [rows] = await pool.query<Member[]>(
    "SELECT * FROM members WHERE status = 'active' ORDER BY username ASC"
  )
  return rows.map(m => ({ ...m, gang_rank: cleanRank(m.gang_rank) }))
}

export async function getMembersByRank() {
  const [rows] = await pool.query<Member[]>(
    "SELECT * FROM members WHERE status = 'active' ORDER BY username ASC"
  )
  const grouped: Record<string, Member[]> = {}
  for (const rank of RANK_HIERARCHY) grouped[rank] = []
  for (const member of rows) {
    const rank = cleanRank(member.gang_rank)
    if (grouped[rank]) grouped[rank].push({ ...member, gang_rank: rank })
  }
  return grouped
}

export async function getMemberByDiscordId(discordId: string) {
  const [rows] = await pool.query<Member[]>(
    "SELECT * FROM members WHERE discord_id = ?",
    [discordId]
  )
  if (!rows[0]) return null
  return { ...rows[0], gang_rank: cleanRank(rows[0].gang_rank) }
}

export async function upsertMember(data: {
  discord_id: string
  username: string
  nickname?: string | null
  avatar_url?: string | null
  gang_rank?: string
}) {
  await pool.query<ResultSetHeader>(
    `INSERT INTO members (discord_id, username, nickname, avatar_url, gang_rank)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       username = VALUES(username),
       nickname = VALUES(nickname),
       avatar_url = VALUES(avatar_url),
       updated_at = NOW()`,
    [data.discord_id, data.username, data.nickname ?? null, data.avatar_url ?? null, data.gang_rank ?? "Hangaround"]
  )
}

export async function getInactiveMembers() {
  const [rows] = await pool.query<Member[]>(
    "SELECT * FROM members WHERE status != 'active' ORDER BY updated_at DESC"
  )
  return rows.map(m => ({ ...m, gang_rank: cleanRank(m.gang_rank) }))
}

export async function getMemberCount() {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM members WHERE status = 'active'"
  )
  return (rows[0] as RowDataPacket).count as number
}

// ── Clock ─────────────────────────────────────────────────────────────────────

export async function getTotalHoursByMember() {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT m.discord_id, m.username, m.nickname, m.avatar_url, m.gang_rank,
            COALESCE(SUM(cs.duration_minutes), 0) as total_minutes
     FROM members m
     LEFT JOIN clock_sessions cs ON m.discord_id = cs.member_id
     WHERE m.status = 'active'
     GROUP BY m.discord_id
     ORDER BY total_minutes DESC
     LIMIT 10`
  )
  return rows
}

export async function getMemberHours(discordId: string) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT COALESCE(SUM(duration_minutes), 0) as total_minutes,
            COUNT(*) as session_count
     FROM clock_sessions
     WHERE member_id = ?`,
    [discordId]
  )
  return rows[0]
}

// ── Treasury ──────────────────────────────────────────────────────────────────

export async function getTreasuryBalance() {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT balance FROM treasury WHERE id = 1"
  )
  return (rows[0]?.balance as number) ?? 0
}

export async function getRecentTransactions(limit = 10) {
  const [rows] = await pool.query<Transaction[]>(
    `SELECT t.*, m.username, m.nickname
     FROM transactions t
     LEFT JOIN members m ON t.member_id = m.discord_id
     ORDER BY t.created_at DESC
     LIMIT ?`,
    [limit]
  )
  return rows
}

// ── Activities ────────────────────────────────────────────────────────────────

export async function getRecentActivities(limit = 10) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT a.*, COUNT(ap.member_id) as participant_count
     FROM activities a
     LEFT JOIN activity_participants ap ON a.id = ap.activity_id
     GROUP BY a.id
     ORDER BY a.date DESC
     LIMIT ?`,
    [limit]
  )
  return rows
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export async function getGangStats() {
  const [[memberCount], [treasury], [clockStats], [activityCount], [warnCount]] =
    await Promise.all([
      pool.query<RowDataPacket[]>("SELECT COUNT(*) as count FROM members WHERE status = 'active'"),
      pool.query<RowDataPacket[]>("SELECT balance FROM treasury WHERE id = 1"),
      pool.query<RowDataPacket[]>(
        "SELECT COALESCE(SUM(duration_minutes), 0) as total_minutes FROM clock_sessions WHERE end_time IS NOT NULL"
      ),
      pool.query<RowDataPacket[]>("SELECT COUNT(*) as count FROM activities"),
      pool.query<RowDataPacket[]>("SELECT COUNT(*) as count FROM warnings"),
    ])

  return {
    memberCount: memberCount[0].count as number,
    treasuryBalance: treasury[0]?.balance ?? 0,
    totalClockHours: Math.floor(((clockStats[0].total_minutes as number) ?? 0) / 60),
    activityCount: activityCount[0].count as number,
    warningCount: warnCount[0].count as number,
  }
}

// ── Notes ─────────────────────────────────────────────────────────────────────

export async function getMemberNotes(discordId: string) {
  const [rows] = await pool.query<Note[]>(
    "SELECT * FROM notes WHERE member_id = ? ORDER BY created_at DESC",
    [discordId]
  )
  return rows
}

// ── Warnings ──────────────────────────────────────────────────────────────────

export async function getMemberWarnings(discordId: string) {
  const [rows] = await pool.query<Warning[]>(
    "SELECT * FROM warnings WHERE member_id = ? ORDER BY created_at DESC",
    [discordId]
  )
  return rows
}

// ── Rank history ──────────────────────────────────────────────────────────────

export async function getMemberRankHistory(discordId: string) {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM rank_history WHERE member_id = ? ORDER BY changed_at DESC LIMIT 20",
    [discordId]
  )
  return rows
}

// ── Leaderboard ───────────────────────────────────────────────────────────────

export async function getLeaderboard(limit = 10) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT m.discord_id, m.username, m.nickname, m.avatar_url, m.gang_rank, m.joined_at,
            COALESCE(SUM(cs.duration_minutes), 0) as total_minutes,
            COUNT(cs.id) as session_count
     FROM members m
     LEFT JOIN clock_sessions cs ON m.discord_id = cs.member_id AND cs.end_time IS NOT NULL
     WHERE m.status = 'active'
     GROUP BY m.discord_id
     ORDER BY total_minutes DESC
     LIMIT ?`,
    [limit]
  )
  return rows.map(r => ({ ...r, gang_rank: cleanRank(r.gang_rank as string) }))
}

// ── Full member profile ───────────────────────────────────────────────────────

export async function getMemberProfile(discordId: string) {
  const [[memberRows], [hoursRows], rankHistory, recentSessions, warnings, activities] = await Promise.all([
    pool.query<Member[]>("SELECT * FROM members WHERE discord_id = ?", [discordId]),
    pool.query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(duration_minutes), 0) as total_minutes,
              COUNT(*) as session_count
       FROM clock_sessions WHERE member_id = ? AND end_time IS NOT NULL`,
      [discordId]
    ),
    pool.query<RowDataPacket[]>(
      "SELECT * FROM rank_history WHERE member_id = ? ORDER BY changed_at DESC LIMIT 10",
      [discordId]
    ),
    pool.query<RowDataPacket[]>(
      `SELECT start_time, end_time, duration_minutes
       FROM clock_sessions WHERE member_id = ? AND end_time IS NOT NULL
       ORDER BY start_time DESC LIMIT 5`,
      [discordId]
    ),
    pool.query<Warning[]>(
      "SELECT * FROM warnings WHERE member_id = ? ORDER BY created_at DESC",
      [discordId]
    ),
    pool.query<RowDataPacket[]>(
      `SELECT a.name, a.type, a.date
       FROM activities a
       INNER JOIN activity_participants ap ON a.id = ap.activity_id
       WHERE ap.member_id = ?
       ORDER BY a.date DESC LIMIT 10`,
      [discordId]
    ),
  ])

  const member = memberRows[0]
  if (!member) return null

  return {
    ...member,
    gang_rank: cleanRank(member.gang_rank),
    total_minutes: Number((hoursRows[0] as RowDataPacket).total_minutes ?? 0),
    session_count: Number((hoursRows[0] as RowDataPacket).session_count ?? 0),
    rank_history: (rankHistory[0] as RowDataPacket[]),
    recent_sessions: (recentSessions[0] as RowDataPacket[]),
    warnings: (warnings[0] as Warning[]),
    activities: (activities[0] as RowDataPacket[]),
  }
}

// ── Gangpot items ─────────────────────────────────────────────────────────────

export async function getGangpotItems() {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM gangpot_items WHERE amount > 0 ORDER BY item_name ASC"
  )
  return rows
}
