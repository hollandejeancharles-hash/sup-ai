import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark, Share2, ExternalLink } from "lucide-react";
import { mockItems } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function Article() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const item = mockItems.find((i) => i.id === id);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, [id]);

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Article non trouvé</p>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.snippet,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative h-[45vh] min-h-[300px]">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-primary/60" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* Top Navigation */}
        <div className="absolute top-0 left-0 right-0 pt-safe">
          <div className="container px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center touch-target"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center touch-target"
              >
                <Bookmark
                  className={cn(
                    "h-5 w-5",
                    isBookmarked ? "fill-primary text-primary" : "text-white"
                  )}
                />
              </button>
              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center touch-target"
              >
                <Share2 className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sheet */}
      <div className="relative -mt-8 bg-background rounded-t-[26px] min-h-[60vh]">
        <div className="container px-4 py-6">
          {/* Tags */}
          <div className="flex gap-2 mb-4">
            {item.tags?.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-small font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-h1 text-foreground leading-tight mb-4">
            {item.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-3 text-meta text-muted-foreground mb-6 pb-6 border-b border-hairline">
            <span className="font-medium text-foreground">{item.source}</span>
            <span>•</span>
            <span>{item.read_time_minutes} min read</span>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-body text-foreground leading-relaxed mb-4">
              {item.snippet}
            </p>
            <p className="text-body text-muted-foreground leading-relaxed">
              {item.content_md || 
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
              }
            </p>
            <p className="text-body text-muted-foreground leading-relaxed mt-4">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>

          {/* Source Link */}
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 mt-8 bg-secondary rounded-card"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ExternalLink className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-meta font-medium text-foreground">
                  Read full article
                </p>
                <p className="text-small text-muted-foreground">{item.source}</p>
              </div>
            </a>
          )}

          {/* Bottom Spacing */}
          <div className="h-20" />
        </div>
      </div>
    </div>
  );
}
