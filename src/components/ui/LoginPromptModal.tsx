import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LoginPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action?: string;
}

export function LoginPromptModal({ 
  open, 
  onOpenChange, 
  action = "cette fonctionnalité" 
}: LoginPromptModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-4 rounded-card">
        <DialogHeader className="text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <LogIn className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-h2 text-foreground">
            Connexion requise
          </DialogTitle>
          <DialogDescription className="text-body text-muted-foreground">
            Connecte-toi pour accéder à {action}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-4">
          <Button asChild className="w-full rounded-full">
            <Link to="/auth" onClick={() => onOpenChange(false)}>
              Se connecter par email
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="w-full rounded-full"
          >
            Continuer à lire
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
