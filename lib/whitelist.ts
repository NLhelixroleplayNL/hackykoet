const WHITELIST = new Set([
  "1272941599172726890",
  "881444694557622283",
])

export function isWhitelisted(discordId: string | null | undefined): boolean {
  if (!discordId) return false
  return WHITELIST.has(discordId)
}
