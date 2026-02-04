import { Bookmark } from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";
import { MobileContainer } from "@/components/layout/MobileContainer";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { mockItems } from "@/lib/mockData";

export default function Bookmarks() {
  // For now, show first 3 items as "bookmarked" for demo
  const bookmarkedItems = mockItems.slice(0, 3);
  const hasBookmarks = bookmarkedItems.length > 0;

  return (
    <>
      <MobileContainer>
        {/* Header */}
        <header className="pt-6 pb-4">
          <h1 className="text-h1 text-foreground">Saved</h1>
          <p className="text-meta text-muted-foreground">
            {bookmarkedItems.length} articles
          </p>
        </header>

        {/* Content */}
        {hasBookmarks ? (
          <div className="space-y-3">
            {bookmarkedItems.map((item) => (
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
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bookmark className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-h2 text-foreground mb-2">Aucun article sauvegardé</h2>
            <p className="text-body text-muted-foreground text-center max-w-xs">
              Appuie sur l'icône bookmark pour sauvegarder des articles ici.
            </p>
          </div>
        )}
      </MobileContainer>
      <BottomNav />
    </>
  );
}
