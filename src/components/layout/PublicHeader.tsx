import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PublicHeaderProps {
  title: string;
  subtitle?: string;
}

export function PublicHeader({ title, subtitle }: PublicHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="pt-6 pb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-h1 text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-meta text-muted-foreground">{subtitle}</p>
          )}
        </div>
        
        {!user ? (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full gap-2 flex-shrink-0"
          >
            <Link to="/auth">
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Se connecter</span>
            </Link>
          </Button>
        ) : (
          <Link
            to="/profile"
            className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center touch-target"
          >
            <User className="h-4 w-4 text-primary" />
          </Link>
        )}
      </div>
    </header>
  );
}
