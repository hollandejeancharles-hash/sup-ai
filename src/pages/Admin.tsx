import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Send, Loader2, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { parseRawInput, ParsedItem } from "@/lib/digestParser";
import { BreakingCard } from "@/components/cards/BreakingCard";
import { ArticleCard } from "@/components/cards/ArticleCard";

export default function Admin() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [title, setTitle] = useState("");
  const [rawInput, setRawInput] = useState("");
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if not admin (for now just show warning)
  // In production, this would check against the database

  const handlePreview = () => {
    if (!rawInput.trim()) {
      toast.error("Ajoute du contenu d'abord");
      return;
    }

    const items = parseRawInput(rawInput);
    setParsedItems(items);
    setIsPreview(true);
    toast.success(`${items.length} items détectés`);
  };

  const handlePublish = async () => {
    if (parsedItems.length === 0) {
      toast.error("Fais un preview d'abord");
      return;
    }

    setLoading(true);
    // Simulate publishing - in production this would hit the database
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    toast.success("Digest publié !");
    
    // Reset form
    setRawInput("");
    setParsedItems([]);
    setIsPreview(false);
  };

  const removeItem = (index: number) => {
    setParsedItems(parsedItems.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container px-4 pt-safe border-b border-hairline">
        <div className="flex items-center justify-between py-4">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 text-muted-foreground touch-target"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-body">Back</span>
          </button>
          <h1 className="text-body font-semibold text-foreground">Admin</h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="container px-4 py-6">
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="create" className="flex-1">Create Digest</TabsTrigger>
            <TabsTrigger value="manage" className="flex-1">Manage</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            {!isPreview ? (
              <>
                {/* Date Input */}
                <div>
                  <label className="text-meta font-medium text-foreground block mb-2">
                    Date
                  </label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>

                {/* Title Input */}
                <div>
                  <label className="text-meta font-medium text-foreground block mb-2">
                    Title (optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="Daily AI Digest"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>

                {/* Raw Input */}
                <div>
                  <label className="text-meta font-medium text-foreground block mb-2">
                    Raw Input
                  </label>
                  <p className="text-small text-muted-foreground mb-2">
                    Colle du JSON, Markdown ou texte brut. L'app formate automatiquement.
                  </p>
                  <Textarea
                    placeholder={`Exemples de formats acceptés:

JSON: {"items": [...]}

Markdown:
## Section
- Item 1 https://example.com
- Item 2

Texte brut:
• OpenAI announces GPT-5
  https://techcrunch.com/gpt5
  
• EU passes new AI regulations
  https://reuters.com/ai-act`}
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    className="min-h-[300px] rounded-xl font-mono text-meta"
                  />
                </div>

                {/* Preview Button */}
                <Button
                  onClick={handlePreview}
                  size="lg"
                  className="w-full rounded-full h-12"
                  disabled={!rawInput.trim()}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              </>
            ) : (
              <>
                {/* Preview Mode */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-h2 text-foreground">Preview</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPreview(false)}
                  >
                    Edit
                  </Button>
                </div>

                {/* Breaking Preview */}
                <section className="mb-6">
                  <h3 className="text-body font-semibold text-muted-foreground mb-3">
                    Breaking ({Math.min(3, parsedItems.length)})
                  </h3>
                  <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
                    {parsedItems.slice(0, 3).map((item, index) => (
                      <div key={index} className="relative">
                        <BreakingCard
                          id={`preview-${index}`}
                          title={item.title}
                          source={item.source}
                          imageUrl={item.image_url}
                          tags={item.tags}
                          readTime={item.read_time_minutes}
                        />
                        <button
                          onClick={() => removeItem(index)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive flex items-center justify-center"
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Recommendations Preview */}
                {parsedItems.length > 3 && (
                  <section className="mb-6">
                    <h3 className="text-body font-semibold text-muted-foreground mb-3">
                      Recommendations ({parsedItems.length - 3})
                    </h3>
                    <div className="space-y-3">
                      {parsedItems.slice(3).map((item, index) => (
                        <div key={index + 3} className="relative">
                          <ArticleCard
                            id={`preview-${index + 3}`}
                            title={item.title}
                            source={item.source}
                            snippet={item.snippet}
                            imageUrl={item.image_url}
                            readTime={item.read_time_minutes}
                          />
                          <button
                            onClick={() => removeItem(index + 3)}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive flex items-center justify-center"
                          >
                            <Trash2 className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Publish Button */}
                <Button
                  onClick={handlePublish}
                  size="lg"
                  className="w-full rounded-full h-12"
                  disabled={loading || parsedItems.length === 0}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Publish Digest
                    </>
                  )}
                </Button>
              </>
            )}
          </TabsContent>

          <TabsContent value="manage">
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-h2 text-foreground mb-2">No digests yet</h2>
              <p className="text-body text-muted-foreground">
                Create your first digest to see it here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
