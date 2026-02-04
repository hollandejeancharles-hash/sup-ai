import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function BreakingCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("w-[280px] h-[340px] flex-shrink-0 rounded-card overflow-hidden", className)}>
      <Skeleton className="w-full h-full" />
    </div>
  );
}

export function ArticleCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex gap-4 p-4 bg-card rounded-card", className)}>
      <Skeleton className="w-20 h-20 rounded-image flex-shrink-0" />
      <div className="flex-1 flex flex-col justify-center gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Breaking section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          <BreakingCardSkeleton />
          <BreakingCardSkeleton />
        </div>
      </div>

      {/* Recommendations section */}
      <div>
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-3">
          <ArticleCardSkeleton />
          <ArticleCardSkeleton />
          <ArticleCardSkeleton />
        </div>
      </div>
    </div>
  );
}
