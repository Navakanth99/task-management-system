export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-800 ${className}`} />;
}

export function TaskRowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b px-6 py-4 last:border-b-0">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-5 w-20 rounded-full" />
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-20" />
    </div>
  );
}

export function TaskTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <TaskRowSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card p-5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-8 w-16" />
    </div>
  );
}
