import { NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import { env } from "@/env"
// Shape of the raw profile returned by Discord's API
interface DiscordProfile {
  id: string
  username: string
  discriminator: string
  global_name?: string | null
  avatar?: string | null
  email?: string | null
  verified?: boolean
  locale?: string
  flags?: number
  premium_type?: number
  public_flags?: number
}

function resolveAvatarUrl(profile: DiscordProfile): string {
  if (profile.avatar) {
    const ext = profile.avatar.startsWith("a_") ? "gif" : "png"
    return `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${ext}`
  }
  // Discord's new username system uses discriminator "0"; fall back to default avatars
  const index =
    profile.discriminator === "0"
      ? Number(BigInt(profile.id) >> 22n) % 6
      : parseInt(profile.discriminator) % 5
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`
}

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "identify email",
        },
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  cookies: {
    state: {
      name: "next-auth.state",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" },
    },
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" },
    },
  },

  callbacks: {
    // Enrich the JWT with Discord-specific fields on first sign-in
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const p = profile as DiscordProfile
        token.discordId = p.id
        token.username = p.global_name ?? p.username
        token.discriminator = p.discriminator
        token.avatar = resolveAvatarUrl(p)
        token.email = p.email ?? null
      }
      return token
    },

    // Expose the enriched JWT fields on the session object
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.discordId = token.discordId as string
        session.user.username = token.username as string
        session.user.discriminator = token.discriminator as string
        session.user.avatar = token.avatar as string
        session.user.email = (token.email as string) ?? null
      }
      return session
    },
  },

  pages: {
    signIn: "/",
    error: "/",
  },
}
