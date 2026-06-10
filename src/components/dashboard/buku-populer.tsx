import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface BukuPopulerItem {
  id: string
  judul: string
  pengarang: string
  cover_url: string | null
  jumlah_pinjam: number
}

export function BukuPopuler({ items }: { items: BukuPopulerItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-[var(--text-tertiary)] py-4 text-center">
        Belum ada data
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {items.map((buku, index) => (
        <Link
          key={buku.id}
          href={`/buku/${buku.id}`}
          className="flex items-center gap-3 p-2 rounded-[var(--radius-md)] hover:bg-[var(--bg-surface)] transition-colors group"
        >
          <span
            className={cn(
              "text-xs font-semibold w-5 text-center shrink-0",
              index === 0
                ? "text-[var(--warning)]"
                : "text-[var(--text-tertiary)]"
            )}
          >
            {index + 1}
          </span>

          <div className="h-10 w-8 rounded overflow-hidden shrink-0 bg-[var(--bg-surface)]">
            {buku.cover_url ? (
              <Image
                src={buku.cover_url}
                alt={buku.judul}
                width={32}
                height={40}
                className="object-cover h-full w-full"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-[var(--brand-subtle)] text-[var(--brand)] text-xs font-bold">
                {buku.judul[0]}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate group-hover:text-[var(--brand)] transition-colors">
              {buku.judul}
            </p>
            <p className="text-xs text-[var(--text-tertiary)] truncate">{buku.pengarang}</p>
          </div>

          <span className="text-xs font-medium text-[var(--brand)] shrink-0">
            {buku.jumlah_pinjam}x
          </span>
        </Link>
      ))}
    </div>
  )
}
