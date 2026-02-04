import { useState } from "react";
import { Youtube, X, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface YouTubeInputProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  className?: string;
}

// Extract YouTube video ID from various URL formats
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/, // Just the ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function getYouTubeThumbnail(url: string): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}`;
}

export function YouTubeInput({ value, onChange, className }: YouTubeInputProps) {
  const [inputValue, setInputValue] = useState(value || "");
  const videoId = value ? extractYouTubeId(value) : null;
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (!newValue.trim()) {
      onChange(null);
      return;
    }

    // Validate and extract ID
    const id = extractYouTubeId(newValue);
    if (id) {
      onChange(newValue);
    }
  };

  const handleRemove = () => {
    setInputValue("");
    onChange(null);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="URL YouTube ou ID vidéo"
            value={inputValue}
            onChange={handleChange}
            className="pl-10 h-12 rounded-xl"
          />
        </div>
        {value && (
          <button
            onClick={handleRemove}
            className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center touch-target hover:bg-destructive/20 transition-colors"
          >
            <X className="h-5 w-5 text-destructive" />
          </button>
        )}
      </div>

      {thumbnailUrl && videoId && (
        <div className="relative rounded-xl overflow-hidden bg-muted">
          <img
            src={thumbnailUrl}
            alt="YouTube thumbnail"
            className="w-full h-32 object-cover"
            onError={(e) => {
              // Fallback to lower quality thumbnail
              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Play className="h-6 w-6 text-white fill-white ml-1" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
