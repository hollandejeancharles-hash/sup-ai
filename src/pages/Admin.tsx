import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Send,
  Loader2,
  FileText,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Calendar,
  ChevronRight,
  GripVertical,
  FileJson,
  AlignLeft,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDigests,
  useDigestItems,
  useCreateDigest,
  useUpdateDigest,
  useDeleteDigest,
  usePublishDigest,
  useUnpublishDigest,
  useCreateItem,
  useUpdateItem,
  useDeleteItem,
  useToggleItemPublish,
  type Digest,
  type Item,
} from "@/hooks/useDigests";
import { ItemForm } from "@/components/admin/ItemForm";
import { JsonImport } from "@/components/admin/JsonImport";
import { TextImport } from "@/components/admin/TextImport";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Admin() {
  const navigate = useNavigate();
  const [selectedDigest, setSelectedDigest] = useState<Digest | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [newDigestDate, setNewDigestDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showNewDigest, setShowNewDigest] = useState(false);
  const [showJsonImport, setShowJsonImport] = useState(false);
  const [showTextImport, setShowTextImport] = useState(false);

  // Queries
  const { data: digests, isLoading: loadingDigests } = useDigests();
  const { data: items, isLoading: loadingItems } = useDigestItems(
    selectedDigest?.id
  );

  // Mutations
  const createDigest = useCreateDigest();
  const updateDigest = useUpdateDigest();
  const deleteDigest = useDeleteDigest();
  const publishDigest = usePublishDigest();
  const unpublishDigest = useUnpublishDigest();
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();
  const toggleItemPublish = useToggleItemPublish();

  const handleCreateDigest = async () => {
    if (!newDigestDate) return;

    await createDigest.mutateAsync({
      date: newDigestDate,
      title: `Digest du ${format(new Date(newDigestDate), "d MMMM yyyy", { locale: fr })}`,
    });

    setShowNewDigest(false);
    setNewDigestDate(new Date().toISOString().split("T")[0]);
  };

  const handleSaveItem = async (data: any) => {
    if (data.id) {
      await updateItem.mutateAsync(data);
    } else {
      await createItem.mutateAsync(data);
    }
  };

  const handleDeleteItem = async (item: Item) => {
    if (!confirm("Supprimer cet article ?")) return;
    await deleteItem.mutateAsync({ id: item.id, digestId: item.digest_id });
  };

  const handleDeleteDigest = async (digest: Digest) => {
    if (!confirm("Supprimer ce digest et tous ses articles ?")) return;
    await deleteDigest.mutateAsync(digest.id);
    if (selectedDigest?.id === digest.id) {
      setSelectedDigest(null);
    }
  };

  const handleTogglePublish = async (digest: Digest) => {
    if (digest.published_at) {
      await unpublishDigest.mutateAsync(digest.id);
    } else {
      await publishDigest.mutateAsync(digest.id);
    }
  };

   const handleJsonImport = async (items: any[]) => {
     if (!selectedDigest) return;
 
     const startRank = (items?.length || 0) + 1;
 
     // Create items one by one to preserve order
     for (let i = 0; i < items.length; i++) {
       const item = items[i];
       await createItem.mutateAsync({
         digest_id: selectedDigest.id,
         title: item.title,
         url: item.url || null,
         source: item.source || (item.url ? new URL(item.url).hostname.replace(/^www\./, "") : null),
         snippet: item.snippet || null,
         tags: item.tags || [],
         image_url: item.image_url || null,
         content_md: item.content_md || null,
         video_url: item.video_url || null,
         read_time_minutes: item.read_time_minutes || 2,
         rank: startRank + i,
       });
     }
   };
 
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background border-b border-hairline">
        <div className="container px-4">
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
      </div>

      <div className="container px-4 py-6">
        <Tabs defaultValue="digests" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="digests" className="flex-1">
              Digests
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex-1" disabled={!selectedDigest}>
              Articles {selectedDigest && `(${items?.length || 0})`}
            </TabsTrigger>
          </TabsList>

          {/* Digests Tab */}
          <TabsContent value="digests" className="space-y-4">
            {/* Create New Digest */}
            {showNewDigest ? (
              <div className="bg-card rounded-card shadow-card p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Input
                    type="date"
                    value={newDigestDate}
                    onChange={(e) => setNewDigestDate(e.target.value)}
                    className="flex-1 h-12 rounded-xl"
                  />
                  <Button
                    onClick={handleCreateDigest}
                    disabled={createDigest.isPending}
                    className="h-12 rounded-xl"
                  >
                    {createDigest.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Créer"
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowNewDigest(false)}
                    className="h-12"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setShowNewDigest(true)}
                variant="outline"
                className="w-full h-14 rounded-xl border-dashed border-2"
              >
                <Plus className="mr-2 h-5 w-5" />
                Nouveau Digest
              </Button>
            )}

            {/* Digests List */}
            {loadingDigests ? (
              <div className="py-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              </div>
            ) : digests?.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-h2 text-foreground mb-2">Aucun digest</h2>
                <p className="text-body text-muted-foreground">
                  Crée ton premier digest pour commencer.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {digests?.map((digest) => (
                  <div
                    key={digest.id}
                    className={cn(
                      "bg-card rounded-card shadow-card p-4 transition-all",
                      selectedDigest?.id === digest.id && "ring-2 ring-primary"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setSelectedDigest(digest)}
                        className="flex-1 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-3 h-3 rounded-full",
                              digest.published_at ? "bg-green-500" : "bg-muted"
                            )}
                          />
                          <div>
                            <p className="text-body font-medium text-foreground">
                              {format(new Date(digest.date), "EEEE d MMMM", {
                                locale: fr,
                              })}
                            </p>
                            <p className="text-small text-muted-foreground">
                              {digest.published_at
                                ? `Publié le ${format(new Date(digest.published_at), "d MMM à HH:mm", { locale: fr })}`
                                : "Brouillon"}
                            </p>
                          </div>
                        </div>
                      </button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleTogglePublish(digest)}
                          disabled={publishDigest.isPending || unpublishDigest.isPending}
                          className="touch-target"
                        >
                          {digest.published_at ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteDigest(digest)}
                          disabled={deleteDigest.isPending}
                          className="touch-target text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-4">
            {selectedDigest && (
              <>
                {/* Digest Info */}
                <div className="bg-secondary/50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-body font-medium text-foreground">
                        {format(new Date(selectedDigest.date), "EEEE d MMMM yyyy", {
                          locale: fr,
                        })}
                      </p>
                      <p
                        className={cn(
                          "text-small",
                          selectedDigest.published_at
                            ? "text-green-600"
                            : "text-muted-foreground"
                        )}
                      >
                        {selectedDigest.published_at ? "✓ Publié" : "Brouillon"}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleTogglePublish(selectedDigest)}
                      variant={selectedDigest.published_at ? "outline" : "default"}
                      className="rounded-full"
                      disabled={publishDigest.isPending || unpublishDigest.isPending}
                    >
                      {publishDigest.isPending || unpublishDigest.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : selectedDigest.published_at ? (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Dépublier
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Publier
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Add Article Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={() => {
                      setEditingItem(null);
                      setShowItemForm(true);
                    }}
                    variant="outline"
                    className="h-14 rounded-xl border-dashed border-2 flex flex-col gap-0.5"
                  >
                    <Plus className="h-5 w-5" />
                    <span className="text-xs">Manuel</span>
                  </Button>
                  <Button
                    onClick={() => setShowJsonImport(true)}
                    variant="outline"
                    className="h-14 rounded-xl border-dashed border-2 flex flex-col gap-0.5"
                  >
                    <FileJson className="h-5 w-5" />
                    <span className="text-xs">JSON</span>
                  </Button>
                  <Button
                    onClick={() => setShowTextImport(true)}
                    variant="outline"
                    className="h-14 rounded-xl border-dashed border-2 flex flex-col gap-0.5"
                  >
                    <AlignLeft className="h-5 w-5" />
                    <span className="text-xs">Texte</span>
                  </Button>
                </div>

                {/* Articles List */}
                {loadingItems ? (
                  <div className="py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                  </div>
                ) : items?.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-body text-muted-foreground">
                      Aucun article dans ce digest.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items?.map((item, index) => {
                      const isPublished = (item as any).is_published !== false;
                      const isBreaking = (item as any).is_breaking === true;
                      
                      return (
                        <div
                          key={item.id}
                          className={cn(
                            "bg-card rounded-card shadow-card p-4 flex gap-3",
                            !isPublished && "opacity-50"
                          )}
                        >
                          <div className="flex items-center text-muted-foreground">
                            <GripVertical className="h-5 w-5" />
                          </div>

                          {/* Thumbnail */}
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0 relative">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                            )}
                            {isBreaking && (
                              <div className="absolute top-1 left-1 bg-primary text-primary-foreground rounded-full p-1">
                                <Zap className="h-3 w-3" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-body font-medium text-foreground line-clamp-2">
                              {item.title}
                            </p>
                            <p className="text-small text-muted-foreground">
                              {item.source} • {item.read_time_minutes} min
                              {(item as any).video_url && " • 🎬"}
                              {isBreaking && " • ⚡ Breaking"}
                              {!isPublished && " • 🔒 Masqué"}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleItemPublish.mutate({
                                id: item.id,
                                isPublished: !isPublished
                              })}
                              disabled={toggleItemPublish.isPending}
                              className="touch-target"
                              title={isPublished ? "Masquer" : "Publier"}
                            >
                              {isPublished ? (
                                <Eye className="h-4 w-4 text-green-600" />
                              ) : (
                                <EyeOff className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingItem(item);
                                setShowItemForm(true);
                              }}
                              className="touch-target"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteItem(item)}
                              className="touch-target text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Item Form Sheet */}
                <ItemForm
                  open={showItemForm}
                  onOpenChange={setShowItemForm}
                  item={editingItem}
                  digestId={selectedDigest.id}
                  onSave={handleSaveItem}
                  nextRank={(items?.length || 0) + 1}
                />
 
               {/* JSON Import Dialog */}
               <JsonImport
                 open={showJsonImport}
                 onOpenChange={setShowJsonImport}
                 onImport={handleJsonImport}
               />
               
               {/* Text Import Dialog */}
               <TextImport
                 open={showTextImport}
                 onOpenChange={setShowTextImport}
                 onImport={handleJsonImport}
               />
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}