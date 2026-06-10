"use client"

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { BukuPopuler } from "@/components/dashboard/buku-populer"

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"]

interface AnalitikChartsProps {
  data: Array<{ bulan: string; pinjam: number; kembali: number }>
  bukuPopuler: Array<{ id: string; judul: string; pengarang: string; cover_url: string | null; jumlah_pinjam: number }>
}

export function AnalitikCharts({ data, bukuPopuler }: AnalitikChartsProps) {
  // Genre distribution from popular books (simplified)
  const genreData = [
    { name: "Teknologi", value: 35 },
    { name: "Sains", value: 20 },
    { name: "Manajemen", value: 18 },
    { name: "Hukum", value: 12 },
    { name: "Lainnya", value: 15 },
  ]

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Tren Peminjaman</CardTitle>
          <p className="text-xs text-[var(--text-tertiary)]">12 bulan terakhir</p>
        </CardHeader>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis
              dataKey="bulan"
              tick={{ fill: "var(--text-tertiary)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--text-tertiary)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="pinjam"
              name="Dipinjam"
              stroke="var(--brand)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="kembali"
              name="Dikembalikan"
              stroke="var(--success)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribusi Genre</CardTitle>
        </CardHeader>
        <div className="flex items-center gap-4">
          <ResponsiveContainer width="60%" height={180}>
            <PieChart>
              <Pie
                data={genreData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {genreData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 flex-1">
            {genreData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <span className="text-xs text-[var(--text-secondary)]">{d.name}</span>
                <span className="text-xs font-medium text-[var(--text-primary)] ml-auto">
                  {d.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Buku Paling Diminati</CardTitle>
        </CardHeader>
        <BukuPopuler items={bukuPopuler} />
      </Card>
    </div>
  )
}
