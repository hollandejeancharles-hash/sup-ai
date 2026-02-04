import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BreakingCardProps {
  id: string;
  title: string;
  source: string;
  imageUrl?: string;
  tags?: string[];
  readTime?: number;
  className?: string;
}

export function BreakingCard({
  id,
  title,
  source,
  imageUrl,
  tags = [],
  readTime = 2,
  className,
}: BreakingCardProps) {
  const displayTag = tags[0] || "News";

  return (
    <Link
      to={`/article/${id}`}
      className={cn(
        "relative block w-[280px] h-[340px] flex-shrink-0 rounded-card overflow-hidden shadow-card",
        className
      )}
    >
      {/* Background Image or Gradient Placeholder */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary" />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end">
        {/* Tag Badge */}
        <span className="inline-flex self-start px-3 py-1 rounded-full bg-primary text-primary-foreground text-small font-medium mb-3">
          {displayTag}
        </span>

        {/* Title */}
        <h3 className="text-white text-lg font-semibold leading-tight line-clamp-2 mb-2">
          {title}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-2 text-white/70 text-meta">
          <span>{source}</span>
          <span>•</span>
          <span>{readTime} min read</span>
        </div>
      </div>
    </Link>
  );
}
