import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().email("Adresse email invalide");

export default function AdminAuth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/admin`,
        },
      });

      if (authError) {
        if (authError.message.includes("rate limit")) {
          setError("Trop de tentatives. Réessaie dans quelques minutes.");
        } else {
          setError("Une erreur est survenue. Réessaie.");
        }
        console.error("Auth error:", authError);
      } else {
        setSent(true);
        toast.success("Email envoyé !");
      }
    } catch (err) {
      setError("Une erreur est survenue. Réessaie.");
      console.error("Auth exception:", err);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="container px-4 pt-safe">
          <button
            onClick={() => setSent(false)}
            className="flex items-center gap-2 py-4 text-muted-foreground touch-target"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-body">Retour</span>
          </button>
        </div>

        <div className="flex-1 container px-4 flex flex-col items-center justify-center pb-20">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-h2 text-foreground text-center mb-3">
            Vérifie tes emails
          </h1>
          <p className="text-body text-muted-foreground text-center max-w-sm mb-6">
            On t'a envoyé un lien de connexion admin à{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
          <p className="text-meta text-muted-foreground text-center">
            Clique sur le lien dans l'email pour accéder à l'admin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="container px-4 pt-safe">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 py-4 text-muted-foreground touch-target"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-body">Retour</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 container px-4 flex flex-col justify-center pb-20">
        <div className="max-w-sm mx-auto w-full">
          {/* Admin Badge */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <span className="text-meta font-medium text-primary">Admin</span>
          </div>

          <h1 className="text-h1 text-foreground mb-2">Connexion Admin</h1>
          <p className="text-body text-muted-foreground mb-8">
            Accès réservé aux administrateurs.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="admin@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="h-12 rounded-xl text-body"
                autoComplete="email"
                autoFocus
              />
              {error && (
                <p className="text-small text-destructive mt-2">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading || !email}
              className="w-full rounded-full h-12 text-body font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Recevoir le lien"
              )}
            </Button>
          </form>

          <p className="text-small text-muted-foreground text-center mt-6">
            Seuls les comptes avec le rôle admin peuvent accéder au panneau.
          </p>
        </div>
      </div>
    </div>
  );
}
