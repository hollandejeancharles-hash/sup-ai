import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { BottomNav } from "@/components/layout/BottomNav";
import { MobileContainer } from "@/components/layout/MobileContainer";
import { BreakingCard } from "@/components/cards/BreakingCard";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { mockItems } from "@/lib/mockData";

export default function Home() {
  const breakingItems = mockItems.slice(0, 3);
  const recommendedItems = mockItems.slice(3);

  return (
    <>
      <MobileContainer>
        {/* Header */}
        <header className="pt-6 pb-4">
          <h1 className="text-h1 text-foreground">Today</h1>
          <p className="text-meta text-muted-foreground">
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </header>

        {/* Breaking News Section */}
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
                source={item.source}
                imageUrl={item.image_url}
                tags={item.tags}
                readTime={item.read_time_minutes}
              />
            ))}
          </div>
        </section>

        {/* Recommendations Section */}
        <section>
          <h2 className="text-h2 text-foreground mb-4">Recommendation</h2>
          <div className="space-y-3">
            {recommendedItems.map((item) => (
              <ArticleCard
                key={item.id}
                id={item.id}
                title={item.title}
                source={item.source}
                snippet={item.snippet}
                imageUrl={item.image_url}
                readTime={item.read_time_minutes}
              />
            ))}
          </div>
        </section>
      </MobileContainer>
      <BottomNav />
    </>
  );
}
