import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Shield, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export default function AdminAuth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          setError("Email ou mot de passe incorrect.");
        } else if (authError.message.includes("rate limit")) {
          setError("Trop de tentatives. Réessaie dans quelques minutes.");
        } else {
          setError("Une erreur est survenue. Réessaie.");
        }
        console.error("Auth error:", authError);
        return;
      }

      if (data.session) {
        // Check if user is admin
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (roleError || !roleData) {
          await supabase.auth.signOut();
          setError("Accès refusé. Ce compte n'a pas les droits admin.");
          return;
        }

        toast.success("Connexion réussie !");
        navigate("/admin", { replace: true });
      }
    } catch (err) {
      setError("Une erreur est survenue. Réessaie.");
      console.error("Auth exception:", err);
    } finally {
      setLoading(false);
    }
  };

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
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="h-12 rounded-xl text-body pr-12"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors touch-target"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {error && (
              <p className="text-small text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={loading || !email || !password}
              className="w-full rounded-full h-12 text-body font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
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
