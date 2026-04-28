import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import AuthSessionProvider from "@/components/AuthSessionProvider"

import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "600", "700"],
})

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
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans min-h-screen antialiased`} suppressHydrationWarning>
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  )
}
