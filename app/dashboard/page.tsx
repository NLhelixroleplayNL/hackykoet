import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Image from "next/image"
import SignOutButton from "@/components/SignOutButton"

export const metadata = {
  title: "Dashboard — Discord Auth App",
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  // Middleware already blocks unauthenticated requests, but this is a
  // server-side safety net in case someone bypasses the edge middleware.
  if (!session) redirect("/")

  const { username, discriminator, discordId, avatar, email } = session.user
  const tag = discriminator === "0" ? username : `${username}#${discriminator}`

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-fade-in">
      {/* ── Page header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back, {username}.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Profile card ── */}
        <div className="card flex flex-col items-center text-center gap-4">
          <div className="relative">
            <Image
              src={avatar}
              alt={`${username}'s Discord avatar`}
              width={96}
              height={96}
              className="rounded-full ring-4 ring-discord/40"
              priority
            />
            {/* Online indicator */}
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full ring-2 ring-gray-800" />
          </div>

          <div>
            <p className="font-bold text-lg">{username}</p>
            <p className="text-gray-500 text-sm">{tag}</p>
          </div>

          <div className="w-full border-t border-gray-700/50 pt-4 space-y-2 text-sm text-left">
            <InfoRow label="Discord ID" value={discordId} mono />
            {email && <InfoRow label="Email" value={email} />}
          </div>

          <SignOutButton className="w-full mt-2 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm font-medium text-white transition-colors" />
        </div>

        {/* ── Stats / info ── */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Status" value="Authenticated" color="text-green-400" />
            <StatCard label="Auth Method" value="Discord OAuth2" color="text-discord" />
            <StatCard label="Session" value="Active" color="text-blue-400" />
          </div>

          {/* Placeholder content area */}
          <div className="card flex-1">
            <h2 className="font-semibold mb-4">Getting Started</h2>
            <ul className="space-y-3 text-sm text-gray-400">
              <CheckItem text="Discord OAuth2 login working" done />
              <CheckItem text="Protected route via middleware" done />
              <CheckItem text="User profile stored in JWT session" done />
              <CheckItem text="Avatar served from Discord CDN" done />
              <CheckItem text="Add your custom features below" />
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Small sub-components ────────────────────────────────────────────────────

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-gray-500">{label}</span>
      <span className={`text-gray-200 truncate max-w-[160px] ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </span>
    </div>
  )
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: string
}) {
  return (
    <div className="card text-center">
      <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">{label}</p>
      <p className={`font-semibold ${color}`}>{value}</p>
    </div>
  )
}

function CheckItem({ text, done = false }: { text: string; done?: boolean }) {
  return (
    <li className="flex items-center gap-3">
      <span
        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
          done ? "bg-green-500/20 text-green-400" : "bg-gray-700 text-gray-600"
        }`}
      >
        {done ? (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="1" strokeWidth={3} />
          </svg>
        )}
      </span>
      <span className={done ? "text-gray-300" : "text-gray-500"}>{text}</span>
    </li>
  )
}
