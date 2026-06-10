import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getPeminjaman } from "@/actions/peminjaman"
import { formatTanggalPendek, formatRupiah } from "@/lib/utils"
import { StatusBadge } from "@/components/ui/badge"

export const metadata: Metadata = { title: "Riwayat Peminjaman" }

export default async function RiwayatPage() {
  const { data } = await getPeminjaman({ status: "dikembalikan" })

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/peminjaman"
          className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft size={15} />
          Kembali
        </Link>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Riwayat Peminjaman</h2>
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-[var(--text-tertiary)] py-12 text-center">
          Belum ada riwayat pengembalian
        </p>
      ) : (
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-color)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border-color)] bg-[var(--bg-subtle)]">
              <tr>
                {["Buku", "Dipinjam", "Dikembalikan", "Denda", "Status"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {data.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-[var(--bg-subtle)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/buku/${p.buku_id}`}
                      className="font-medium text-[var(--text-primary)] hover:text-[var(--brand)] transition-colors"
                    >
                      {p.buku?.judul ?? "–"}
                    </Link>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      {p.buku?.pengarang}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {formatTanggalPendek(p.dipinjam_pada)}
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {p.dikembalikan ? formatTanggalPendek(p.dikembalikan) : "–"}
                  </td>
                  <td className="px-4 py-3">
                    {p.denda > 0 ? (
                      <span className="text-[var(--error)] font-medium">
                        {formatRupiah(p.denda)}
                      </span>
                    ) : (
                      <span className="text-[var(--text-tertiary)]">–</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
