import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/layout/BottomNav";
import { MobileContainer } from "@/components/layout/MobileContainer";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { CategoryChip } from "@/components/cards/CategoryChip";
import { mockItems, mockCategories } from "@/lib/mockData";

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems = mockItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.snippet?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.tags?.includes(activeCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <MobileContainer>
        {/* Header */}
        <header className="pt-6 pb-4">
          <h1 className="text-h1 text-foreground mb-4">Discover</h1>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-full bg-secondary border-0 text-body"
            />
          </div>
        </header>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-4">
          {mockCategories.map((category) => (
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
              {filteredItems.length} articles
            </h2>
            <select className="text-meta text-muted-foreground bg-transparent">
              <option>Most recent</option>
              <option>Popular</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <ArticleCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  source={item.source}
                  snippet={item.snippet}
                  imageUrl={item.image_url}
                  readTime={item.read_time_minutes}
                />
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground text-body">
                  Aucun article trouvé
                </p>
              </div>
            )}
          </div>
        </section>
      </MobileContainer>
      <BottomNav />
    </>
  );
}
