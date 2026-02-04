import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type PendingAction = {
  type: string;
  label: string;
  execute: () => void | Promise<void>;
};

interface AuthSheetContextType {
  isOpen: boolean;
  pendingAction: PendingAction | null;
  openAuthSheet: (action?: PendingAction) => void;
  closeAuthSheet: () => void;
  executePendingAction: () => void;
}

const AuthSheetContext = createContext<AuthSheetContextType | undefined>(undefined);

export function AuthSheetProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const openAuthSheet = useCallback((action?: PendingAction) => {
    setPendingAction(action || null);
    setIsOpen(true);
  }, []);

  const closeAuthSheet = useCallback(() => {
    setIsOpen(false);
    // Keep pending action available for a moment after close
  }, []);

  const executePendingAction = useCallback(() => {
    if (pendingAction) {
      pendingAction.execute();
      setPendingAction(null);
    }
  }, [pendingAction]);

  return (
    <AuthSheetContext.Provider
      value={{
        isOpen,
        pendingAction,
        openAuthSheet,
        closeAuthSheet,
        executePendingAction,
      }}
    >
      {children}
    </AuthSheetContext.Provider>
  );
}

export function useAuthSheet() {
  const context = useContext(AuthSheetContext);
  if (context === undefined) {
    throw new Error("useAuthSheet must be used within an AuthSheetProvider");
  }
  return context;
}

