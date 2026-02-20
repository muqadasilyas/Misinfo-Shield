import { useState, useCallback, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import InputSection from "@/components/InputSection";
import ResultsSection from "@/components/ResultsSection";
import ScanHistory from "@/components/ScanHistory";
import {
  analyzeText,
  analyzeImage,
  analyzeVoice,
  type AnalysisResult,
  type ScanHistoryItem,
} from "@/lib/analysis";
import { Shield } from "lucide-react";

const HISTORY_KEY = "misinfo-shield-history";

const Index = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<ScanHistoryItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  // -------- TEXT --------
  const handleAnalyzeText = useCallback(async (text: string) => {
    setInputText(text);
    setIsAnalyzing(true);
    setResult(null);

    try {
      const analysis = await analyzeText(text);
      setResult(analysis);

      const item: ScanHistoryItem = {
        id: crypto.randomUUID(),
        text,
        result: analysis,
        timestamp: Date.now(),
      };

      setHistory((prev) => [item, ...prev].slice(0, 20));
    } catch (err) {
      console.error("Text analysis failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // -------- IMAGE --------
  const handleAnalyzeImage = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      const res = await analyzeImage(file);

      setInputText(res.extracted_text);
      setResult(res.result);

      const item: ScanHistoryItem = {
        id: crypto.randomUUID(),
        text: res.extracted_text,
        result: res.result,
        timestamp: Date.now(),
      };

      setHistory((prev) => [item, ...prev].slice(0, 20));
    } catch (err) {
      console.error("Image analysis failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

// -------- VOICE --------
const handleAnalyzeVoice = useCallback(async (file: File) => {
  setIsAnalyzing(true);
  setResult(null);

  try {
    const res = await analyzeVoice(file);

if (!res || !res.result) {
  throw new Error("Invalid voice response");
}

setInputText(res.transcription || "");
setResult(res.result);


    const item: ScanHistoryItem = {
      id: crypto.randomUUID(),
      text: res.transcription || "",
      result: res.result,
      timestamp: Date.now(),
    };

    setHistory((prev) => [item, ...prev].slice(0, 20));
  } catch (err) {
  console.error("Voice analysis failed", err);
  alert("Voice analysis failed. Please try another audio file.");

  } finally {
    setIsAnalyzing(false);
  }
}, []);


  const handleSelectHistory = useCallback((item: ScanHistoryItem) => {
    setResult(item.result);
    setInputText(item.text);
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      <div className="space-y-10 pb-20">
        <InputSection
          onAnalyzeText={handleAnalyzeText}
          onAnalyzeImage={handleAnalyzeImage}
          onAnalyzeVoice={handleAnalyzeVoice}
          isAnalyzing={isAnalyzing}
        />

        {isAnalyzing && (
          <div className="flex flex-col items-center gap-3 py-10 animate-pulse-glow">
            <Shield className="h-10 w-10 text-primary" />
            <p className="font-display text-sm tracking-widest text-muted-foreground">
              ANALYZING THREAT PATTERNS…
            </p>
          </div>
        )}

        {result && !isAnalyzing && (
          <ResultsSection result={result} inputText={inputText} />
        )}

        <ScanHistory
          history={history}
          onSelect={handleSelectHistory}
          onClear={handleClearHistory}
        />

        {/* Footer */}
        <footer className="mx-auto max-w-3xl px-4 pt-10 text-center">
          <div className="border-t border-border pt-6">
            <p className="font-display text-xs tracking-widest text-muted-foreground">
              MISINFO SHIELD — Protecting Pakistan from Digital Threats
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground/50">
              Digital Threats Protection • Social Impact • Not for production use
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
