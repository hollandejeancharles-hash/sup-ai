import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Clock, Target, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedAuroraBackground } from "@/components/ui/AnimatedAuroraBackground";
import { mockItems } from "@/lib/mockData";
import { useAuthSheet } from "@/contexts/AuthSheetContext";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function Landing() {
  const { user } = useAuth();
  const { openAuthSheet } = useAuthSheet();
  const previewItems = mockItems.slice(0, 3);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      window.location.href = "/home";
    } else {
      openAuthSheet();
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedAuroraBackground />
      
      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div 
          className="absolute top-[15%] right-[10%] w-3 h-3 rounded-full bg-primary/40 animate-float"
          style={{ animationDelay: "0s" }}
        />
        <div 
          className="absolute top-[25%] left-[15%] w-2 h-2 rounded-full bg-primary/30 animate-float-delayed"
          style={{ animationDelay: "0.5s" }}
        />
        <div 
          className="absolute top-[60%] right-[20%] w-2.5 h-2.5 rounded-full bg-violet-400/30 animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div 
          className="absolute top-[45%] left-[8%] w-2 h-2 rounded-full bg-orange-300/40 animate-float-delayed"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      {/* Hero Section */}
      <section className="container px-4 pt-20 pb-16 relative" style={{ zIndex: 1 }}>
        <div className="text-center max-w-lg mx-auto">
          {/* Animated Badge */}
          <div 
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-primary/15 via-primary/10 to-orange-400/15 text-primary text-meta font-medium mb-8 border border-primary/20 backdrop-blur-sm transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>Curated daily by AI</span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </div>

          {/* Main Title with stagger animation */}
          <h1 
            className={cn(
              "text-[2.5rem] leading-[1.15] font-bold text-foreground mb-5 tracking-tight transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            Le digest IA que tu lis en{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">3 minutes</span>
              <span 
                className="absolute -bottom-1 left-0 right-0 h-3 bg-primary/15 -skew-x-3 rounded"
                style={{ zIndex: 0 }}
              />
            </span>
            .
          </h1>

          {/* Subtitle */}
          <p 
            className={cn(
              "text-lg text-muted-foreground mb-10 transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            Chaque jour, l'essentiel. <br className="sm:hidden" />
            Clair, sourcé, sans bruit.
          </p>

          {/* CTAs with glow effect */}
          <div 
            className={cn(
              "flex flex-col gap-4 transition-all duration-700 delay-300",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            {/* Primary CTA with glow */}
            <Button 
              size="lg" 
              className="group relative w-full rounded-full h-14 text-base font-semibold overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              onClick={handleGetStarted}
            >
              {/* Gradient background */}
              <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-orange-500 transition-opacity duration-300" />
              
              {/* Shimmer effect */}
              <span 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
                style={{ backgroundSize: "200% 100%" }}
              />
              
              {/* Glow */}
              <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-primary/50" style={{ transform: "translateY(50%)" }} />
              
              <span className="relative z-10 flex items-center justify-center gap-2">
                {user ? "Voir le digest" : "Commencer gratuitement"}
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Button>

            {/* Secondary CTA */}
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="w-full rounded-full h-14 text-base border-2 border-hairline hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
            >
              <Link to="/home" className="flex items-center justify-center gap-2">
                <span>Lire sans compte</span>
                <span className="text-primary">→</span>
              </Link>
            </Button>
          </div>

          {/* Social proof hint */}
          <p 
            className={cn(
              "text-small text-muted-foreground mt-6 transition-all duration-700 delay-500",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            ✨ Gratuit, sans spam, désinscription en 1 clic
          </p>
        </div>
      </section>

      {/* Preview Section with floating card effect */}
      <section className="container px-4 py-12 relative" style={{ zIndex: 1 }}>
        <div 
          className={cn(
            "relative max-w-lg mx-auto transition-all duration-1000 delay-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}
        >
          {/* Card glow background */}
          <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-transparent to-violet-400/10 rounded-[2rem] blur-2xl" />
          
          {/* Preview card */}
          <div className="relative bg-background/80 backdrop-blur-sm rounded-[1.75rem] shadow-elevated border border-hairline overflow-hidden">
            {/* Mock app header */}
            <div className="px-5 py-4 border-b border-hairline bg-background/50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <h3 className="font-semibold text-foreground">Today's Digest</h3>
                </div>
                <span className="text-meta text-primary font-medium">Live</span>
              </div>
            </div>

            {/* Mock Articles */}
            <div className="divide-y divide-hairline">
              {previewItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className={cn(
                    "flex gap-3 p-4 transition-all duration-500 hover:bg-secondary/30",
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                  )}
                  style={{ transitionDelay: `${600 + index * 100}ms` }}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0 shadow-sm">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-meta text-foreground line-clamp-2 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-small text-muted-foreground flex items-center gap-1.5">
                      <span className="font-medium">{item.source}</span>
                      <span>•</span>
                      <span>{item.read_time_minutes} min</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Different Section */}
      <section className="container px-4 py-16 relative" style={{ zIndex: 1 }}>
        <h2 
          className={cn(
            "text-h2 text-foreground text-center mb-10 transition-all duration-700",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          Pourquoi c'est <span className="text-primary">différent</span>
        </h2>

        <div className="space-y-4 max-w-lg mx-auto">
          {[
            { icon: Clock, title: "3 minutes chrono", desc: "Un digest concis, sans perdre l'essentiel. Format pensé pour mobile.", delay: 0 },
            { icon: Target, title: "Curation intelligente", desc: "IA + expertise humaine. Zéro clickbait, zéro bruit.", delay: 100 },
            { icon: Zap, title: "Sources vérifiées", desc: "Chaque info est sourcée et traçable. Tu sais d'où ça vient.", delay: 200 },
          ].map((item, index) => (
            <div 
              key={index}
              className={cn(
                "group flex gap-4 p-5 bg-card/80 backdrop-blur-sm rounded-2xl shadow-card border border-hairline/50 transition-all duration-300 hover:shadow-elevated hover:border-primary/20 hover:-translate-y-0.5",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: `${800 + item.delay}ms` }}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-meta text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What You Get Section */}
      <section className="container px-4 py-12 relative" style={{ zIndex: 1 }}>
        <h2 className="text-h2 text-foreground text-center mb-10">
          Ce que tu reçois
        </h2>

        <div className="max-w-lg mx-auto space-y-2">
          {[
            "Un digest quotidien à 8h",
            "Les 5-10 news IA les plus importantes",
            "Résumés courts et actionnables",
            "Liens vers les sources originales",
            "Pas de spam, pas de pub",
          ].map((item, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-secondary/50 transition-colors duration-200"
            >
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
              <span className="text-body text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container px-4 py-16 pb-24 relative" style={{ zIndex: 1 }}>
        <div className="max-w-lg mx-auto">
          {/* Glowing card */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-orange-400/20 to-primary/30 rounded-[2rem] blur-xl opacity-60" />
            
            <div className="relative bg-gradient-to-br from-card via-card to-primary/5 rounded-[1.75rem] p-8 text-center border border-primary/10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center mx-auto mb-5 shadow-lg">
                <Zap className="h-7 w-7 text-white" />
              </div>
              
              <h2 className="text-h2 text-foreground mb-3">Prêt à rester informé ?</h2>
              <p className="text-body text-muted-foreground mb-6">
                Rejoins les lecteurs qui gagnent du temps chaque jour.
              </p>
              
              <Button 
                size="lg" 
                className="group w-full rounded-full h-14 text-base font-semibold bg-gradient-to-r from-primary to-orange-500 hover:opacity-90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-pulse-glow"
                onClick={handleGetStarted}
              >
                <span className="flex items-center justify-center gap-2">
                  {user ? "Voir le digest" : "Commencer maintenant"}
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container px-4 py-8 border-t border-hairline relative" style={{ zIndex: 1 }}>
        <div className="text-center text-meta text-muted-foreground">
          <p>© 2024 Daily Digest. Fait avec ❤️</p>
        </div>
      </footer>
    </div>
  );
}