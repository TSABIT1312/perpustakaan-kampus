import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, BookOpen, MapPin, Calendar, Hash, Globe } from "lucide-react"
import { getBukuById } from "@/actions/buku"
import { createClient } from "@/lib/supabase/server"
import { StatusBadge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { PinjamButton } from "./pinjam-button"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const buku = await getBukuById(id)
  return { title: buku?.judul ?? "Buku" }
}

export default async function BukuDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const buku = await getBukuById(id)
  if (!buku) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profil } = user
    ? await supabase.from("profiles").select("peran").eq("id", user.id).single()
    : { data: null }

  const status = buku.tersedia > 0 ? "tersedia" : "dipinjam"

  const detail = [
    { icon: Hash, label: "ISBN", value: buku.isbn },
    { icon: Globe, label: "Bahasa", value: buku.bahasa },
    { icon: Calendar, label: "Tahun Terbit", value: buku.tahun_terbit?.toString() },
    { icon: BookOpen, label: "Halaman", value: buku.jumlah_halaman?.toString() },
    { icon: MapPin, label: "Lokasi Rak", value: buku.lokasi_rak },
  ].filter((d) => d.value)

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/buku"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        Kembali ke katalog
      </Link>

      <div className="grid md:grid-cols-[240px_1fr] gap-6">
        {/* Cover */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[3/4] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--bg-surface)] shadow-[var(--shadow-lg)]">
            {buku.cover_url ? (
              <Image
                src={buku.cover_url}
                alt={buku.judul}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--brand-subtle)] gap-3 p-6">
                <BookOpen size={40} className="text-[var(--brand)] opacity-40" />
                <p className="text-sm text-[var(--brand)] font-medium text-center">{buku.judul}</p>
              </div>
            )}
          </div>

          {/* Status & Borrow */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <StatusBadge status={status} />
              <span className="text-xs text-[var(--text-tertiary)]">
                {buku.tersedia}/{buku.total_eksemplar} tersedia
              </span>
            </div>

            {user && profil?.peran === "mahasiswa" && (
              <PinjamButton bukuId={buku.id} tersedia={buku.tersedia > 0} />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--brand-subtle)] text-[var(--brand)]">
              {buku.genre}
            </span>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)] mt-3 leading-snug">
              {buku.judul}
            </h1>
            <p className="text-base text-[var(--text-secondary)] mt-1">{buku.pengarang}</p>
            {buku.penerbit && (
              <p className="text-sm text-[var(--text-tertiary)] mt-0.5">{buku.penerbit}</p>
            )}
          </div>

          {buku.deskripsi && (
            <div>
              <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Deskripsi</h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {buku.deskripsi}
              </p>
            </div>
          )}

          {detail.length > 0 && (
            <Card variant="default" padding="sm">
              <div className="grid grid-cols-2 gap-3">
                {detail.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2">
                    <Icon size={14} className="text-[var(--text-tertiary)] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">{label}</p>
                      <p className="text-sm text-[var(--text-primary)]">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
