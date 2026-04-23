import { DefaultSession } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      /** Internal NextAuth user ID (same as token.sub) */
      id: string
      /** Discord snowflake ID */
      discordId: string
      /** Display name (global_name if set, otherwise username) */
      username: string
      /** Discriminator — "0" for migrated accounts */
      discriminator: string
      /** Fully resolved CDN avatar URL */
      avatar: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    discordId?: string
    username?: string
    discriminator?: string
    avatar?: string
  }
}
