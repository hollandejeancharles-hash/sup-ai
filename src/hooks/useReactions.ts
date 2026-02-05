 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 import { useAuth } from "./useAuth";
 
 export const REACTION_EMOJIS = ["👍", "🔥", "💡", "❤️", "🎯"] as const;
 export type ReactionEmoji = (typeof REACTION_EMOJIS)[number];
 
 interface ReactionCount {
   emoji: ReactionEmoji;
   count: number;
   hasReacted: boolean;
 }
 
 export function useReactions(itemId: string | undefined) {
   const { user } = useAuth();
   const queryClient = useQueryClient();
 
   // Fetch reaction counts for an item
   const reactionsQuery = useQuery({
     queryKey: ["reactions", itemId],
     queryFn: async (): Promise<ReactionCount[]> => {
       if (!itemId) return [];
 
       // Get all reactions for this item
       const { data: allReactions, error } = await supabase
         .from("article_reactions")
         .select("emoji, user_id")
         .eq("item_id", itemId);
 
       if (error) throw error;
 
       // Count reactions per emoji and check if current user reacted
       const counts: Record<ReactionEmoji, { count: number; hasReacted: boolean }> = {
         "👍": { count: 0, hasReacted: false },
         "🔥": { count: 0, hasReacted: false },
         "💡": { count: 0, hasReacted: false },
         "❤️": { count: 0, hasReacted: false },
         "🎯": { count: 0, hasReacted: false },
       };
 
       allReactions?.forEach((r) => {
         const emoji = r.emoji as ReactionEmoji;
         if (counts[emoji]) {
           counts[emoji].count++;
           if (user?.id && r.user_id === user.id) {
             counts[emoji].hasReacted = true;
           }
         }
       });
 
       return REACTION_EMOJIS.map((emoji) => ({
         emoji,
         count: counts[emoji].count,
         hasReacted: counts[emoji].hasReacted,
       }));
     },
     enabled: !!itemId,
   });
 
   // Toggle a reaction
   const toggleReaction = useMutation({
     mutationFn: async (emoji: ReactionEmoji) => {
       if (!itemId || !user?.id) throw new Error("Not authenticated");
 
       // Check if reaction exists
       const { data: existing } = await supabase
         .from("article_reactions")
         .select("id")
         .eq("item_id", itemId)
         .eq("user_id", user.id)
         .eq("emoji", emoji)
         .maybeSingle();
 
       if (existing) {
         // Remove reaction
         await supabase
           .from("article_reactions")
           .delete()
           .eq("id", existing.id);
       } else {
         // Add reaction
         await supabase.from("article_reactions").insert({
           item_id: itemId,
           user_id: user.id,
           emoji,
         });
       }
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["reactions", itemId] });
     },
   });
 
   return {
     reactions: reactionsQuery.data ?? [],
     isLoading: reactionsQuery.isLoading,
     toggleReaction: toggleReaction.mutate,
     isToggling: toggleReaction.isPending,
   };
 }