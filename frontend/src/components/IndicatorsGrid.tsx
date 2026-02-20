import type { AnalysisResult } from "@/lib/analysis";
import {
  DollarSign,
  Clock,
  UserCheck,
  Heart,
  Link2,
  Newspaper,
} from "lucide-react";

interface IndicatorsGridProps {
  indicators: AnalysisResult["indicators"];
}

const INDICATOR_META = [
  { key: "financial_scam", label: "Financial Scam", icon: DollarSign },
  { key: "urgency", label: "Urgency Manipulation", icon: Clock },
  { key: "authority_impersonation", label: "Authority Impersonation", icon: UserCheck },
  { key: "emotional_triggers", label: "Emotional Triggers", icon: Heart },
  { key: "suspicious_links", label: "Suspicious Links", icon: Link2 },
  { key: "fake_news", label: "Fake News Indicators", icon: Newspaper },
] as const;

const IndicatorsGrid = ({ indicators }: IndicatorsGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {INDICATOR_META.map(({ key, label, icon: Icon }) => {
        const detected = indicators[key];
        return (
          <div
            key={key}
            className={`glass-card group relative rounded-xl p-4 transition-all ${
              detected ? "border-danger/40" : "border-border"
            }`}
            style={detected ? { borderColor: "hsl(0, 72%, 50%, 0.4)" } : {}}
          >
            <div className="flex items-start gap-3">
              <div
                className={`rounded-lg p-2 ${
                  detected ? "bg-danger/20 text-danger" : "bg-secondary text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">{label}</p>
                <p
                  className={`mt-0.5 text-xs font-semibold ${
                    detected ? "text-danger" : "text-safe"
                  }`}
                >
                  {detected ? "⚠ Detected" : "✓ Not detected"}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default IndicatorsGrid;
