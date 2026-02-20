import { useEffect, useState } from "react";

interface RiskMeterProps {
  score: number; // backend gives 0–10
}

const RiskMeter = ({ score }: RiskMeterProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  // convert 0–10 score into 0–100
  const displayScore = score * 10;

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (animatedScore / 100) * circumference;

  const getColor = (s: number) =>
    s >= 7 ? "hsl(0, 72%, 50%)" : s >= 4 ? "hsl(40, 90%, 50%)" : "hsl(145, 80%, 42%)";

  const getLabel = (s: number) =>
    s >= 7 ? "HIGH RISK" : s >= 4 ? "MEDIUM RISK" : "LOW RISK";

  const getLabelClass = (s: number) =>
    s >= 7 ? "text-danger" : s >= 4 ? "text-warning" : "text-safe";

  useEffect(() => {
    const duration = 1200;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedScore(Math.round(eased * displayScore));

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [displayScore]);

  return (
    <div className="glass-card flex flex-col items-center rounded-xl p-6">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Risk Assessment
      </h3>

      <div className="relative h-36 w-36">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(220, 15%, 16%)" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={getColor(score)}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
              filter: `drop-shadow(0 0 8px ${getColor(score)})`,
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-bold" style={{ color: getColor(score) }}>
            {animatedScore}
          </span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>

      <span className={`mt-3 font-display text-sm font-bold tracking-wider ${getLabelClass(score)}`}>
        {getLabel(score)}
      </span>
    </div>
  );
};

export default RiskMeter;
