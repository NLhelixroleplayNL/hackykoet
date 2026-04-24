import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Image from "next/image"
import SignOutButton from "@/components/SignOutButton"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/")

  const { username, discriminator, discordId, avatar, email } = session.user
  const tag = discriminator === "0" ? username : `${username}#${discriminator}`

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back, {username}.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card flex flex-col items-center text-center gap-4">
          <Image src={avatar} alt={`${username}'s avatar`} width={96} height={96} className="rounded-full ring-4 ring-discord/40" priority />
          <div>
            <p className="font-bold text-lg">{username}</p>
            <p className="text-gray-500 text-sm">{tag}</p>
          </div>
          <div className="w-full border-t border-gray-700/50 pt-4 space-y-2 text-sm text-left">
            <div className="flex justify-between"><span className="text-gray-500">Discord ID</span><span className="font-mono text-xs text-gray-200">{discordId}</span></div>
            {email && <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="text-gray-200">{email}</span></div>}
          </div>
          <SignOutButton className="w-full mt-2 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm font-medium text-white transition-colors" />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="card text-center"><p className="text-gray-500 text-xs uppercase mb-1">Status</p><p className="font-semibold text-green-400">Authenticated</p></div>
            <div className="card text-center"><p className="text-gray-500 text-xs uppercase mb-1">Auth Method</p><p className="font-semibold text-discord">Discord OAuth2</p></div>
            <div className="card text-center"><p className="text-gray-500 text-xs uppercase mb-1">Session</p><p className="font-semibold text-blue-400">Active</p></div>
          </div>
        </div>
      </div>
    </div>
  )
}
