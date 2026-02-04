import { useEffect, useState } from "react";

export function AnimatedAuroraBackground() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <div 
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Main aurora blobs */}
      <div
        className={`
          absolute -top-1/2 -left-1/4 w-[150%] h-[150%]
          ${reducedMotion ? "" : "animate-aurora-1"}
        `}
      >
        {/* Coral/Orange blob */}
        <div
          className="absolute top-[20%] left-[15%] w-[45%] h-[45%] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        
        {/* Peach blob */}
        <div
          className={`
            absolute top-[35%] right-[10%] w-[50%] h-[50%] rounded-full opacity-18
            ${reducedMotion ? "" : "animate-aurora-2"}
          `}
          style={{
            background: "radial-gradient(circle, hsl(20 90% 75%) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
        
        {/* Light violet/grey blob */}
        <div
          className={`
            absolute bottom-[10%] left-[25%] w-[40%] h-[40%] rounded-full opacity-15
            ${reducedMotion ? "" : "animate-aurora-3"}
          `}
          style={{
            background: "radial-gradient(circle, hsl(250 20% 75%) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
      </div>

      {/* Noise overlay - subtle grain texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* White overlay for readability */}
      <div className="absolute inset-0 bg-background/80" />
    </div>
  );
}
