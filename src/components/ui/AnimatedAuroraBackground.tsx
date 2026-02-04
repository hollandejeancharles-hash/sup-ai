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
      {/* Pure white base */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Aurora blobs container - more vibrant */}
      <div className="absolute inset-0">
        {/* Primary Coral blob - larger, more prominent */}
        <div
          className={`
            absolute -top-[30%] -left-[20%] w-[90%] h-[80%] rounded-full
            ${reducedMotion ? "" : "animate-aurora-float-1"}
          `}
          style={{
            background: "radial-gradient(circle at center, hsla(11, 100%, 62%, 0.35) 0%, hsla(11, 100%, 62%, 0.15) 40%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        
        {/* Peach/Orange secondary blob */}
        <div
          className={`
            absolute top-[10%] -right-[25%] w-[80%] h-[70%] rounded-full
            ${reducedMotion ? "" : "animate-aurora-float-2"}
          `}
          style={{
            background: "radial-gradient(circle at center, hsla(25, 100%, 70%, 0.30) 0%, hsla(25, 100%, 70%, 0.12) 45%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
        
        {/* Violet/Purple accent blob */}
        <div
          className={`
            absolute -bottom-[20%] left-[5%] w-[75%] h-[65%] rounded-full
            ${reducedMotion ? "" : "animate-aurora-float-3"}
          `}
          style={{
            background: "radial-gradient(circle at center, hsla(270, 50%, 70%, 0.25) 0%, hsla(270, 50%, 70%, 0.10) 45%, transparent 70%)",
            filter: "blur(85px)",
          }}
        />

        {/* Extra glow orb - adds depth */}
        <div
          className={`
            absolute top-[40%] left-[30%] w-[50%] h-[40%] rounded-full
            ${reducedMotion ? "" : "animate-aurora-pulse"}
          `}
          style={{
            background: "radial-gradient(circle at center, hsla(11, 100%, 65%, 0.20) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Noise overlay - subtle grain texture */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}