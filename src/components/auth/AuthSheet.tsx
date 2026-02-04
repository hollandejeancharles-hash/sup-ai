import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().email("Adresse email invalide");

type AuthState = "idle" | "loading" | "success" | "error";

interface AuthSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  pendingAction?: string;
}

export function AuthSheet({
  open,
  onOpenChange,
  onSuccess,
  pendingAction,
}: AuthSheetProps) {
  const [email, setEmail] = useState("");
  const [authState, setAuthState] = useState<AuthState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoadingProvider("google");
    setAuthState("loading");
    setErrorMessage("");

    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/auth/callback`,
      });

      if (error) {
        setErrorMessage("Erreur de connexion avec Google");
        setAuthState("error");
      }
      // If successful, user will be redirected
    } catch {
      setErrorMessage("Une erreur est survenue");
      setAuthState("error");
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleAppleSignIn = async () => {
    setLoadingProvider("apple");
    setAuthState("loading");
    setErrorMessage("");

    try {
      const { error } = await lovable.auth.signInWithOAuth("apple", {
        redirect_uri: `${window.location.origin}/auth/callback`,
      });

      if (error) {
        setErrorMessage("Erreur de connexion avec Apple");
        setAuthState("error");
      }
      // If successful, user will be redirected
    } catch {
      setErrorMessage("Une erreur est survenue");
      setAuthState("error");
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setErrorMessage(result.error.errors[0].message);
      return;
    }

    setAuthState("loading");
    setLoadingProvider("email");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes("rate limit")) {
          setErrorMessage("Trop de tentatives. Réessaie dans quelques minutes.");
        } else {
          setErrorMessage("Une erreur est survenue. Réessaie.");
        }
        setAuthState("error");
      } else {
        setAuthState("success");
      }
    } catch {
      setErrorMessage("Une erreur est survenue. Réessaie.");
      setAuthState("error");
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after animation
    setTimeout(() => {
      setAuthState("idle");
      setEmail("");
      setErrorMessage("");
    }, 300);
  };

  const handleDismiss = () => {
    handleClose();
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-[28px] px-6 pb-safe pt-6 bg-background border-0 shadow-elevated"
      >
        {/* Handle bar */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-muted" />

        {authState === "success" ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <SheetTitle className="text-h2 text-foreground mb-2">
              Vérifie tes emails
            </SheetTitle>
            <p className="text-body text-muted-foreground mb-2">
              On t'a envoyé un lien à <span className="font-medium text-foreground">{email}</span>
            </p>
            <p className="text-meta text-muted-foreground">
              Clique dessus pour te connecter.
            </p>
          </div>
        ) : (
          <>
            <SheetHeader className="text-center mb-6">
              <SheetTitle className="text-h2 text-foreground">Continuer</SheetTitle>
              <SheetDescription className="text-body text-muted-foreground">
                {pendingAction 
                  ? `Pour ${pendingAction}, connecte-toi.`
                  : "Pour enregistrer tes articles et activer les notifications."}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-3">
              {/* Apple Sign In */}
              <Button
                variant="outline"
                className="w-full h-12 rounded-full text-body font-medium gap-3 bg-foreground text-background hover:bg-foreground/90 hover:text-background border-0"
                onClick={handleAppleSignIn}
                disabled={authState === "loading"}
              >
                {loadingProvider === "apple" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                )}
                Continuer avec Apple
              </Button>

              {/* Google Sign In */}
              <Button
                variant="outline"
                className="w-full h-12 rounded-full text-body font-medium gap-3"
                onClick={handleGoogleSignIn}
                disabled={authState === "loading"}
              >
                {loadingProvider === "google" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                Continuer avec Google
              </Button>

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-hairline" />
                </div>
                <div className="relative flex justify-center text-small">
                  <span className="bg-background px-3 text-muted-foreground">ou</span>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder="ton@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage("");
                  }}
                  className="h-12 rounded-xl text-body"
                  autoComplete="email"
                  disabled={authState === "loading"}
                />
                {errorMessage && (
                  <p className="text-small text-destructive">{errorMessage}</p>
                )}
                <Button
                  type="submit"
                  className="w-full h-12 rounded-full text-body font-semibold"
                  disabled={authState === "loading" || !email}
                >
                  {loadingProvider === "email" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    "Recevoir un lien"
                  )}
                </Button>
              </form>

              {/* Dismiss */}
              <Button
                variant="ghost"
                className="w-full h-12 rounded-full text-body text-muted-foreground"
                onClick={handleDismiss}
                disabled={authState === "loading"}
              >
                Plus tard
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
