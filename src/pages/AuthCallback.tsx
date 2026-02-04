import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code and redirect param from URL
        const code = searchParams.get("code");
        const redirectTo = searchParams.get("redirect") || "/home";
        const errorParam = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (errorParam) {
          console.error("Auth callback error:", errorParam, errorDescription);
          setError(errorDescription || "Une erreur est survenue lors de la connexion.");
          return;
        }

        if (code) {
          console.log("Exchanging code for session...");
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error("Exchange error:", exchangeError);
            setError("Le lien de connexion a expiré ou est invalide. Réessaie.");
            return;
          }

          if (data.session) {
            console.log("Session established successfully, redirecting to:", redirectTo);
            navigate(redirectTo, { replace: true });
            return;
          }
        }

        // If no code, check if we already have a session (magic link flow)
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Existing session found, redirecting to:", redirectTo);
          navigate(redirectTo, { replace: true });
          return;
        }

        // No code and no session - something went wrong
        console.error("No code or session found in callback");
        setError("Lien de connexion invalide. Réessaie.");
      } catch (err) {
        console.error("Callback exception:", err);
        setError("Une erreur inattendue est survenue.");
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
            <span className="text-2xl">😕</span>
          </div>
          <h1 className="text-h2 text-foreground mb-3">Oups !</h1>
          <p className="text-body text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => navigate("/auth")}
            className="text-primary font-medium hover:underline"
          >
            Retourner à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
      <p className="text-body text-muted-foreground">Connexion en cours...</p>
    </div>
  );
}
