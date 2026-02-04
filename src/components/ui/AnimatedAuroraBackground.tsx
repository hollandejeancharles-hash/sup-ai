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
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    >
      {/* Subtle white base */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Aurora blobs container */}
      <div
        className={`
          absolute inset-0
          ${reducedMotion ? "" : "animate-aurora-1"}
        `}
      >
        {/* Coral/Orange blob - top left */}
        <div
          className={`
            absolute -top-[20%] -left-[10%] w-[70%] h-[60%] rounded-full
            ${reducedMotion ? "" : "animate-aurora-2"}
          `}
          style={{
            background: "radial-gradient(circle at center, hsla(11, 100%, 62%, 0.25) 0%, transparent 60%)",
            filter: "blur(80px)",
          }}
        />
        
        {/* Peach blob - center right */}
        <div
          className={`
            absolute top-[20%] -right-[15%] w-[65%] h-[55%] rounded-full
            ${reducedMotion ? "" : "animate-aurora-3"}
          `}
          style={{
            background: "radial-gradient(circle at center, hsla(20, 90%, 75%, 0.22) 0%, transparent 60%)",
            filter: "blur(90px)",
          }}
        />
        
        {/* Light violet/grey blob - bottom */}
        <div
          className={`
            absolute -bottom-[10%] left-[10%] w-[60%] h-[50%] rounded-full
            ${reducedMotion ? "" : "animate-aurora-2"}
          `}
          style={{
            background: "radial-gradient(circle at center, hsla(250, 25%, 78%, 0.18) 0%, transparent 60%)",
            filter: "blur(70px)",
          }}
        />
      </div>

      {/* Noise overlay - subtle grain texture */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}
