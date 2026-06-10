import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Library } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 text-center">
      <div className="h-12 w-12 rounded-[var(--radius-lg)] bg-[var(--brand-subtle)] flex items-center justify-center mb-4">
        <Library size={22} className="text-[var(--brand)]" />
      </div>
      <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">404</h1>
      <p className="text-base text-[var(--text-secondary)] mb-6">
        Halaman yang kamu cari tidak ditemukan.
      </p>
      <Button asChild>
        <Link href="/dashboard">Kembali ke Dashboard</Link>
      </Button>
    </div>
  )
}
