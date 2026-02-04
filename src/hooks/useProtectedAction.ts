import { useCallback } from "react";
import { useAuth } from "./useAuth";
import { useAuthSheet } from "@/contexts/AuthSheetContext";

interface ProtectedActionOptions {
  actionLabel: string;
  actionType: string;
}

export function useProtectedAction() {
  const { user } = useAuth();
  const { openAuthSheet } = useAuthSheet();

  const executeProtected = useCallback(
    (action: () => void | Promise<void>, options: ProtectedActionOptions) => {
      if (user) {
        // User is authenticated, execute immediately
        action();
      } else {
        // User is not authenticated, open auth sheet with pending action
        openAuthSheet({
          type: options.actionType,
          label: options.actionLabel,
          execute: action,
        });
      }
    },
    [user, openAuthSheet]
  );

  return { executeProtected, isAuthenticated: !!user };
}
