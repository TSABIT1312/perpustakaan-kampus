import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getJumlahMahasiswaSipro } from "@/actions/sync-sipro"
import { SyncSiproPanel } from "@/components/admin/sync-sipro-panel"
import { BuatAdminForm } from "@/components/admin/buat-admin-form"
import { Card, CardTitle } from "@/components/ui/card"
import { Database, ShieldCheck } from "lucide-react"

export const metadata: Metadata = { title: "Sinkronisasi Sipro" }

export default async function SinkronisasiPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profil } = await supabase
    .from("profiles")
    .select("peran")
    .eq("id", user.id)
    .single()

  if (profil?.peran !== "admin") redirect("/dashboard")

  const jumlahSipro = await getJumlahMahasiswaSipro()

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Manajemen Admin</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Sinkronisasi data mahasiswa dari Sipro dan kelola akun administrator.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sinkronisasi Sipro */}
        <Card>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Database size={16} className="text-[var(--brand)]" />
              <CardTitle>Sinkronisasi Sipro</CardTitle>
            </div>
            <p className="text-xs text-[var(--text-tertiary)]">
              Impor data mahasiswa dari sistem Sipro secara otomatis
            </p>
          </div>
          <SyncSiproPanel jumlahSipro={jumlahSipro} />
        </Card>

        {/* Buat akun admin */}
        <Card>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={16} className="text-[var(--brand)]" />
              <CardTitle>Buat Akun Admin</CardTitle>
            </div>
            <p className="text-xs text-[var(--text-tertiary)]">
              Tambahkan administrator baru untuk sistem perpustakaan
            </p>
          </div>
          <BuatAdminForm />
        </Card>
      </div>
    </div>
  )
}
