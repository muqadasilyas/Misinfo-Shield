import { useState, useCallback } from "react";
import { Search, Upload, Mic, Type, Image, Loader2 } from "lucide-react";
import { EXAMPLE_MESSAGES } from "@/lib/analysis";

interface InputSectionProps {
  onAnalyzeText: (text: string) => void;
  onAnalyzeImage: (file: File) => void;
  onAnalyzeVoice: (file: File) => void;
  isAnalyzing: boolean;
}

const InputSection = ({
  onAnalyzeText,
  onAnalyzeImage,
  onAnalyzeVoice,
  isAnalyzing,
}: InputSectionProps) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<"text" | "image" | "voice">("text");
  const MAX_CHARS = 2000;

  const handleAnalyze = useCallback(() => {
    if (activeTab === "text" && text.trim()) onAnalyzeText(text.trim());
    if (activeTab === "image" && file) onAnalyzeImage(file);
    if (activeTab === "voice" && file) onAnalyzeVoice(file);
  }, [activeTab, text, file]);

  const tabs = [
    { id: "text" as const, icon: Type, label: "Text" },
    { id: "image" as const, icon: Image, label: "Image (OCR)" },
    { id: "voice" as const, icon: Mic, label: "Voice" },
  ];

  return (
    <section className="mx-auto max-w-3xl px-4">
      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-lg border border-border bg-secondary/40 p-1">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all ${
              activeTab === id
                ? "bg-primary text-primary-foreground shadow glow-green"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "text" && (
        <div className="glass-card rounded-xl p-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Paste suspicious message…"
            rows={5}
            className="w-full p-4 bg-transparent"
          />
        </div>
      )}

      {(activeTab === "image" || activeTab === "voice") && (
  <div className="glass-card flex flex-col items-center justify-center gap-4 p-10">
    
    <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-5 py-2 text-sm font-semibold text-secondary-foreground hover:border-primary hover:text-primary transition">
      Upload {activeTab === "image" ? "Image" : "Audio"}
      <input
        type="file"
        accept={activeTab === "image" ? "image/*" : "audio/*"}
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="hidden"
      />
    </label>

    {file && (
      <p className="text-xs text-muted-foreground">
        Selected: {file.name}
      </p>
    )}
  </div>
)}

<button
  onClick={handleAnalyze}
  disabled={isAnalyzing}
  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
>
  {isAnalyzing ? <Loader2 className="animate-spin" /> : <Search />}
  Analyze
</button>


      {/* Example Chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.keys(EXAMPLE_MESSAGES).map((label) => (
          <button
            key={label}
            onClick={() => {
              setText(EXAMPLE_MESSAGES[label]);
              setActiveTab("text");
            }}
            className="rounded-full border px-3 py-1 text-xs"
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
};

export default InputSection;
