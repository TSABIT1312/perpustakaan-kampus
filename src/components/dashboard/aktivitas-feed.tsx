import { BookOpen, RotateCcw } from "lucide-react"
import { formatWaktuRelatif } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface AktivitasItem {
  id: string
  tipe: "pinjam" | "kembali"
  nama_peminjam: string
  judul_buku: string
  waktu: string
}

export function AktivitasFeed({ items }: { items: AktivitasItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-[var(--text-tertiary)] py-4 text-center">
        Belum ada aktivitas
      </p>
    )
  }

  return (
    <div className="space-y-0">
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-3 group">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex items-center justify-center h-7 w-7 rounded-full shrink-0 mt-0.5",
                item.tipe === "pinjam"
                  ? "bg-[var(--brand-subtle)] text-[var(--brand)]"
                  : "bg-[var(--success-subtle)] text-[var(--success)]"
              )}
            >
              {item.tipe === "pinjam" ? (
                <BookOpen size={13} />
              ) : (
                <RotateCcw size={13} />
              )}
            </div>
            {index < items.length - 1 && (
              <div className="w-px flex-1 bg-[var(--border-color)] mt-1 mb-1" />
            )}
          </div>

          <div className="pb-4 min-w-0">
            <p className="text-sm text-[var(--text-primary)]">
              <span className="font-medium">{item.nama_peminjam}</span>{" "}
              {item.tipe === "pinjam" ? "meminjam" : "mengembalikan"}{" "}
              <span className="font-medium">{item.judul_buku}</span>
            </p>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
              {formatWaktuRelatif(item.waktu)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
