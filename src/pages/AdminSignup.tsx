import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Shield, Eye, EyeOff, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().trim().email("Adresse email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string(),
  inviteCode: z.string().min(1, "Code d'invitation requis"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export default function AdminSignup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const result = signupSchema.safeParse({ email, password, confirmPassword, inviteCode });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      // First, verify the invite code exists and is valid
      const { data: codeData, error: codeError } = await supabase
        .from("admin_invite_codes")
        .select("id")
        .eq("code", inviteCode.trim().toUpperCase())
        .is("used_by", null)
        .maybeSingle();

      if (codeError || !codeData) {
        setError("Code d'invitation invalide ou déjà utilisé.");
        setLoading(false);
        return;
      }

      // Create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/admin`,
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setError("Cette adresse email est déjà utilisée.");
        } else {
          setError("Une erreur est survenue. Réessaie.");
        }
        console.error("Signup error:", authError);
        setLoading(false);
        return;
      }

      if (authData.user) {
        // Use the invite code to grant admin role
        const { data: roleGranted, error: roleError } = await supabase
          .rpc("use_admin_invite_code", {
            _code: inviteCode.trim().toUpperCase(),
            _user_id: authData.user.id,
          });

        if (roleError || !roleGranted) {
          console.error("Role grant error:", roleError);
          setError("Erreur lors de l'attribution du rôle admin.");
          setLoading(false);
          return;
        }

        toast.success("Compte admin créé ! Vérifie ton email pour confirmer.");
        navigate("/admin/login", { replace: true });
      }
    } catch (err) {
      setError("Une erreur est survenue. Réessaie.");
      console.error("Signup exception:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="container px-4 pt-safe">
        <button
          onClick={() => navigate("/admin/login")}
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

          <h1 className="text-h1 text-foreground mb-2">Créer un compte admin</h1>
          <p className="text-body text-muted-foreground mb-8">
            Un code d'invitation valide est requis.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Invite Code */}
            <div>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Code d'invitation"
                  value={inviteCode}
                  onChange={(e) => {
                    setInviteCode(e.target.value.toUpperCase());
                    setError("");
                    setFieldErrors({});
                  }}
                  className="h-12 rounded-xl text-body pl-11 uppercase tracking-wider font-mono"
                  autoComplete="off"
                  autoFocus
                />
              </div>
              {fieldErrors.inviteCode && (
                <p className="text-small text-destructive mt-1">{fieldErrors.inviteCode}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                  setFieldErrors({});
                }}
                className="h-12 rounded-xl text-body"
                autoComplete="email"
              />
              {fieldErrors.email && (
                <p className="text-small text-destructive mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe (min. 8 caractères)"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                    setFieldErrors({});
                  }}
                  className="h-12 rounded-xl text-body pr-12"
                  autoComplete="new-password"
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
              {fieldErrors.password && (
                <p className="text-small text-destructive mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                  setFieldErrors({});
                }}
                className="h-12 rounded-xl text-body"
                autoComplete="new-password"
              />
              {fieldErrors.confirmPassword && (
                <p className="text-small text-destructive mt-1">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {error && (
              <p className="text-small text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={loading || !email || !password || !confirmPassword || !inviteCode}
              className="w-full rounded-full h-12 text-body font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer mon compte admin"
              )}
            </Button>
          </form>

          <p className="text-small text-muted-foreground text-center mt-6">
            Tu as déjà un compte ?{" "}
            <button
              onClick={() => navigate("/admin/login")}
              className="text-primary font-medium hover:underline"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
