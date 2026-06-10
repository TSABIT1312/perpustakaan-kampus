import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] bg-[var(--bg-surface)] animate-pulse",
        className
      )}
      {...props}
    />
  )
}

export function BookCardSkeleton() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--bg-base)] p-4 flex flex-col gap-3">
      <Skeleton className="w-full aspect-[3/4] rounded-[var(--radius-md)]" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-[var(--radius-md)]" />
      </div>
    </div>
  )
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--bg-base)] p-5 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-8 rounded-[var(--radius-md)]" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}
