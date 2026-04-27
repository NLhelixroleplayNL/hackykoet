import { withAuth } from "next-auth/middleware"
import { NextResponse, type NextRequest } from "next/server"

async function handleMiddleware(_req: NextRequest) {
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
