import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BukuForm } from "./buku-form"

export const metadata: Metadata = { title: "Tambah Buku" }

export default async function TambahBukuPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profil } = await supabase
    .from("profiles")
    .select("peran")
    .eq("id", user.id)
    .single()

  if (!profil || !["admin", "staf"].includes(profil.peran)) {
    redirect("/buku")
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/buku"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        Kembali ke katalog
      </Link>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Tambah Buku Baru</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Isi informasi buku yang akan ditambahkan ke koleksi
        </p>
      </div>

      <BukuForm />
    </div>
  )
}
