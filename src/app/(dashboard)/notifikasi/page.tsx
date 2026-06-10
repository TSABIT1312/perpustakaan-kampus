import type { Metadata } from "next"
import { getNotifikasi } from "@/actions/notifikasi"
import { NotifikasiList } from "./notifikasi-list"

export const metadata: Metadata = { title: "Notifikasi" }

export default async function NotifikasiPage() {
  const notifikasi = await getNotifikasi()

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Notifikasi</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">
          Pembaruan dan pengingat dari sistem perpustakaan
        </p>
      </div>

      <NotifikasiList notifikasi={notifikasi} />
    </div>
  )
}
