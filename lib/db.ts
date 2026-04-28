import mysql from "mysql2/promise"
import { env } from "@/env"

const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
})

export default pool

export interface Transcript {
  id: string
  channel_name: string
  html: string
  opener_id: string | null
  closed_by: string | null
  duration_minutes: number | null
  category: string | null
  created_at: Date
}

export async function getTranscript(id: string): Promise<Transcript | null> {
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    "SELECT id, channel_name, html, opener_id, closed_by, duration_minutes, category, created_at FROM transcripts WHERE id = ? LIMIT 1",
    [id]
  )
  return (rows[0] as Transcript) ?? null
}
