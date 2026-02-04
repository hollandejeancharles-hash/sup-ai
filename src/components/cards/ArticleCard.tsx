import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  id: string;
  title: string;
  source: string;
  snippet?: string;
  imageUrl?: string;
  readTime?: number;
  className?: string;
}

export function ArticleCard({
  id,
  title,
  source,
  snippet,
  imageUrl,
  readTime = 2,
  className,
}: ArticleCardProps) {
  return (
    <Link
      to={`/article/${id}`}
      className={cn(
        "flex gap-4 p-4 bg-card rounded-card shadow-card transition-all active:scale-[0.98]",
        className
      )}
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-20 h-20 rounded-image overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h4 className="font-semibold text-body text-foreground leading-snug line-clamp-2 mb-1">
          {title}
        </h4>
        {snippet && (
          <p className="text-meta text-muted-foreground line-clamp-1 mb-1.5">
            {snippet}
          </p>
        )}
        <div className="flex items-center gap-2 text-small text-muted-foreground">
          <span>{source}</span>
          <span>•</span>
          <span>{readTime} min</span>
        </div>
      </div>
    </Link>
  );
}
