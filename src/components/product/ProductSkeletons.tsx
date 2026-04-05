// components/product/ProductSkeletons.tsx
import { Skeleton } from "../ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-50 p-0 overflow-hidden">
      <Skeleton className="aspect-[1/1.1] w-full rounded-none" />
      <div className="p-6 space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-1/3 rounded-full" />
          <Skeleton className="h-3 w-8 rounded-full" />
        </div>
        <Skeleton className="h-5 w-full rounded-lg" />
        <div className="flex justify-between items-center pt-2">
          <div className="space-y-2">
            <Skeleton className="h-3 w-12 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
