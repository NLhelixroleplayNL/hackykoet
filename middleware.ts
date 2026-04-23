import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(_req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      // Return true to allow the request; false redirects to the signIn page
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/",
    },
  }
)

// Protect every route under /dashboard (and any other protected prefixes you add)
export const config = {
  matcher: ["/dashboard/:path*"],
}
