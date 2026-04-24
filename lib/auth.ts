```ts
import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

function getDefaultAvatar(profile: any) {
  const index =
    profile.discriminator === "0"
      ? Math.floor(parseInt(profile.id) / 4194304) % 6
      : parseInt(profile.discriminator) % 5

  return `https://cdn.discordapp.com/embed/avatars/${index}.png`
}

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.global_name ?? profile.username,
          email: profile.email,
          image:
            profile.avatar
              ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
              : getDefaultAvatar(profile),
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.sub
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```
