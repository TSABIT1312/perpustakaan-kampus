"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { useQuery } from "@tanstack/react-query"
import { getDataGrafik } from "@/actions/analitik"
import { Skeleton } from "@/components/ui/skeleton"

export function PinjamChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "grafik"],
    queryFn: () => getDataGrafik(6),
  })

  if (isLoading) return <Skeleton className="h-56 w-full" />

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={10}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border-color)"
          vertical={false}
        />
        <XAxis
          dataKey="bulan"
          tick={{ fill: "var(--text-tertiary)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--text-tertiary)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-md)",
            fontSize: 12,
          }}
          cursor={{ fill: "var(--bg-overlay)" }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
        />
        <Bar
          dataKey="pinjam"
          name="Dipinjam"
          fill="var(--brand)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="kembali"
          name="Dikembalikan"
          fill="var(--success)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
