import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import MemberSidebar from "@/components/MemberSidebar"

export const metadata = { title: "Portaal — Grove Street Families" }

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/")

  return (
    <div className="flex min-h-screen">
      <MemberSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
