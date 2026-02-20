// src/lib/analysis.ts

export interface AnalysisResult {
  risk_score: number;
  verdict: string;
  explanation: string;
  detected_language: string;
  suspicious_phrases: string[];
  indicators: {
    financial_scam: boolean;
    urgency: boolean;
    authority_impersonation: boolean;
    emotional_triggers: boolean;
    suspicious_links: boolean;
    fake_news: boolean;
  };
}

export interface ScanHistoryItem {
  id: string;
  text: string;
  result: AnalysisResult;
  timestamp: number;
}

export const API_BASE = "https://muqadasilyas-misinfo-shield.hf.space";

export async function analyzeText(text: string): Promise<AnalysisResult> {
  const res = await fetch(`${API_BASE}/analyze/text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  return await res.json();
}

export async function analyzeImage(file: File): Promise<{ extracted_text: string; result: AnalysisResult }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/analyze/image`, {
    method: "POST",
    body: formData,
  });

  return await res.json();
}

export async function analyzeVoice(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("https://muqadasilyas-misinfo-shield.hf.space/analyze/voice", {
    method: "POST",
    body: formData,
  });
  
  if (!res.ok) {
    throw new Error("Voice API failed");
  }

  const data = await res.json();
 console.log("VOICE API RAW:", data);

  // ✅ Validate backend response shape
  if (!data.transcription || !data.result) {
    console.error("Invalid response from voice API", data);
    throw new Error("Invalid voice response");
  }

  return data; // { transcription, result }
}



export const EXAMPLE_MESSAGES: Record<string, string> = {
  "Banking Scam":
    "URGENT: Your JazzCash account has been compromised! Send your PIN immediately.",
  "Fake News":
    "BREAKING: Pakistan government announces free laptops for all citizens.",
  "Religious Bait":
    "Forward this message and Allah will bless you.",
  "Prize Scam":
    "Congratulations! You have won Rs. 50,000. Send processing fee now.",
};
