import type { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { BukuGrid } from "./buku-grid"
import { BukuSearch } from "@/components/buku/buku-search"
import { BukuFilter } from "@/components/buku/buku-filter"
import { BookCardSkeleton } from "@/components/ui/skeleton"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Koleksi Buku" }

async function getPeran() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from("profiles")
    .select("peran")
    .eq("id", user.id)
    .single()
  return data?.peran
}

export default async function BukuPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const peran = await getPeran()
  const isStaff = peran === "admin" || peran === "staf"

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Koleksi Buku</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            Temukan dan pinjam buku yang kamu butuhkan
          </p>
        </div>
        {isStaff && (
          <Button asChild size="sm">
            <Link href="/buku/tambah">
              <Plus size={15} />
              Tambah Buku
            </Link>
          </Button>
        )}
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <Suspense>
          <BukuSearch />
        </Suspense>
        <Suspense>
          <BukuFilter />
        </Suspense>
      </div>

      {/* Grid */}
      <Suspense
        fallback={
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <BukuGrid params={params} isAdmin={isStaff} />
      </Suspense>
    </div>
  )
}
