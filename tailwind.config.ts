import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "430px",
        md: "430px",
        lg: "430px",
        xl: "430px",
        "2xl": "430px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'h1': ['2rem', { lineHeight: '1.2', fontWeight: '600' }],
        'h2': ['1.375rem', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['0.9375rem', { lineHeight: '1.5' }],
        'meta': ['0.8125rem', { lineHeight: '1.4' }],
        'small': ['0.75rem', { lineHeight: '1.4' }],
      },
      colors: {
        border: "hsl(var(--border))",
        hairline: "hsl(var(--hairline))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius)",
        sm: "var(--radius-sm)",
        card: "1.375rem",
        image: "1.125rem",
      },
      spacing: {
        'safe-top': 'var(--safe-area-top)',
        'safe-bottom': 'var(--safe-area-bottom)',
        'safe-left': 'var(--safe-area-left)',
        'safe-right': 'var(--safe-area-right)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        elevated: 'var(--shadow-elevated)',
      },
      keyframes: {
        "aurora-float-1": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg) scale(1)" },
          "25%": { transform: "translate(5%, 3%) rotate(2deg) scale(1.02)" },
          "50%": { transform: "translate(2%, 6%) rotate(-1deg) scale(1.05)" },
          "75%": { transform: "translate(-3%, 2%) rotate(1deg) scale(1.02)" },
        },
        "aurora-float-2": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-6%, 4%) scale(1.08)" },
          "66%": { transform: "translate(4%, -3%) scale(0.95)" },
        },
        "aurora-float-3": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "20%": { transform: "translate(4%, -4%) rotate(2deg)" },
          "40%": { transform: "translate(-2%, 5%) rotate(-1deg)" },
          "60%": { transform: "translate(5%, 2%) rotate(1deg)" },
          "80%": { transform: "translate(-3%, -2%) rotate(-2deg)" },
        },
        "aurora-pulse": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "float-delayed": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsla(11, 100%, 62%, 0.4), 0 0 40px hsla(11, 100%, 62%, 0.2)" },
          "50%": { boxShadow: "0 0 30px hsla(11, 100%, 62%, 0.6), 0 0 60px hsla(11, 100%, 62%, 0.3)" },
        },
        "stagger-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in-bounce": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "70%": { transform: "scale(1.02)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "aurora-float-1": "aurora-float-1 25s ease-in-out infinite",
        "aurora-float-2": "aurora-float-2 20s ease-in-out infinite",
        "aurora-float-3": "aurora-float-3 22s ease-in-out infinite",
        "aurora-pulse": "aurora-pulse 8s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float-delayed 5s ease-in-out infinite 0.5s",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "stagger-in": "stagger-in 0.6s ease-out forwards",
        "scale-in-bounce": "scale-in-bounce 0.5s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
