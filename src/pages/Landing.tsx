import { Link } from "react-router-dom";
import { ArrowRight, Zap, Clock, Target, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedAuroraBackground } from "@/components/ui/AnimatedAuroraBackground";
import { mockItems } from "@/lib/mockData";

export default function Landing() {
  const previewItems = mockItems.slice(0, 3);

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedAuroraBackground />
      {/* Hero Section */}
      <section className="container px-4 pt-16 pb-12">
        <div className="text-center max-w-lg mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-meta font-medium mb-6">
            <Zap className="h-4 w-4" />
            <span>Curated daily by AI</span>
          </div>

          {/* Main Title */}
          <h1 className="text-h1 text-foreground mb-4 leading-tight">
            Le digest IA que tu lis en{" "}
            <span className="text-primary">3 minutes</span>.
          </h1>

          {/* Subtitle */}
          <p className="text-body text-muted-foreground mb-8">
            Chaque jour, l'essentiel. Clair, sourcé, sans bruit.
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="w-full rounded-full h-12 text-body font-semibold">
              <Link to="/auth">
                Se connecter par email
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full rounded-full h-12 text-body">
              <Link to="#preview">Voir un exemple</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section id="preview" className="container px-4 py-12">
        <div className="bg-secondary/50 rounded-lg p-4 max-w-lg mx-auto">
          <div className="bg-background rounded-card shadow-card overflow-hidden">
            {/* Mock Header */}
            <div className="p-4 border-b border-hairline">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-foreground">Breaking News</h3>
                <span className="text-meta text-primary">View all →</span>
              </div>
            </div>

            {/* Mock Articles */}
            <div className="divide-y divide-hairline">
              {previewItems.map((item) => (
                <div key={item.id} className="flex gap-3 p-4">
                  <div className="w-16 h-16 rounded-image overflow-hidden bg-muted flex-shrink-0">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-meta text-foreground line-clamp-2 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-small text-muted-foreground">
                      {item.source} • {item.read_time_minutes} min
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Different Section */}
      <section className="container px-4 py-12">
        <h2 className="text-h2 text-foreground text-center mb-8">
          Pourquoi c'est différent
        </h2>

        <div className="space-y-4 max-w-lg mx-auto">
          <div className="flex gap-4 p-5 bg-card rounded-card shadow-card">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">3 minutes chrono</h3>
              <p className="text-meta text-muted-foreground">
                Un digest concis, sans perdre l'essentiel. Format pensé pour mobile.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-card rounded-card shadow-card">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Curation intelligente</h3>
              <p className="text-meta text-muted-foreground">
                IA + expertise humaine. Zéro clickbait, zéro bruit.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-card rounded-card shadow-card">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Sources vérifiées</h3>
              <p className="text-meta text-muted-foreground">
                Chaque info est sourcée et traçable. Tu sais d'où ça vient.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="container px-4 py-12">
        <h2 className="text-h2 text-foreground text-center mb-8">
          Ce que tu reçois
        </h2>

        <div className="max-w-lg mx-auto space-y-3">
          {[
            "Un digest quotidien à 8h",
            "Les 5-10 news IA les plus importantes",
            "Résumés courts et actionnables",
            "Liens vers les sources originales",
            "Pas de spam, pas de pub",
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-body text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-12 pb-20">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-h2 text-foreground mb-4">Prêt à rester informé ?</h2>
          <p className="text-body text-muted-foreground mb-6">
            Rejoins les lecteurs qui gagnent du temps chaque jour.
          </p>
          <Button asChild size="lg" className="w-full rounded-full h-12 text-body font-semibold">
            <Link to="/auth">
              Commencer maintenant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container px-4 py-8 border-t border-hairline">
        <div className="text-center text-meta text-muted-foreground">
          <p>© 2024 Daily Digest. Fait avec ❤️</p>
        </div>
      </footer>
    </div>
  );
}
