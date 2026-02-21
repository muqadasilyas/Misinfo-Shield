import type { AnalysisResult } from "@/lib/analysis";
import RiskMeter from "./RiskMeter";
import IndicatorsGrid from "./IndicatorsGrid";
import { Globe, AlertTriangle, FileText, Download } from "lucide-react";

interface ResultsSectionProps {
  result: AnalysisResult;
  inputText: string;
}

const ResultsSection = ({ result, inputText }: ResultsSectionProps) => {
  const highlightText = () => {
    let highlighted = inputText;
    result.suspicious_phrases.forEach((phrase) => {
      const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escaped})`, "gi");
      highlighted = highlighted.replace(
        regex,
        '<mark class="bg-danger/30 text-danger rounded px-0.5">$1</mark>'
      );
    });
    return highlighted;
  };

  const handleDownloadPDF = () => {
    const content = `MISINFO SHIELD - ANALYSIS REPORT
================================
Date: ${new Date().toLocaleString()}
Risk Score: ${result.risk_score*10}/100
Verdict: ${result.verdict}
Language: ${result.detected_language}

EXPLANATION:
${result.explanation}

INDICATORS:
- Financial Scam: ${result.indicators.financial_scam ? "DETECTED" : "Not detected"}
- Urgency Manipulation: ${result.indicators.urgency ? "DETECTED" : "Not detected"}
- Authority Impersonation: ${result.indicators.authority_impersonation ? "DETECTED" : "Not detected"}
- Emotional Triggers: ${result.indicators.emotional_triggers ? "DETECTED" : "Not detected"}
- Suspicious Links: ${result.indicators.suspicious_links ? "DETECTED" : "Not detected"}
- Fake News: ${result.indicators.fake_news ? "DETECTED" : "Not detected"}

ANALYZED TEXT:
${inputText}
`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `misinfo-shield-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="mx-auto max-w-3xl px-4 animate-fade-in-up">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-foreground">Analysis Results</h2>
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-secondary-foreground">
            <Globe className="h-3 w-3 text-primary" />
            {result.detected_language}
          </span>
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-secondary-foreground transition hover:border-primary hover:text-primary"
          >
            <Download className="h-3 w-3" />
            Report
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Risk Meter */}
        <RiskMeter score={result.risk_score} />

        {/* Verdict + Explanation */}
        <div className="flex flex-col gap-4 md:col-span-2">
          <div className="glass-card rounded-xl p-5">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <AlertTriangle className="h-3.5 w-3.5 text-primary" />
              AI Verdict
            </div>
            <p className="text-sm font-medium leading-relaxed text-foreground">{result.verdict}</p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <FileText className="h-3.5 w-3.5 text-primary" />
              Explanation
            </div>
            <p className="text-sm leading-relaxed text-secondary-foreground">{result.explanation}</p>
          </div>
        </div>
      </div>

      {/* Suspicious phrases */}
      {result.suspicious_phrases.length > 0 && (
        <div className="glass-card mt-4 rounded-xl p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Highlighted Text
          </p>
          <p
            className="font-mono-code text-sm leading-relaxed text-secondary-foreground"
            dangerouslySetInnerHTML={{ __html: highlightText() }}
          />
        </div>
      )}

      {/* Indicators */}
      <div className="mt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Threat Indicators
        </p>
        <IndicatorsGrid indicators={result.indicators} />
      </div>
    </section>
  );
};

export default ResultsSection;
