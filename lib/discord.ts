import { env } from "@/env"

export const ROLE_HIERARCHY = [
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

export interface GsfMember {
  id: string
  username: string
  displayName: string
  avatarUrl: string
  role: string
}

export type GroupedMembers = Record<string, GsfMember[]>

function getDefaultAvatarUrl(userId: string, discriminator: string): string {
  const index =
    discriminator === "0"
      ? Number(BigInt(userId) >> 22n) % 6
      : parseInt(discriminator) % 5
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`
}

export async function fetchGroupedMembers(): Promise<GroupedMembers> {
  const token = env.DISCORD_BOT_TOKEN
  const guildId = env.DISCORD_GUILD_ID

  const headers = { Authorization: `Bot ${token}` }

  const [rolesRes, membersRes] = await Promise.all([
    fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
      headers,
      next: { revalidate: 60 },
    }),
    fetch(`https://discord.com/api/v10/guilds/${guildId}/members?limit=1000`, {
      headers,
      next: { revalidate: 60 },
    }),
  ])

  if (!rolesRes.ok) {
    throw new Error(`Discord roles API fout: ${rolesRes.status} ${rolesRes.statusText}`)
  }
  if (!membersRes.ok) {
    throw new Error(`Discord members API fout: ${membersRes.status} ${membersRes.statusText}`)
  }

  const roles: Array<{ id: string; name: string }> = await rolesRes.json()
  const rawMembers: Array<{
    user: {
      id: string
      username: string
      global_name: string | null
      avatar: string | null
      discriminator: string
      bot?: boolean
    }
    nick: string | null
    roles: string[]
    avatar: string | null
  }> = await membersRes.json()

  const roleMap = new Map(roles.map((r) => [r.id, r.name]))

  const grouped: GroupedMembers = Object.fromEntries(ROLE_HIERARCHY.map((r) => [r, []]))

  for (const member of rawMembers) {
    if (member.user.bot) continue

    const memberRoleNames = member.roles
      .map((id) => roleMap.get(id))
      .filter(Boolean) as string[]

    const assignedRole = ROLE_HIERARCHY.find((r) => memberRoleNames.includes(r))
    if (!assignedRole) continue

    let avatarUrl: string
    if (member.avatar) {
      const ext = member.avatar.startsWith("a_") ? "gif" : "png"
      avatarUrl = `https://cdn.discordapp.com/guilds/${guildId}/users/${member.user.id}/avatars/${member.avatar}.${ext}`
    } else if (member.user.avatar) {
      const ext = member.user.avatar.startsWith("a_") ? "gif" : "png"
      avatarUrl = `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.${ext}`
    } else {
      avatarUrl = getDefaultAvatarUrl(member.user.id, member.user.discriminator)
    }

    grouped[assignedRole].push({
      id: member.user.id,
      username: member.user.username,
      displayName: member.nick ?? member.user.global_name ?? member.user.username,
      avatarUrl,
      role: assignedRole,
    })
  }

  return Object.fromEntries(Object.entries(grouped).filter(([, m]) => m.length > 0))
}

export async function fetchAvatarMap(): Promise<Map<string, string>> {
  const token = env.DISCORD_BOT_TOKEN
  const guildId = env.DISCORD_GUILD_ID
  const headers = { Authorization: `Bot ${token}` }

  const res = await fetch(
    `https://discord.com/api/v10/guilds/${guildId}/members?limit=1000`,
    { headers, next: { revalidate: 60 } },
  )
  if (!res.ok) {
    console.error(`fetchAvatarMap failed: ${res.status} ${res.statusText}`, await res.text().catch(() => ""))
    return new Map()
  }

  const members: Array<{
    user: { id: string; avatar: string | null; discriminator: string }
    avatar: string | null
  }> = await res.json()

  const map = new Map<string, string>()
  for (const m of members) {
    let url: string
    if (m.avatar) {
      const ext = m.avatar.startsWith("a_") ? "gif" : "png"
      url = `https://cdn.discordapp.com/guilds/${guildId}/users/${m.user.id}/avatars/${m.avatar}.${ext}`
    } else if (m.user.avatar) {
      const ext = m.user.avatar.startsWith("a_") ? "gif" : "png"
      url = `https://cdn.discordapp.com/avatars/${m.user.id}/${m.user.avatar}.${ext}`
    } else {
      const index = m.user.discriminator === "0"
        ? Number(BigInt(m.user.id) >> 22n) % 6
        : parseInt(m.user.discriminator) % 5
      url = `https://cdn.discordapp.com/embed/avatars/${index}.png`
    }
    map.set(m.user.id, url)
  }
  return map
}
