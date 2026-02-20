import { Shield, Zap, Search, BarChart3 } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-12 md:py-20">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img src={heroBg} alt="" className="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
          <Shield className="h-4 w-4 text-primary" />
          AI-Powered Protection for Pakistan
        </div>

        <h1 className="font-display mb-4 text-4xl font-bold tracking-tight text-glow md:text-6xl">
          <span className="text-primary">Misinfo</span>{" "}
          <span className="text-foreground">Shield</span>
        </h1>

        <p className="font-display mb-3 text-sm tracking-widest text-muted-foreground md:text-base">
          PAKISTAN'S AI DEFENSE AGAINST MISINFORMATION & SCAMS
        </p>

        <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Analyze suspicious messages in <span className="text-primary font-medium">Urdu</span>,{" "}
          <span className="text-primary font-medium">Roman Urdu</span>, and{" "}
          <span className="text-primary font-medium">English</span> using advanced AI to detect
          scams, fake news, and manipulation tactics.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: Search, label: "Scam Detection" },
            { icon: BarChart3, label: "Fake News Analysis" },
            { icon: Zap, label: "Real-time Results" },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-3 py-1.5 text-xs font-medium text-secondary-foreground backdrop-blur"
            >
              <Icon className="h-3.5 w-3.5 text-primary" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
