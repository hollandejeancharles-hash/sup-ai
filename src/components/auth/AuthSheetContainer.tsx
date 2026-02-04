import { useEffect } from "react";
import { AuthSheet } from "./AuthSheet";
import { useAuthSheet } from "@/contexts/AuthSheetContext";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function AuthSheetContainer() {
  const { isOpen, pendingAction, closeAuthSheet, executePendingAction } = useAuthSheet();
  const { user, loading } = useAuth();

  // When user becomes authenticated and there's a pending action, execute it
  useEffect(() => {
    if (user && pendingAction && !loading) {
      closeAuthSheet();
      
      // Small delay to let the sheet close animation finish
      setTimeout(() => {
        executePendingAction();
        
        // Show success toast based on action type
        if (pendingAction.type === "bookmark") {
          toast.success("Ajouté aux favoris");
        } else if (pendingAction.type === "notifications") {
          toast.success("Notifications activées");
        } else {
          toast.success("Action effectuée");
        }
      }, 300);
    }
  }, [user, pendingAction, loading, closeAuthSheet, executePendingAction]);

  return (
    <AuthSheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeAuthSheet();
      }}
      pendingAction={pendingAction?.label}
    />
  );
}
