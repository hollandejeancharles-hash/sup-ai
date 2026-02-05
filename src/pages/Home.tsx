import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { BottomNav } from "@/components/layout/BottomNav";
import { MobileContainer } from "@/components/layout/MobileContainer";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { BreakingCard } from "@/components/cards/BreakingCard";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { useBreakingItems, useRegularItems, useLatestDigest } from "@/hooks/useDigests";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

function LoadingSkeleton() {
  return (
    <>
      {/* Breaking skeleton */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-[260px] h-[180px] rounded-card flex-shrink-0" />
          ))}
        </div>
      </section>
      
      {/* Recommendations skeleton */}
      <section>
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-card" />
          ))}
        </div>
      </section>
    </>
  );
}

function EmptyState() {
  return (
    <div className="py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">📰</span>
      </div>
      <h2 className="text-h2 text-foreground mb-2">Pas encore de digest</h2>
      <p className="text-body text-muted-foreground max-w-xs mx-auto">
        Le premier digest arrive bientôt. Reviens demain !
      </p>
    </div>
  );
}

export default function Home() {
  const { data: breakingItems, isLoading: loadingBreaking } = useBreakingItems();
  const { data: regularItems, isLoading: loadingRegular } = useRegularItems();
  const { data: digest, isLoading: loadingDigest } = useLatestDigest();

  const isLoading = loadingBreaking || loadingRegular || loadingDigest;
  const hasContent = (breakingItems && breakingItems.length > 0) || (regularItems && regularItems.length > 0);

  const todayDate = digest
    ? format(new Date(digest.date), "EEEE d MMMM", { locale: fr })
    : new Date().toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });

  return (
    <>
      <MobileContainer>
        <PublicHeader title="Today" subtitle={todayDate} />

        {isLoading ? (
          <LoadingSkeleton />
        ) : !hasContent ? (
          <EmptyState />
        ) : (
          <>
            {/* Breaking News Section */}
            {breakingItems && breakingItems.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-h2 text-foreground">Breaking News</h2>
                  <Link
                    to="/discover"
                    className="flex items-center gap-1 text-meta text-primary font-medium touch-target"
                  >
                    View all
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Horizontal Scroll */}
                <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
                  {breakingItems.map((item) => (
                    <BreakingCard
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      source={item.source || ""}
                      imageUrl={item.image_url}
                      tags={Array.isArray(item.tags) ? (item.tags as string[]) : []}
                      readTime={item.read_time_minutes || 2}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Recommendations Section */}
            {regularItems && regularItems.length > 0 && (
              <section>
                <h2 className="text-h2 text-foreground mb-4">Pour vous</h2>
                <div className="space-y-3">
                  {regularItems.map((item) => (
                    <ArticleCard
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      source={item.source || ""}
                      snippet={item.snippet || ""}
                      imageUrl={item.image_url}
                      readTime={item.read_time_minutes || 2}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </MobileContainer>
      <BottomNav />
    </>
  );
}