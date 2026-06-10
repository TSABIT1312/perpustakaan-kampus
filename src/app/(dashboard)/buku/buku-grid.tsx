import { getBuku } from "@/actions/buku"
import { BukuCard } from "@/components/buku/buku-card"
import { BookOpen } from "lucide-react"
import { BukuGridClient } from "./buku-grid-client"

interface BukuGridProps {
  params: Record<string, string>
  isAdmin?: boolean
}

export async function BukuGrid({ params, isAdmin }: BukuGridProps) {
  const result = await getBuku({
    q: params.q,
    genre: params.genre,
    tersedia: params.tersedia === "1",
    bahasa: params.bahasa,
    tahun: params.tahun ? Number(params.tahun) : undefined,
    page: params.page ? Number(params.page) : 1,
  })

  if (result.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-14 w-14 rounded-full bg-[var(--bg-surface)] flex items-center justify-center mb-4">
          <BookOpen size={24} className="text-[var(--text-tertiary)]" />
        </div>
        <p className="text-sm font-medium text-[var(--text-primary)]">Buku tidak ditemukan</p>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">
          Coba gunakan kata kunci atau filter yang berbeda
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs text-[var(--text-tertiary)] mb-4">
        Menampilkan {result.data.length} dari {result.total} buku
      </p>
      <BukuGridClient buku={result.data} isAdmin={isAdmin} />
    </div>
  )
}
