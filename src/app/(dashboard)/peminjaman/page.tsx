import type { Metadata } from "next"
import Link from "next/link"
import { History, BookMarked } from "lucide-react"
import { getPeminjaman } from "@/actions/peminjaman"
import { Button } from "@/components/ui/button"
import { PeminjamanList } from "./peminjaman-list"

export const metadata: Metadata = { title: "Peminjaman" }

export default async function PeminjamanPage() {
  const { data: peminjaman } = await getPeminjaman({ status: "aktif" })
  const terlambat = await getPeminjaman({ status: "terlambat" })

  const semuaAktif = [
    ...terlambat.data,
    ...peminjaman,
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Peminjaman Aktif</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            {semuaAktif.length} buku sedang dipinjam
          </p>
        </div>
        <Button variant="secondary" size="sm" asChild>
          <Link href="/peminjaman/riwayat">
            <History size={14} />
            Riwayat
          </Link>
        </Button>
      </div>

      {semuaAktif.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-14 w-14 rounded-full bg-[var(--bg-surface)] flex items-center justify-center mb-4">
            <BookMarked size={24} className="text-[var(--text-tertiary)]" />
          </div>
          <p className="text-sm font-medium text-[var(--text-primary)]">Tidak ada peminjaman aktif</p>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">
            Pinjam buku dari katalog untuk mulai membaca
          </p>
          <Button size="sm" className="mt-4" asChild>
            <Link href="/buku">Lihat Katalog</Link>
          </Button>
        </div>
      ) : (
        <PeminjamanList items={semuaAktif} />
      )}
    </div>
  )
}
