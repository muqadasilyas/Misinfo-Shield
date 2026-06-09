# 🛡️ Misinfo Shield

**AI-powered misinformation, scam, and fake news detection for Pakistan's digital landscape.**

Misinfo Shield analyzes text, images, and audio to detect scams, fake news, religious misinformation, and political rumors — with multilingual support for English, Urdu, and Roman Urdu.

---

## 🌐 Live Demo

| Layer | Platform | URL |
|-------|----------|-----|
| Frontend | Vercel | *(your Vercel URL)* |
| Backend API | Hugging Face Spaces | *(your HF Space URL)* |

---

## ✨ Features

- 📝 **Text Analysis** — Paste any suspicious message or news snippet
- 🖼️ **Image Analysis** — Upload screenshots; OCR extracts and scans the text
- 🎙️ **Voice Analysis** — Upload audio; Whisper transcribes and scans it
- 🌐 **Multilingual** — Detects English, Urdu, and Roman Urdu content
- 📊 **Risk Scoring** — 0–100 animated risk meter (LOW / MEDIUM / HIGH)
- 🔍 **Threat Indicators** — Financial scam, urgency, authority impersonation, emotional triggers, suspicious links, fake news
- 🕌 **Religious Verification** — Flags fabricated or misquoted Quranic Ayat / Hadith
- 🗳️ **Political Rumor Detection** — Identifies manipulation and propaganda
- 📥 **Downloadable Reports** — Export analysis as a `.txt` report
- 🗂️ **Scan History** — Last 20 scans stored locally in the browser

---

## 🏗️ Architecture

```
misinfo-shield/
├── frontend/          # React + TypeScript (deployed on Vercel)
│   ├── src/
│   │   ├── components/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── InputSection.tsx
│   │   │   ├── ResultsSection.tsx
│   │   │   ├── RiskMeter.tsx
│   │   │   ├── IndicatorsGrid.tsx
│   │   │   └── ScanHistory.tsx
│   │   ├── lib/
│   │   │   └── analysis.ts      # API call helpers
│   │   └── pages/
│   │       └── Index.tsx
│   └── package.json
│
└── backend/           # FastAPI + Python (deployed on Hugging Face Spaces)
    ├── app.py         # API routes: /analyze/text, /analyze/image, /analyze/voice
    ├── utils.py       # Whisper + Tesseract helpers
    ├── requirements.txt
    ├── packages.txt
    └── Dockerfile
```

---

## 🧠 Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| React + TypeScript | UI framework |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| Vercel | Hosting |

### Backend
| Tool | Purpose |
|------|---------|
| FastAPI | REST API framework |
| Groq (LLaMA 3.1 8B) | AI inference for misinformation detection |
| OpenAI Whisper (base) | Audio transcription |
| Tesseract OCR | Text extraction from images |
| Pillow | Image processing |
| Docker | Containerized deployment |
| Hugging Face Spaces | Backend hosting |

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- Node.js 18+
- Python 3.10+
- Tesseract OCR installed (`sudo apt install tesseract-ocr`)
- FFmpeg installed (`sudo apt install ffmpeg`)
- A [Groq API key](https://console.groq.com)

---

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
export GROQ_API_KEY=your_key_here
uvicorn app:app --reload --port 8000
```

Backend will be live at `http://localhost:8000`.

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

Then run:

```bash
npm run dev
```

Frontend will be live at `http://localhost:5173`.

---

## 🔌 API Reference

### `POST /analyze/text`

```json
// Request
{ "text": "BREAKING: Govt giving FREE laptops, register now!" }

// Response
{
  "risk_score": 8,
  "verdict": "HIGH",
  "detected_language": "English",
  "suspicious_phrases": ["FREE laptops", "register now"],
  "indicators": {
    "financial_scam": true,
    "urgency": true,
    "authority_impersonation": true,
    "emotional_triggers": false,
    "suspicious_links": false,
    "fake_news": true
  },
  "explanation": "This message exhibits classic scam patterns..."
}
```

---

### `POST /analyze/image`

- **Body:** `multipart/form-data` with field `file` (image file)
- **Response:** `{ extracted_text, result }` — same result structure as above

---

### `POST /analyze/voice`

- **Body:** `multipart/form-data` with field `file` (audio file)
- **Response:** `{ transcription, result }` — same result structure as above

---

## 🐳 Docker (Backend)

```bash
cd backend
docker build -t misinfo-shield-backend .
docker run -e GROQ_API_KEY=your_key_here -p 7860:7860 misinfo-shield-backend
```

---

## 📦 Deployment

### Backend → Hugging Face Spaces

1. Create a new Space on [huggingface.co](https://huggingface.co) with **Docker** SDK
2. Add your `GROQ_API_KEY` in Space Settings → Repository Secrets
3. Push the `backend/` folder contents to the Space repository

```bash
git clone https://huggingface.co/spaces/YOUR_USERNAME/misinfo-shield-backend
cp -r backend/* misinfo-shield-backend/
cd misinfo-shield-backend
git add . && git commit -m "deploy" && git push
```

### Frontend → Vercel

1. Push the `frontend/` folder to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Set the environment variable `VITE_API_URL` to your Hugging Face Space URL
4. Deploy

---

## 🌍 Use Cases

- Verifying WhatsApp forwards before sharing
- Checking if a government announcement is real
- Detecting fabricated religious quotes
- Identifying political propaganda and rumors
- Analyzing suspicious voice messages or screenshots

---

## ⚠️ Disclaimer

Misinfo Shield is a research and awareness tool. Results are AI-generated and should not be treated as legal or journalistic fact-checking. Always verify critical information through official sources.

---

## 👩‍💻 Author

**Muqadas Ilyas**  
Software Engineering Student — NIIT, Lahore  
[LinkedIn](https://linkedin.com/in/muqadas-ilyas-8681923b5) · muqadasilyas2005@gmail.com

---

## 📄 License

MIT License — free to use, modify, and distribute with attribution.
