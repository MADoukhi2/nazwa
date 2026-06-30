export function ProductCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="aspect-square skeleton-shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-3 w-1/3 skeleton-shimmer rounded" />
        <div className="h-4 w-full skeleton-shimmer rounded" />
        <div className="h-4 w-2/3 skeleton-shimmer rounded" />
      </div>
    </div>
  );
}

export function GridSkeleton({ n = 6 }: { n?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: n }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function RailSkeleton({ n = 4 }: { n?: number }) {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="w-40 shrink-0">
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  );
}
