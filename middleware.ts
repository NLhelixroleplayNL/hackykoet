import { withAuth } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"
import { NextResponse, type NextRequest } from "next/server"
import { logVisit, extractIp } from "@/lib/iplog"
import { isWhitelisted } from "@/lib/whitelist"

const SKIP_PREFIXES = ["/api/", "/_next/", "/_vercel/"]
const SKIP_EXT = [".png", ".ico", ".jpg", ".svg", ".css", ".js", ".webp", ".gif", ".woff", ".woff2"]

async function handleMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (
    SKIP_PREFIXES.some(p => pathname.startsWith(p)) ||
    SKIP_EXT.some(e => pathname.endsWith(e))
  ) {
    return NextResponse.next()
  }

  const ip = extractIp(req.headers)
  const userAgent = req.headers.get("user-agent") ?? undefined
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const discordId = (token?.discordId as string) ?? null
  const username = (token?.username as string) ?? null
  const email = (token?.email as string) ?? null

  if (!isWhitelisted(discordId)) {
    logVisit({ ip, path: pathname, discordId, username, email, userAgent })
  }

  return NextResponse.next()
}

export default withAuth(handleMiddleware, {
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname
      if (path.startsWith("/dashboard") || path.startsWith("/member")) return !!token
      return true
    },
  },
  pages: { signIn: "/" },
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
