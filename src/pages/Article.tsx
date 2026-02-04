import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark, Share2, ExternalLink, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProtectedAction } from "@/hooks/useProtectedAction";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import type { Item } from "@/hooks/useDigests";

// Extract YouTube embed URL
function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }
  return null;
}

export default function Article() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { executeProtected } = useProtectedAction();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching item:", error);
      }

      setItem(data as Item | null);
      setLoading(false);
    };

    fetchItem();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Skeleton className="h-[45vh] w-full" />
        <div className="container px-4 py-6 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Article non trouvé</p>
          <button
            onClick={() => navigate("/home")}
            className="text-primary font-medium"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const videoUrl = (item as any).video_url;
  const embedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;

  const handleBookmark = () => {
    executeProtected(
      () => {
        setIsBookmarked(!isBookmarked);
        if (!isBookmarked) {
          toast.success("Ajouté aux favoris");
        } else {
          toast.success("Retiré des favoris");
        }
        // TODO: Save to Supabase bookmarks table
      },
      { actionType: "bookmark", actionLabel: "sauvegarder cet article" }
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.snippet || "",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative">
        {/* Video or Image */}
        {showVideo && embedUrl ? (
          <div className="relative w-full aspect-video bg-black">
            <iframe
              src={`${embedUrl}?autoplay=1`}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        ) : (
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

            {/* Play button for video */}
            {embedUrl && (
              <button
                onClick={() => setShowVideo(true)}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg transition-transform hover:scale-110">
                  <Play className="h-10 w-10 text-white fill-white ml-1" />
                </div>
              </button>
            )}
          </div>
        )}

        {/* Top Navigation - always visible */}
        <div
          className={cn(
            "absolute top-0 left-0 right-0 pt-safe",
            showVideo && "relative bg-background"
          )}
        >
          <div className="container px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center touch-target",
                showVideo
                  ? "bg-secondary"
                  : "bg-black/30 backdrop-blur-sm"
              )}
            >
              <ArrowLeft
                className={cn("h-5 w-5", showVideo ? "text-foreground" : "text-white")}
              />
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleBookmark}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center touch-target",
                  showVideo
                    ? "bg-secondary"
                    : "bg-black/30 backdrop-blur-sm"
                )}
              >
                <Bookmark
                  className={cn(
                    "h-5 w-5",
                    isBookmarked
                      ? "fill-primary text-primary"
                      : showVideo
                      ? "text-foreground"
                      : "text-white"
                  )}
                />
              </button>
              <button
                onClick={handleShare}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center touch-target",
                  showVideo
                    ? "bg-secondary"
                    : "bg-black/30 backdrop-blur-sm"
                )}
              >
                <Share2
                  className={cn("h-5 w-5", showVideo ? "text-foreground" : "text-white")}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sheet */}
      <div
        className={cn(
          "relative bg-background min-h-[60vh]",
          !showVideo && "-mt-8 rounded-t-[26px]"
        )}
      >
        <div className="container px-4 py-6">
          {/* Tags */}
          {Array.isArray(item.tags) && (item.tags as string[]).length > 0 && (
            <div className="flex gap-2 mb-4">
              {(item.tags as string[]).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-small font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-h1 text-foreground leading-tight mb-4">
            {item.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-3 text-meta text-muted-foreground mb-6 pb-6 border-b border-hairline">
            {item.source && (
              <>
                <span className="font-medium text-foreground">{item.source}</span>
                <span>•</span>
              </>
            )}
            <span>{item.read_time_minutes || 2} min read</span>
            {embedUrl && (
              <>
                <span>•</span>
                <span className="text-primary">🎬 Vidéo</span>
              </>
            )}
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {item.snippet && (
              <p className="text-body text-foreground leading-relaxed mb-4">
                {item.snippet}
              </p>
            )}
            {item.content_md && (
              <div className="text-body text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {item.content_md}
              </div>
            )}
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
                  Lire l'article complet
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