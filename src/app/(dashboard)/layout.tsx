import { createClient } from "@/lib/supabase/server"
import { AuthProvider } from "@/providers/auth-provider"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { MobileNav } from "@/components/layout/mobile-nav"
import type { Profil } from "@/types"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Fetch profil server-side — client tidak perlu fetch lagi saat hydration
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let initialProfile: Profil | null = null
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
    initialProfile = data ?? null
  }

  return (
    <AuthProvider initialProfile={initialProfile}>
      <div className="flex h-dvh overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar />

          <main className="flex-1 overflow-y-auto">
            <div className="p-6 pb-24 md:pb-6">
              {children}
            </div>
          </main>
        </div>

        <MobileNav />
      </div>
    </AuthProvider>
  )
}
