import { NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

interface DiscordProfile {
  id: string
  username: string
  discriminator: string
  global_name?: string | null
  avatar?: string | null
  email?: string | null
}

function resolveAvatarUrl(profile: DiscordProfile): string {
  if (profile.avatar) {
    const ext = profile.avatar.startsWith("a_") ? "gif" : "png"
    return `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${ext}`
  }
  const index =
    profile.discriminator === "0"
      ? Number(parseInt(profile.id) % 6)
      : parseInt(profile.discriminator) % 5
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`
}

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
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
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const p = profile as DiscordProfile
        token.discordId = p.id
        token.username = p.global_name ?? p.username
        token.discriminator = p.discriminator
        token.avatar = resolveAvatarUrl(p)
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.discordId = token.discordId as string
        session.user.username = token.username as string
        session.user.discriminator = token.discriminator as string
        session.user.avatar = token.avatar as string
      }
      return session
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
}
