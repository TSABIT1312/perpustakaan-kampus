"use client"

import { BukuCard } from "@/components/buku/buku-card"
import type { Buku } from "@/types"

export function BukuGridClient({ buku, isAdmin }: { buku: Buku[]; isAdmin?: boolean }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {buku.map((b) => (
        <BukuCard key={b.id} buku={b} isAdmin={isAdmin} />
      ))}
    </div>
  )
}
