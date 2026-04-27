const BASE_URL = "https://vertex-api.thoo.nl/vertex-agent/public"

export interface VertexPlayer {
  license: string
  discordId: string
  name: string
  grade: number
  gradeLabel: string
}

interface VertexResponse<T> {
  ok: boolean
  data: T
}

async function fetchVertex<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) {
    throw new Error(`Vertex API error: ${res.status} ${res.statusText}`)
  }
  const json: VertexResponse<T> = await res.json()
  if (!json.ok) {
    throw new Error("Vertex API returned ok: false")
  }
  return json.data
}

export async function getPlayersWithJob(job: string): Promise<VertexPlayer[]> {
  return fetchVertex<VertexPlayer[]>(`/getPlayersWithJob?job=${encodeURIComponent(job)}`)
}
