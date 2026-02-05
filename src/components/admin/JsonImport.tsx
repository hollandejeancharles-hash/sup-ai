 import { useState } from "react";
 import { Upload, FileJson, Loader2, Check, AlertCircle } from "lucide-react";
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
 
 export function JsonImport({ open, onOpenChange, onImport }: JsonImportProps) {
   const [jsonInput, setJsonInput] = useState("");
   const [parsedItems, setParsedItems] = useState<JsonItem[] | null>(null);
   const [parseError, setParseError] = useState<string | null>(null);
   const [isImporting, setIsImporting] = useState(false);
 
  // Try to fix common JSON issues like unescaped quotes in strings
  const tryFixJson = (input: string): string => {
    // First, try parsing as-is
    try {
      JSON.parse(input);
      return input;
    } catch {
      // Try to fix unescaped quotes within string values
      // This regex finds string values and escapes internal quotes
      let fixed = input;
      
      // Replace smart/curly quotes with straight quotes first
      fixed = fixed
        .replace(/"/g, '"')
        .replace(/"/g, '"')
        .replace(/'/g, "'")
        .replace(/'/g, "'");
      
      // Try to fix unescaped quotes in string values
      // Match content between property value quotes, handling multi-line
      fixed = fixed.replace(
        /:\s*"([\s\S]*?)(?<!\\)"\s*([,}\]])/g,
        (match, content, ending) => {
          // Escape any unescaped quotes inside the content
          // But preserve already escaped ones
          const escapedContent = content
            .replace(/(?<!\\)"/g, '\\"');
          return `: "${escapedContent}"${ending}`;
        }
      );
      
      return fixed;
    }
  };

  const handleParse = () => {
    setParseError(null);
    setParsedItems(null);

    let input = jsonInput.trim();
    
    if (!input) {
      setParseError("Veuillez coller du JSON");
      return;
    }

    // Remove surrounding quotes if the JSON was pasted as a string
    if ((input.startsWith('"') && input.endsWith('"')) || 
        (input.startsWith("'") && input.endsWith("'"))) {
      input = input.slice(1, -1);
      input = input.replace(/\\"/g, '"').replace(/\\'/g, "'");
    }

    // Try to fix common JSON issues
    input = tryFixJson(input);

    try {
      const data = JSON.parse(input);

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

      // Validate each item has at least a title
      const validItems = items.filter((item) => item.title && typeof item.title === "string");

      if (validItems.length === 0) {
        setParseError("Aucun article valide trouvé. Chaque article doit avoir un 'title'");
        return;
      }

      if (validItems.length !== items.length) {
        toast.warning(`${items.length - validItems.length} article(s) ignoré(s) car sans titre`);
      }

      // Normalize items: map "paragraphe" to "content_md" and clean empty strings
      const normalizedItems = validItems.map((item) => ({
        ...item,
        content_md: item.content_md || item.paragraphe || undefined,
        image_url: item.image_url || undefined,
        video_url: item.video_url || undefined,
        url: item.url || undefined,
      }));

      setParsedItems(normalizedItems);
    } catch (e) {
      console.error("JSON parse error:", e);
      setParseError(
        'JSON invalide. Vérifiez que les guillemets dans le texte sont échappés (ex: \\"texte\\") ou utilisez des apostrophes.'
      );
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
               }}
               className="min-h-[200px] font-mono text-sm"
             />
             
             {parseError && (
               <div className="flex items-center gap-2 text-destructive text-sm">
                 <AlertCircle className="h-4 w-4" />
                 {parseError}
               </div>
             )}
           </div>
 
           {/* Parse Button */}
           {!parsedItems && (
             <Button onClick={handleParse} className="w-full">
               Analyser le JSON
             </Button>
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