import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/layout/BottomNav";
import { MobileContainer } from "@/components/layout/MobileContainer";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { CategoryChip } from "@/components/cards/CategoryChip";
import { useLatestItems } from "@/hooks/useDigests";
import { Skeleton } from "@/components/ui/skeleton";

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: items, isLoading } = useLatestItems();

  // Extract unique categories from items
  const categories = useMemo(() => {
    if (!items) return ["All"];
    const tags = new Set<string>();
    items.forEach((item) => {
      if (Array.isArray(item.tags)) {
        (item.tags as string[]).forEach((tag) => tags.add(tag));
      }
    });
    return ["All", ...Array.from(tags)];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!items) return [];
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.snippet?.toLowerCase().includes(searchQuery.toLowerCase());
      const tags = Array.isArray(item.tags) ? (item.tags as string[]) : [];
      const matchesCategory =
        activeCategory === "All" || tags.includes(activeCategory);
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, activeCategory]);

  return (
    <>
      <MobileContainer>
        <PublicHeader title="Discover" />

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un article..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-full bg-secondary border-0 text-body"
          />
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-4">
          {categories.map((category) => (
            <CategoryChip
              key={category}
              label={category}
              isActive={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            />
          ))}
        </div>

        {/* Articles List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-body font-semibold text-muted-foreground">
              {isLoading ? "..." : `${filteredItems.length} articles`}
            </h2>
            <select className="text-meta text-muted-foreground bg-transparent">
              <option>Plus récent</option>
              <option>Populaire</option>
            </select>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 rounded-card" />
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="space-y-3">
              {filteredItems.map((item) => (
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
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground text-body">
                Aucun article trouvé
              </p>
            </div>
          )}
        </section>
      </MobileContainer>
      <BottomNav />
    </>
  );
}