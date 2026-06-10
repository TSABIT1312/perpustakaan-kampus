"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BookOpen, Pencil, Trash2 } from "lucide-react"
import { StatusBadge } from "@/components/ui/badge"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BukuEditDialog } from "@/components/buku/buku-edit-dialog"
import { useDeleteBuku } from "@/hooks/use-buku"
import type { Buku } from "@/types"

interface BukuCardProps {
  buku: Buku
  isAdmin?: boolean
}

export function BukuCard({ buku, isAdmin }: BukuCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { mutate: hapus, isPending: deleting } = useDeleteBuku()
  const status = buku.tersedia > 0 ? "tersedia" : "dipinjam"

  return (
    <div className="group relative">
      <Link href={`/buku/${buku.id}`}>
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--bg-base)] overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-[box-shadow,transform] duration-200">
          {/* Cover */}
          <div className="relative aspect-[3/4] bg-[var(--bg-surface)] overflow-hidden">
            {buku.cover_url ? (
              <Image
                src={buku.cover_url}
                alt={buku.judul}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--brand-subtle)] gap-3 p-4">
                <BookOpen size={32} className="text-[var(--brand)] opacity-50" />
                <p className="text-xs text-[var(--brand)] font-medium text-center line-clamp-3">
                  {buku.judul}
                </p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>

          {/* Info */}
          <div className="p-3">
            <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-2 leading-snug">
              {buku.judul}
            </p>
            <p className="text-xs text-[var(--text-tertiary)] mt-1 truncate">{buku.pengarang}</p>
            <div className="flex items-center justify-between mt-3">
              <StatusBadge status={status} />
              {buku.tersedia > 0 && (
                <span className="text-xs text-[var(--text-tertiary)]">{buku.tersedia} tersedia</span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Admin action buttons — muncul saat hover */}
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
          <button
            onClick={(e) => { e.preventDefault(); setEditOpen(true) }}
            className="h-7 w-7 flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--bg-base)]/90 backdrop-blur-sm border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--brand)] hover:border-[var(--brand)] transition-colors shadow-[var(--shadow-sm)]"
            title="Edit buku"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); setDeleteOpen(true) }}
            className="h-7 w-7 flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--bg-base)]/90 backdrop-blur-sm border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--error)] hover:border-[var(--error)] transition-colors shadow-[var(--shadow-sm)]"
            title="Hapus buku"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}

      {/* Edit dialog */}
      {isAdmin && (
        <BukuEditDialog buku={buku} open={editOpen} onOpenChange={setEditOpen} />
      )}

      {/* Delete confirm dialog */}
      {isAdmin && (
        <Dialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Hapus Buku"
          description={`"${buku.judul}" akan dinonaktifkan dari katalog. Tindakan ini bisa dibatalkan melalui database.`}
        >
          <div className="flex gap-3 mt-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              loading={deleting}
              onClick={() => hapus(buku.id, { onSuccess: () => setDeleteOpen(false) })}
            >
              {deleting ? "Menghapus..." : "Hapus"}
            </Button>
          </div>
        </Dialog>
      )}
    </div>
  )
}
