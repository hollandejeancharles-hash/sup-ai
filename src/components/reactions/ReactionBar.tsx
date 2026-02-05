 import { cn } from "@/lib/utils";
 import { useReactions, REACTION_EMOJIS, ReactionEmoji } from "@/hooks/useReactions";
 import { useProtectedAction } from "@/hooks/useProtectedAction";
 import { Skeleton } from "@/components/ui/skeleton";
 
 interface ReactionBarProps {
   itemId: string;
   className?: string;
 }
 
 export function ReactionBar({ itemId, className }: ReactionBarProps) {
   const { reactions, isLoading, toggleReaction, isToggling } = useReactions(itemId);
   const { executeProtected } = useProtectedAction();
 
   const handleReaction = (emoji: ReactionEmoji) => {
     executeProtected(
       () => toggleReaction(emoji),
       { actionType: "reaction", actionLabel: "réagir à cet article" }
     );
   };
 
   if (isLoading) {
     return (
       <div className={cn("flex gap-2", className)}>
         {REACTION_EMOJIS.map((emoji) => (
           <Skeleton key={emoji} className="h-10 w-14 rounded-full" />
         ))}
       </div>
     );
   }
 
   return (
     <div className={cn("flex gap-2 flex-wrap", className)}>
       {reactions.map(({ emoji, count, hasReacted }) => (
         <button
           key={emoji}
           onClick={() => handleReaction(emoji)}
           disabled={isToggling}
           className={cn(
             "flex items-center gap-1.5 px-3 py-2 rounded-full text-meta font-medium transition-all",
             "touch-target min-h-[40px]",
             hasReacted
               ? "bg-primary/15 text-primary ring-1 ring-primary/30"
               : "bg-secondary text-muted-foreground hover:bg-secondary/80",
             isToggling && "opacity-50 cursor-not-allowed"
           )}
         >
           <span className="text-lg">{emoji}</span>
           {count > 0 && <span className="text-small">{count}</span>}
         </button>
       ))}
     </div>
   );
 }