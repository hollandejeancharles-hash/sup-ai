import { useState } from "react";
import { Upload, FileText, Loader2, Check, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ParsedItem {
  title: string;
  url?: string;
  source?: string;
  snippet?: string;
  content_md?: string;
  tags?: string[];
  read_time_minutes?: number;
}

interface TextImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (items: ParsedItem[]) => Promise<void>;
}

// Extract URL from text
const extractUrl = (text: string): string | undefined => {
  const urlMatch = text.match(/https?:\/\/[^\s<>"{}|\\^`[\]]+/);
  return urlMatch ? urlMatch[0] : undefined;
};

// Extract domain from URL
const extractDomain = (url: string): string => {
  try {
    const domain = new URL(url).hostname.replace(/^www\./, "");
    return domain;
  } catch {
    return "";
  }
};

// Generate title from text (max 80 chars)
const generateTitle = (text: string): string => {
  // Check for title pattern: "Title — rest" or "Title: rest"
  const titleMatch = text.match(/^([^—:\n]{10,80})[—:]/);
  if (titleMatch) {
    return titleMatch[1].trim();
  }
  
  // Take first sentence or first 80 chars
  const firstSentence = text.split(/[.!?]\s/)[0];
  if (firstSentence && firstSentence.length <= 80) {
    return firstSentence.trim();
  }
  
  // Truncate to 80 chars at word boundary
  const truncated = text.substring(0, 80);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 40 ? truncated.substring(0, lastSpace) : truncated).trim() + "…";
};

// Generate snippet (160-220 chars)
const generateSnippet = (text: string, title: string): string => {
  // Remove title from beginning if present
  let content = text;
  if (content.startsWith(title)) {
    content = content.substring(title.length).replace(/^[—:\s]+/, "");
  }
  
  // Remove URLs for cleaner snippet
  content = content.replace(/https?:\/\/[^\s]+/g, "").trim();
  
  // Take 2-3 sentences or 160-220 chars
  const sentences = content.split(/(?<=[.!?])\s+/);
  let snippet = "";
  for (const sentence of sentences) {
    if ((snippet + " " + sentence).trim().length <= 220) {
      snippet = (snippet + " " + sentence).trim();
    } else {
      break;
    }
  }
  
  if (snippet.length < 50) {
    snippet = content.substring(0, 200).trim();
    const lastSpace = snippet.lastIndexOf(" ");
    if (lastSpace > 150) snippet = snippet.substring(0, lastSpace) + "…";
  }
  
  return snippet;
};

// Estimate read time (words / 200 wpm)
const estimateReadTime = (text: string): number => {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

// Extract tags from markdown headers or hashtags
const extractTags = (text: string): string[] => {
  const tags: string[] = [];
  
  // Match ## headers
  const headerMatches = text.matchAll(/^##\s+(.+)$/gm);
  for (const match of headerMatches) {
    tags.push(match[1].trim());
  }
  
  // Match #hashtags
  const hashtagMatches = text.matchAll(/#([A-Za-zÀ-ÿ0-9_]+)/g);
  for (const match of hashtagMatches) {
    if (!tags.includes(match[1])) {
      tags.push(match[1]);
    }
  }
  
  return tags.slice(0, 5); // Max 5 tags
};

// Parse text/markdown into items
const parseTextContent = (input: string): ParsedItem[] => {
  const items: ParsedItem[] = [];
  const seenUrls = new Set<string>();
  
  // Split by various separators
  const blocks = input
    .split(/\n{2,}|\n(?=[-•●▪]\s)|\n(?=\d+[.)]\s)|\n(?=[\p{Emoji}]\s)/u)
    .map((b) => b.trim())
    .filter((b) => b.length > 20); // Min content length
  
  for (const block of blocks) {
    const url = extractUrl(block);
    
    // Skip duplicates based on URL
    if (url && seenUrls.has(url)) continue;
    if (url) seenUrls.add(url);
    
    // Clean block for processing
    const cleanBlock = block
      .replace(/^[-•●▪]\s*/, "") // Remove bullet
      .replace(/^\d+[.)]\s*/, "") // Remove number
      .replace(/^[\p{Emoji}]\s*/u, "") // Remove leading emoji
      .trim();
    
    if (cleanBlock.length < 20) continue;
    
    const title = generateTitle(cleanBlock);
    const snippet = generateSnippet(cleanBlock, title);
    const tags = extractTags(block);
    
    items.push({
      title,
      url,
      source: url ? extractDomain(url) : undefined,
      snippet,
      content_md: cleanBlock,
      tags: tags.length > 0 ? tags : undefined,
      read_time_minutes: estimateReadTime(cleanBlock),
    });
  }
  
  return items;
};

export function TextImport({ open, onOpenChange, onImport }: TextImportProps) {
  const [textInput, setTextInput] = useState("");
  const [parsedItems, setParsedItems] = useState<ParsedItem[] | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleParse = () => {
    if (!textInput.trim()) {
      toast.error("Collez d'abord du texte à importer");
      return;
    }

    const items = parseTextContent(textInput);
    
    if (items.length === 0) {
      toast.error("Aucun article détecté. Séparez vos articles par des lignes vides.");
      return;
    }

    setParsedItems(items);
    toast.success(`${items.length} article(s) détecté(s)`);
  };

  const handleImport = async () => {
    if (!parsedItems) return;

    setIsImporting(true);
    try {
      await onImport(parsedItems);
      toast.success(`${parsedItems.length} article(s) importé(s)`);
      handleClose();
    } catch {
      toast.error("Erreur lors de l'import");
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setTextInput("");
    setParsedItems(null);
    onOpenChange(false);
  };

  const exampleText = `📰 OpenAI annonce GPT-5 avec des capacités multimodales avancées
OpenAI vient de dévoiler GPT-5, sa nouvelle génération de modèle de langage. Cette version apporte des améliorations significatives en termes de raisonnement et de compréhension contextuelle.
https://openai.com/blog/gpt-5

---

🎮 Sony révèle la PS6 pour fin 2026
Sony a officiellement annoncé la PlayStation 6 lors d'un événement spécial. La console promet des graphismes photoréalistes et un SSD encore plus rapide.
https://blog.playstation.com/ps6-reveal

---

💡 Apple lance ses lunettes AR "Vision Pro 2"
Après le succès mitigé du premier modèle, Apple revient avec une version plus légère et abordable de ses lunettes de réalité augmentée.
https://apple.com/vision-pro-2`;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Import Texte / Markdown
          </DialogTitle>
          <DialogDescription>
            Collez du texte brut ou Markdown. Séparez les articles par des lignes vides, 
            des puces (-), des numéros (1.) ou des emojis. Les URLs et tags sont détectés automatiquement.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            placeholder="Collez votre texte ici...

Chaque bloc séparé par une ligne vide devient un article.
Les URLs sont détectées automatiquement.
Les ## titres ou #hashtags deviennent des tags."
            value={textInput}
            onChange={(e) => {
              setTextInput(e.target.value);
              setParsedItems(null);
            }}
            className="min-h-[200px] font-mono text-sm"
          />

          {/* Action Buttons */}
          {!parsedItems && (
            <Button onClick={handleParse} className="w-full" disabled={!textInput.trim()}>
              <Sparkles className="mr-2 h-4 w-4" />
              Analyser le texte
            </Button>
          )}

          {/* Preview */}
          {parsedItems && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Check className="h-5 w-5" />
                <span className="font-medium">{parsedItems.length} article(s) détecté(s)</span>
              </div>

              <div className="border rounded-xl overflow-hidden max-h-[250px] overflow-y-auto">
                {parsedItems.map((item, index) => (
                  <div key={index} className="p-3 border-b last:border-b-0 bg-muted/30">
                    <p className="font-medium text-foreground line-clamp-1">
                      {index + 1}. {item.title}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                      {item.snippet}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      {item.source && <span className="text-accent-foreground">{item.source}</span>}
                      {item.tags && item.tags.length > 0 && (
                        <span>• {item.tags.join(", ")}</span>
                      )}
                      <span>• {item.read_time_minutes} min</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setParsedItems(null)}
                  className="flex-1"
                >
                  Modifier
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={isImporting}
                  className="flex-1"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Import en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Importer {parsedItems.length} article(s)
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Example */}
          <details className="text-sm">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
              Voir un exemple de format texte
            </summary>
            <pre className="mt-2 p-3 bg-muted rounded-lg overflow-x-auto text-xs whitespace-pre-wrap">
              {exampleText}
            </pre>
          </details>
        </div>
      </DialogContent>
    </Dialog>
  );
}
