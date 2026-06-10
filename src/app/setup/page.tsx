import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/admin"
import { BuatAdminForm } from "@/components/admin/buat-admin-form"
import { Library } from "lucide-react"

export const metadata: Metadata = { title: "Setup Awal" }

export default async function SetupPage() {
  // Redirect to dashboard if at least one admin already exists
  const admin = createAdminClient()
  const { data } = await admin.from("profiles").select("id").eq("peran", "admin").limit(1)
  if (data && data.length > 0) redirect("/dashboard")

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-subtle)] p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center h-12 w-12 rounded-[var(--radius-lg)] bg-[var(--brand)] text-white mb-4">
            <Library size={22} />
          </div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Setup Perpustakaan</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)] text-center">
            Buat akun administrator pertama untuk memulai.
          </p>
        </div>

        <div className="rounded-[var(--radius-xl)] border border-[var(--border-color)] bg-[var(--bg-base)] shadow-[var(--shadow-md)] p-6">
          <BuatAdminForm />
        </div>
      </div>
    </div>
  )
}
