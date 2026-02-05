import { useState } from "react";
import { Upload, FileJson, Loader2, Check, AlertCircle, Sparkles } from "lucide-react";
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
import { jsonrepair } from "jsonrepair";


interface JsonItem {
  title: string;
  url?: string;
  source?: string;
  snippet?: string;
  tags?: string[];
  image_url?: string;
  content_md?: string;
  paragraphe?: string;
  video_url?: string;
  read_time_minutes?: number;
}

interface JsonImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (items: JsonItem[]) => Promise<void>;
}

// Escape unescaped quotes inside JSON string values
const escapeQuotesInStrings = (input: string): { result: string; fixed: boolean } => {
  let fixed = false;
  let result = "";
  let inString = false;
  let i = 0;

  while (i < input.length) {
    const char = input[i];
    const nextChar = input[i + 1];

    if (!inString) {
      // Look for string start
      if (char === '"') {
        inString = true;
        result += char;
      } else {
        result += char;
      }
      i++;
    } else {
      // Inside a string
      if (char === "\\") {
        // Escaped character - copy both chars
        result += char + (nextChar || "");
        i += 2;
      } else if (char === '"') {
        // Check if this quote ends the string or is an unescaped quote in the middle
        // Peek ahead: if next non-whitespace is not a JSON delimiter, it's likely unescaped
        const afterQuote = input.slice(i + 1);
        const trimmedAfter = afterQuote.trimStart();
        const firstCharAfter = trimmedAfter[0];
        
        // Valid JSON after a closing quote: , } ] : or end of string
        const isValidEnding = !firstCharAfter || /^[,}\]:]/.test(firstCharAfter);
        
        if (isValidEnding) {
          // This is a proper closing quote
          inString = false;
          result += char;
        } else {
          // This quote is inside the string value - escape it
          result += '\\"';
          fixed = true;
        }
        i++;
      } else if (char === "\n" || char === "\r") {
        // Newline inside string should be escaped
        result += "\\n";
        if (char === "\r" && nextChar === "\n") i++; // skip \r\n as one
        i++;
        fixed = true;
      } else {
        result += char;
        i++;
      }
    }
  }

  return { result, fixed };
};

// Clean and fix common JSON issues
const cleanJsonText = (input: string): { cleaned: string; fixes: string[] } => {
  const fixes: string[] = [];
  let cleaned = input.trim();

  // Remove surrounding quotes if pasted as string
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1);
    cleaned = cleaned.replace(/\\"/g, '"').replace(/\\'/g, "'");
    fixes.push("Guillemets englobants supprimés");
  }

  // Normalize line endings
  const lineEndBefore = cleaned;
  cleaned = cleaned.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (lineEndBefore !== cleaned) fixes.push("Retours ligne normalisés");

  // Remove invisible control characters that break JSON parsing (often from PDF/Notion copy)
  // Keep: \n, \t. Remove: other ASCII control chars + unicode line separators.
  const ctrlBefore = cleaned;
  cleaned = cleaned
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, " ")
    .replace(/\u2028|\u2029/g, "\n")
    .replace(/\u00A0/g, " "); // nbsp
  if (ctrlBefore !== cleaned) fixes.push("Caractères invisibles supprimés");

  // Replace smart/curly quotes with straight quotes
  const smartQuotesBefore = cleaned;
  cleaned = cleaned
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/«/g, '"')
    .replace(/»/g, '"');
  if (smartQuotesBefore !== cleaned) fixes.push("Guillemets typographiques convertis");

  // Replace fancy dashes with regular ones
  const dashesBefore = cleaned;
  cleaned = cleaned.replace(/[—–]/g, "-");
  if (dashesBefore !== cleaned) fixes.push("Tirets longs convertis");

  // Best-effort: remove trailing commas
  const trailingBefore = cleaned;
  cleaned = cleaned.replace(/,\s*([\]}])/g, "$1");
  if (trailingBefore !== cleaned) fixes.push("Virgules finales supprimées");

  // Escape unescaped quotes inside string values
  const { result: quotesEscaped, fixed: quotesFixed } = escapeQuotesInStrings(cleaned);
  if (quotesFixed) {
    cleaned = quotesEscaped;
    fixes.push("Guillemets échappés automatiquement");
  }

  // Robust repair pass (handles lots of common non-strict JSON issues)
  try {
    const repaired = jsonrepair(cleaned);
    if (repaired !== cleaned) fixes.push("JSON réparé automatiquement");
    cleaned = repaired;
  } catch {
    // keep original cleaned; parse step will display detailed error
  }

  return { cleaned, fixes };
};
 
export function JsonImport({ open, onOpenChange, onImport }: JsonImportProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [parsedItems, setParsedItems] = useState<JsonItem[] | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [cleaningFixes, setCleaningFixes] = useState<string[]>([]);
 

  const handleClean = () => {
    if (!jsonInput.trim()) {
      toast.error("Collez d'abord du JSON à nettoyer");
      return;
    }

    const { cleaned, fixes } = cleanJsonText(jsonInput);
    setJsonInput(cleaned);
    setCleaningFixes(fixes);
    setParsedItems(null);
    setParseError(null);

    if (fixes.length > 0) toast.success(`${fixes.length} correction(s) appliquée(s)`);
    else toast.info("Aucune correction nécessaire");
  };

  const handleParse = () => {
    setParseError(null);
    setParsedItems(null);

    if (!jsonInput.trim()) {
      setParseError("Veuillez coller du JSON");
      return;
    }

    const { cleaned, fixes } = cleanJsonText(jsonInput);
    setCleaningFixes(fixes);

    try {
      const data = JSON.parse(cleaned);

      // Support both array and object with items property
      let items: JsonItem[];
      if (Array.isArray(data)) {
        items = data;
      } else if (data.items && Array.isArray(data.items)) {
        items = data.items;
      } else {
        setParseError("Format invalide. Attendu: un tableau ou un objet avec une propriété 'items'");
        return;
      }

      const validItems = items.filter((item) => item.title && typeof item.title === "string");
      if (validItems.length === 0) {
        setParseError("Aucun article valide trouvé. Chaque article doit avoir un 'title'");
        return;
      }

      if (validItems.length !== items.length) {
        toast.warning(`${items.length - validItems.length} article(s) ignoré(s) car sans titre`);
      }

      const normalizedItems = validItems.map((item) => ({
        ...item,
        content_md: item.content_md || item.paragraphe || undefined,
        image_url: item.image_url || undefined,
        video_url: item.video_url || undefined,
        url: item.url || undefined,
      }));

      setParsedItems(normalizedItems);
    } catch (e: any) {
      const msg = typeof e?.message === "string" ? e.message : "Erreur JSON";

      // Provide context around the error when possible
      const match = msg.match(/position\s+(\d+)/i);
      if (match) {
        const pos = Number(match[1]);
        const start = Math.max(0, pos - 30);
        const end = Math.min(cleaned.length, pos + 30);
        const context = cleaned.slice(start, end).replace(/\n/g, "\\n");
        setParseError(`JSON invalide: ${msg}\n…${context}…`);
      } else {
        setParseError(`JSON invalide: ${msg}`);
      }

      console.error("JSON parse error:", e);
    }
  };
 
   const handleImport = async () => {
     if (!parsedItems) return;
 
     setIsImporting(true);
     try {
       await onImport(parsedItems);
       toast.success(`${parsedItems.length} article(s) importé(s)`);
       handleClose();
     } catch (error) {
       toast.error("Erreur lors de l'import");
     } finally {
       setIsImporting(false);
     }
   };
 
  const handleClose = () => {
    setJsonInput("");
    setParsedItems(null);
    setParseError(null);
    setCleaningFixes([]);
    onOpenChange(false);
  };
 
   const exampleJson = `[
   {
     "title": "Titre de l'article",
     "url": "https://example.com/article",
     "source": "Example News",
     "snippet": "Résumé de l'article...",
    "paragraphe": "Contenu complet de l'article affiché quand on l'ouvre...",
     "tags": ["Tech", "AI"],
     "image_url": "https://example.com/image.jpg",
     "video_url": "https://youtube.com/watch?v=...",
     "read_time_minutes": 3
   }
 ]`;
 
   return (
     <Dialog open={open} onOpenChange={handleClose}>
       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
         <DialogHeader>
           <DialogTitle className="flex items-center gap-2">
             <FileJson className="h-5 w-5 text-primary" />
             Import JSON
           </DialogTitle>
           <DialogDescription>
             Importez plusieurs articles en collant du JSON. Format attendu : un tableau d'objets ou un objet avec une propriété "items".
           </DialogDescription>
         </DialogHeader>
 
         <div className="space-y-4">
           {/* JSON Input */}
            <div className="space-y-2">
              <Textarea
                placeholder="Collez votre JSON ici..."
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  setParsedItems(null);
                  setParseError(null);
                  setCleaningFixes([]);
                }}
                className="min-h-[200px] font-mono text-sm"
              />
              
              {/* Cleaning fixes feedback */}
              {cleaningFixes.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {cleaningFixes.map((fix, i) => (
                    <span 
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      <Check className="h-3 w-3" />
                      {fix}
                    </span>
                  ))}
                </div>
              )}
              
              {parseError && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {parseError}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {!parsedItems && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleClean}
                  className="flex-1"
                  disabled={!jsonInput.trim()}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Nettoyer
                </Button>
                <Button onClick={handleParse} className="flex-1" disabled={!jsonInput.trim()}>
                  Analyser le JSON
                </Button>
              </div>
            )}
 
           {/* Preview */}
           {parsedItems && (
             <div className="space-y-3">
               <div className="flex items-center gap-2 text-primary">
                 <Check className="h-5 w-5" />
                 <span className="font-medium">{parsedItems.length} article(s) prêt(s) à importer</span>
               </div>
 
               <div className="border rounded-xl overflow-hidden max-h-[200px] overflow-y-auto">
                 {parsedItems.map((item, index) => (
                   <div
                     key={index}
                     className="p-3 border-b last:border-b-0 bg-muted/30"
                   >
                     <p className="font-medium text-foreground line-clamp-1">
                       {index + 1}. {item.title}
                     </p>
                     <p className="text-sm text-muted-foreground">
                       {item.source || "Source non spécifiée"}
                       {item.url && " • "}
                       {item.url && (
                        <span className="text-accent-foreground">{new URL(item.url).hostname}</span>
                       )}
                       {item.video_url && " • 🎬 Vidéo"}
                     </p>
                   </div>
                 ))}
               </div>
 
               <div className="flex gap-3">
                 <Button
                   variant="outline"
                   onClick={() => {
                     setParsedItems(null);
                     setParseError(null);
                   }}
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
               Voir un exemple de format JSON
             </summary>
             <pre className="mt-2 p-3 bg-muted rounded-lg overflow-x-auto text-xs">
               {exampleJson}
             </pre>
           </details>
         </div>
       </DialogContent>
     </Dialog>
   );
 }
