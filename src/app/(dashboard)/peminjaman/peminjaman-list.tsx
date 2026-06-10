"use client"

import { PinjamCard } from "@/components/peminjaman/pinjam-card"
import type { Peminjaman } from "@/types"

export function PeminjamanList({ items }: { items: Peminjaman[] }) {
  return (
    <div className="space-y-3">
      {items.map((p) => (
        <PinjamCard key={p.id} peminjaman={p} />
      ))}
    </div>
  )
}
