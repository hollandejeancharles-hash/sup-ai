import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ImageUpload } from "./ImageUpload";
import { YouTubeInput } from "./YouTubeInput";
import type { Item, ItemInsert, ItemUpdate } from "@/hooks/useDigests";

interface ItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: Item | null;
  digestId: string;
  onSave: (data: ItemInsert | ({ id: string } & ItemUpdate)) => Promise<void>;
  nextRank?: number;
}

export function ItemForm({
  open,
  onOpenChange,
  item,
  digestId,
  onSave,
  nextRank = 0,
}: ItemFormProps) {
  const isEditing = !!item;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    snippet: "",
    content_md: "",
    source: "",
    url: "",
    image_url: "",
    video_url: "",
    tags: [] as string[],
    read_time_minutes: 2,
  });

  // Reset form when item changes
  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || "",
        snippet: item.snippet || "",
        content_md: item.content_md || "",
        source: item.source || "",
        url: item.url || "",
        image_url: item.image_url || "",
        video_url: (item as any).video_url || "",
        tags: Array.isArray(item.tags) ? (item.tags as string[]) : [],
        read_time_minutes: item.read_time_minutes || 2,
      });
    } else {
      setFormData({
        title: "",
        snippet: "",
        content_md: "",
        source: "",
        url: "",
        image_url: "",
        video_url: "",
        tags: [],
        read_time_minutes: 2,
      });
    }
  }, [item, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) return;

    setLoading(true);
    try {
      if (isEditing && item) {
        await onSave({
          id: item.id,
          ...formData,
          tags: formData.tags,
          image_url: formData.image_url || null,
          video_url: formData.video_url || null,
        } as any);
      } else {
        await onSave({
          digest_id: digestId,
          rank: nextRank,
          ...formData,
          tags: formData.tags,
          image_url: formData.image_url || null,
          video_url: formData.video_url || null,
        } as any);
      }
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const handleTagsChange = (value: string) => {
    const tags = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, tags }));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-[28px] p-0 overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-hairline">
          <SheetHeader className="p-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-h2">
                {isEditing ? "Modifier l'article" : "Nouvel article"}
              </SheetTitle>
            </div>
          </SheetHeader>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-auto h-full pb-32">
          <div className="p-4 space-y-5">
            {/* Title */}
            <div>
              <label className="text-meta font-medium text-foreground block mb-2">
                Titre *
              </label>
              <Input
                placeholder="Titre de l'article"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="h-12 rounded-xl"
                required
              />
            </div>

            {/* Thumbnail */}
            <div>
              <label className="text-meta font-medium text-foreground block mb-2">
                Image / Thumbnail
              </label>
              <ImageUpload
                value={formData.image_url}
                onChange={(url) =>
                  setFormData((prev) => ({ ...prev, image_url: url || "" }))
                }
              />
            </div>

            {/* YouTube Video */}
            <div>
              <label className="text-meta font-medium text-foreground block mb-2">
                Vidéo YouTube (optionnel)
              </label>
              <YouTubeInput
                value={formData.video_url}
                onChange={(url) =>
                  setFormData((prev) => ({ ...prev, video_url: url || "" }))
                }
              />
            </div>

            {/* Snippet */}
            <div>
              <label className="text-meta font-medium text-foreground block mb-2">
                Résumé / Snippet
              </label>
              <Textarea
                placeholder="Court résumé de l'article (2-3 phrases)"
                value={formData.snippet}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, snippet: e.target.value }))
                }
                className="min-h-[100px] rounded-xl"
              />
            </div>

            {/* Content */}
            <div>
              <label className="text-meta font-medium text-foreground block mb-2">
                Contenu complet (Markdown)
              </label>
              <Textarea
                placeholder="Contenu complet de l'article en Markdown..."
                value={formData.content_md}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content_md: e.target.value }))
                }
                className="min-h-[150px] rounded-xl font-mono text-meta"
              />
            </div>

            {/* Source & URL */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-meta font-medium text-foreground block mb-2">
                  Source
                </label>
                <Input
                  placeholder="TechCrunch"
                  value={formData.source}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, source: e.target.value }))
                  }
                  className="h-12 rounded-xl"
                />
              </div>
              <div>
                <label className="text-meta font-medium text-foreground block mb-2">
                  Temps de lecture
                </label>
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={formData.read_time_minutes}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      read_time_minutes: parseInt(e.target.value) || 2,
                    }))
                  }
                  className="h-12 rounded-xl"
                />
              </div>
            </div>

            {/* URL */}
            <div>
              <label className="text-meta font-medium text-foreground block mb-2">
                URL source
              </label>
              <Input
                type="url"
                placeholder="https://..."
                value={formData.url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, url: e.target.value }))
                }
                className="h-12 rounded-xl"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="text-meta font-medium text-foreground block mb-2">
                Tags (séparés par des virgules)
              </label>
              <Input
                placeholder="IA, Tech, Business"
                value={formData.tags.join(", ")}
                onChange={(e) => handleTagsChange(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-hairline">
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full h-12"
              disabled={loading || !formData.title.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? "Enregistrer" : "Ajouter"}
                </>
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
