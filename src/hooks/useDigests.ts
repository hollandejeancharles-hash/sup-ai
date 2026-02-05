import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Digest = Tables<"digests">;
export type Item = Tables<"items">;
export type DigestInsert = TablesInsert<"digests">;
export type ItemInsert = TablesInsert<"items">;
export type ItemUpdate = TablesUpdate<"items">;

// Fetch all digests (for admin)
export function useDigests() {
  return useQuery({
    queryKey: ["digests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("digests")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      return data as Digest[];
    },
  });
}

// Fetch published digests (for public pages)
export function usePublishedDigests() {
  return useQuery({
    queryKey: ["digests", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("digests")
        .select("*")
        .not("published_at", "is", null)
        .order("date", { ascending: false });

      if (error) throw error;
      return data as Digest[];
    },
  });
}

// Fetch latest published digest
export function useLatestDigest() {
  return useQuery({
    queryKey: ["digests", "latest"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("digests")
        .select("*")
        .not("published_at", "is", null)
        .order("date", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as Digest | null;
    },
  });
}

// Fetch items for a digest
export function useDigestItems(digestId: string | undefined) {
  return useQuery({
    queryKey: ["items", digestId],
    queryFn: async () => {
      if (!digestId) return [];
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("digest_id", digestId)
        .order("rank", { ascending: true });

      if (error) throw error;
      return data as Item[];
    },
    enabled: !!digestId,
  });
}

// Fetch items for latest published digest (for home page)
export function useLatestItems() {
  return useQuery({
    queryKey: ["items", "latest"],
    queryFn: async () => {
      // First get latest published digest
      const { data: digest, error: digestError } = await supabase
        .from("digests")
        .select("id")
        .not("published_at", "is", null)
        .order("date", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (digestError) throw digestError;
      if (!digest) return [];

      // Then get published items for that digest
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("digest_id", digest.id)
        .eq("is_published", true)
        .order("rank", { ascending: true });

      if (error) throw error;
      return data as Item[];
    },
  });
}

// Fetch breaking news items (for carousel)
export function useBreakingItems() {
  return useQuery({
    queryKey: ["items", "breaking"],
    queryFn: async () => {
      // Get latest published digest
      const { data: digest, error: digestError } = await supabase
        .from("digests")
        .select("id")
        .not("published_at", "is", null)
        .order("date", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (digestError) throw digestError;
      if (!digest) return [];

      // Get breaking items
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("digest_id", digest.id)
        .eq("is_published", true)
        .eq("is_breaking", true)
        .order("rank", { ascending: true });

      if (error) throw error;
      return data as Item[];
    },
  });
}

// Fetch regular (non-breaking) items (for feed)
export function useRegularItems() {
  return useQuery({
    queryKey: ["items", "regular"],
    queryFn: async () => {
      // Get latest published digest
      const { data: digest, error: digestError } = await supabase
        .from("digests")
        .select("id")
        .not("published_at", "is", null)
        .order("date", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (digestError) throw digestError;
      if (!digest) return [];

      // Get regular (non-breaking) items
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("digest_id", digest.id)
        .eq("is_published", true)
        .eq("is_breaking", false)
        .order("rank", { ascending: true });

      if (error) throw error;
      return data as Item[];
    },
  });
}

// Create a new digest
export function useCreateDigest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (digest: DigestInsert) => {
      const { data, error } = await supabase
        .from("digests")
        .insert(digest)
        .select()
        .single();

      if (error) throw error;
      return data as Digest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digests"] });
      toast.success("Digest créé");
    },
    onError: (error) => {
      toast.error("Erreur: " + error.message);
    },
  });
}

// Update a digest
export function useUpdateDigest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Digest>) => {
      const { data, error } = await supabase
        .from("digests")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Digest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digests"] });
      toast.success("Digest mis à jour");
    },
    onError: (error) => {
      toast.error("Erreur: " + error.message);
    },
  });
}

// Delete a digest
export function useDeleteDigest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("digests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digests"] });
      toast.success("Digest supprimé");
    },
    onError: (error) => {
      toast.error("Erreur: " + error.message);
    },
  });
}

// Publish a digest
export function usePublishDigest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("digests")
        .update({ published_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Digest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digests"] });
      toast.success("Digest publié !");
    },
    onError: (error) => {
      toast.error("Erreur: " + error.message);
    },
  });
}

// Unpublish a digest
export function useUnpublishDigest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("digests")
        .update({ published_at: null })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Digest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digests"] });
      toast.success("Digest dépublié");
    },
    onError: (error) => {
      toast.error("Erreur: " + error.message);
    },
  });
}

// Create an item
export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: ItemInsert) => {
      const { data, error } = await supabase
        .from("items")
        .insert(item)
        .select()
        .single();

      if (error) throw error;
      return data as Item;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["items", variables.digest_id] });
      queryClient.invalidateQueries({ queryKey: ["items", "latest"] });
      toast.success("Article ajouté");
    },
    onError: (error) => {
      toast.error("Erreur: " + error.message);
    },
  });
}

// Update an item
export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & ItemUpdate) => {
      const { data, error } = await supabase
        .from("items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Item;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["items", data.digest_id] });
      queryClient.invalidateQueries({ queryKey: ["items", "latest"] });
      toast.success("Article mis à jour");
    },
    onError: (error) => {
      toast.error("Erreur: " + error.message);
    },
  });
}

// Delete an item
export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, digestId }: { id: string; digestId: string }) => {
      const { error } = await supabase.from("items").delete().eq("id", id);
      if (error) throw error;
      return digestId;
    },
    onSuccess: (digestId) => {
      queryClient.invalidateQueries({ queryKey: ["items", digestId] });
      queryClient.invalidateQueries({ queryKey: ["items", "latest"] });
      toast.success("Article supprimé");
    },
    onError: (error) => {
      toast.error("Erreur: " + error.message);
    },
  });
}

// Reorder items
export function useReorderItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (items: { id: string; rank: number; digestId: string }[]) => {
      const updates = items.map(({ id, rank }) =>
        supabase.from("items").update({ rank }).eq("id", id)
      );
      await Promise.all(updates);
      return items[0]?.digestId;
    },
    onSuccess: (digestId) => {
      if (digestId) {
        queryClient.invalidateQueries({ queryKey: ["items", digestId] });
        queryClient.invalidateQueries({ queryKey: ["items", "latest"] });
        queryClient.invalidateQueries({ queryKey: ["items", "breaking"] });
        queryClient.invalidateQueries({ queryKey: ["items", "regular"] });
      }
      toast.success("Ordre mis à jour");
    },
    onError: (error) => {
      toast.error("Erreur: " + error.message);
    },
  });
}

// Toggle item publish status
export function useToggleItemPublish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const { data, error } = await supabase
        .from("items")
        .update({ is_published: isPublished })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Item;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["items", data.digest_id] });
      queryClient.invalidateQueries({ queryKey: ["items", "latest"] });
      queryClient.invalidateQueries({ queryKey: ["items", "breaking"] });
      queryClient.invalidateQueries({ queryKey: ["items", "regular"] });
      toast.success(data.is_published ? "Article publié" : "Article masqué");
    },
    onError: (error) => {
      toast.error("Erreur: " + error.message);
    },
  });
}
