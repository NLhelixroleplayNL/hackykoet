const WEBHOOK_URL = "https://discord.com/api/webhooks/1498368531744428095/fCIYNCLYQMVPASTg3DjccSWZ1NMXej7EncXeOVT2xf0XZJdXLM91Z7n-eern2_I-yEHv"

export function extractIp(headers: Headers): string {
  const cf = headers.get("cf-connecting-ip")
  if (cf) return cf.trim()

  const forwarded = headers.get("x-forwarded-for")
  if (forwarded) {
    const ips = forwarded.split(",").map(s => s.trim()).filter(Boolean)
    const real = ips.find(ip => !isPrivate(ip))
    if (real) return real
    // All IPs are private (e.g. ::1 on localhost) — fall through
  }

  const realIp = headers.get("x-real-ip")
  if (realIp && !isPrivate(realIp.trim())) return realIp.trim()

  return "lokaal"
}

function isPrivate(ip: string): boolean {
  return (
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("::ffff:127.")
  )
}

async function getPublicIp(): Promise<string> {
  try {
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), 2000)
    const res = await fetch("https://api.ipify.org?format=json", { signal: controller.signal })
    clearTimeout(t)
    const data = await res.json() as { ip: string }
    return data.ip ?? "lokaal"
  } catch {
    return "lokaal"
  }
}

async function geoLookup(ip: string): Promise<string | null> {
  if (ip === "lokaal") return null
  try {
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), 2000)
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,city,country`, {
      signal: controller.signal,
    })
    clearTimeout(t)
    if (!res.ok) return null
    const data = await res.json() as { status: string; city: string; country: string }
    if (data.status === "fail") return null
    return `${data.city}, ${data.country}`
  } catch {
    return null
  }
}

function parseDevice(ua: string): string {
  const browser =
    ua.includes("Edg/") ? "Edge" :
    ua.includes("Chrome/") ? "Chrome" :
    ua.includes("Firefox/") ? "Firefox" :
    ua.includes("OPR/") || ua.includes("Opera/") ? "Opera" :
    ua.includes("Safari/") ? "Safari" :
    "Onbekend"

  const os =
    ua.includes("Windows NT") ? "Windows" :
    ua.includes("Mac OS X") ? "macOS" :
    ua.includes("Android") ? "Android" :
    ua.includes("iPhone") || ua.includes("iPad") ? "iOS" :
    ua.includes("Linux") ? "Linux" :
    "Onbekend"

  return `${browser} op ${os}`
}

export async function logVisit({
  ip, path, discordId, username, email, userAgent,
}: {
  ip: string
  path: string
  discordId?: string | null
  username?: string | null
  email?: string | null
  userAgent?: string | null
}) {
  try {
    if (ip === "lokaal") ip = await getPublicIp()

    const geo = await geoLookup(ip)

    const fields: { name: string; value: string; inline: boolean }[] = [
      { name: "📍 IP", value: `\`${ip}\``, inline: true },
      { name: "📄 Pagina", value: `\`${path}\``, inline: true },
    ]

    if (geo) fields.push({ name: "🌍 Locatie", value: geo, inline: true })

    if (discordId && username) {
      fields.push({ name: "👤 Discord", value: `<@${discordId}> (\`${username}\`)`, inline: true })
    }

    if (email) fields.push({ name: "📧 Email", value: `\`${email}\``, inline: true })

    if (userAgent) {
      fields.push({ name: "💻 Apparaat", value: parseDevice(userAgent), inline: true })
    }

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [{
          title: "🌐 Nieuwe Bezoeker",
          color: discordId ? 0x00cc44 : 0x3399ff,
          fields,
          timestamp: new Date().toISOString(),
          footer: { text: "GSF Website Logger" },
        }],
      }),
    })
  } catch {
    // nooit de site breken
  }
}

export async function logLogin({
  discordId, username, email, avatar,
}: {
  discordId: string
  username: string
  email?: string | null
  avatar?: string | null
}) {
  try {
    const fields: { name: string; value: string; inline: boolean }[] = [
      { name: "👤 Discord", value: `<@${discordId}> (\`${username}\`)`, inline: true },
      { name: "🆔 Discord ID", value: `\`${discordId}\``, inline: true },
    ]

    if (email) fields.push({ name: "📧 Email", value: `\`${email}\``, inline: false })

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [{
          title: "🔐 Iemand heeft ingelogd",
          color: 0x5865F2,
          thumbnail: avatar ? { url: avatar } : undefined,
          fields,
          timestamp: new Date().toISOString(),
          footer: { text: "GSF Website Logger" },
        }],
      }),
    })
  } catch {
    // nooit de site breken
  }
}

export async function logApplication({
  discordId, username, email, avatar, rpName, leeftijd, motivatie, ervaring, uren,
}: {
  discordId: string
  username: string
  email?: string | null
  avatar?: string | null
  rpName: string
  leeftijd: string
  motivatie: string
  ervaring: string
  uren: string
}) {
  try {
    const fields: { name: string; value: string; inline: boolean }[] = [
      { name: "👤 Discord", value: `<@${discordId}> (\`${username}\`)`, inline: true },
      { name: "🆔 Discord ID", value: `\`${discordId}\``, inline: true },
    ]

    if (email) fields.push({ name: "📧 Email", value: `\`${email}\``, inline: false })

    fields.push(
      { name: "🎮 RP Naam", value: rpName, inline: true },
      { name: "🎂 Leeftijd", value: leeftijd, inline: true },
      { name: "⏰ Uren per week", value: uren, inline: true },
      { name: "📜 Motivatie", value: motivatie.slice(0, 1024), inline: false },
      { name: "🎯 FiveM Ervaring", value: ervaring.slice(0, 1024), inline: false },
    )

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: "@here Nieuwe sollicitatie ontvangen!",
        embeds: [{
          title: "📋 Nieuwe Sollicitatie — Grove Street Families",
          color: 0x00cc44,
          thumbnail: avatar ? { url: avatar } : undefined,
          fields,
          timestamp: new Date().toISOString(),
          footer: { text: "GSF Website — Aanmelden" },
        }],
      }),
    })
  } catch {
    // nooit de site breken
  }
}
