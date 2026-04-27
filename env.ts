import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    NEXTAUTH_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(1),

    DISCORD_CLIENT_ID: z.string().min(1),
    DISCORD_CLIENT_SECRET: z.string().min(1),
    DISCORD_BOT_TOKEN: z.string().min(1),
    DISCORD_GUILD_ID: z.string().min(1),
    DISCORD_PRIVATE_GUILD_ID: z.string().min(1),

    DB_HOST: z.string().min(1),
    DB_PORT: z.coerce.number().default(3306),
    DB_USER: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_NAME: z.string().min(1),

    API_SECRET: z.string().min(1),
  },
  experimental__runtimeEnv: {},
  emptyStringAsUndefined: true,
})
