import type { ScanHistoryItem } from "@/lib/analysis";
import { History, Trash2, ChevronRight } from "lucide-react";

interface ScanHistoryProps {
  history: ScanHistoryItem[];
  onSelect: (item: ScanHistoryItem) => void;
  onClear: () => void;
}

const ScanHistory = ({ history, onSelect, onClear }: ScanHistoryProps) => {
  if (history.length === 0) return null;

  const getRiskColor = (score: number) =>
    score >= 70 ? "text-danger" : score >= 40 ? "text-warning" : "text-safe";

  return (
    <section className="mx-auto max-w-3xl px-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <History className="h-3.5 w-3.5" />
          Scan History
        </div>
        <button
          onClick={onClear}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-danger"
        >
          <Trash2 className="h-3 w-3" />
          Clear
        </button>
      </div>
      <div className="space-y-2">
        {history.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="glass-card flex w-full items-center gap-3 rounded-lg p-3 text-left transition hover:border-primary/40"
          >
            <span className={`font-display text-sm font-bold ${getRiskColor(item.result.risk_score)}`}>
              {item.result.risk_score}
            </span>
            <span className="flex-1 truncate text-xs text-secondary-foreground">
              {item.text.slice(0, 80)}…
            </span>
            <span className="text-[10px] text-muted-foreground">
              {new Date(item.timestamp).toLocaleTimeString()}
            </span>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          </button>
        ))}
      </div>
    </section>
  );
};

export default ScanHistory;
