import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import AuthSessionProvider from "@/components/AuthSessionProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Grove Street Families",
  description: "Grove Street Families — de sterkste crew van Los Santos. Grove Street 4 Life.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white min-h-screen antialiased`}>
        {/*
          AuthSessionProvider wraps the tree so client components can call
          useSession(). Server components use getServerSession() directly.
        */}
        <AuthSessionProvider>
          <Navbar />
          <main>{children}</main>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
