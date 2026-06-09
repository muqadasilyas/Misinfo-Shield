from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import os
from utils import speech_to_text, image_to_text
import json
import whisper
import pytesseract
from PIL import Image
import io
app = FastAPI()

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def analyze_text_with_ai(text: str):
    prompt = f"""
    You are an AI system that detects scams, fake news, misinformation, religious misinformation, and political rumors.
Classify as LOW risk only if the message is purely informational and does not ask users to register, pay money, share personal data, forward the message, or click links.
If the message is an official awareness or warning from a government or trusted authority (for example advising users to avoid scams and not share personal information), then classify it as LOW risk (0–3).
If the message claims free rewards, giveaways, benefits, or government announcements such as “free laptops”, “free money”, “register now”, or “limited offer”, classify it as HIGH risk (7–10) unless a clearly verifiable official source is mentioned.
Messages using words like “BREAKING”, “viral”, “share with everyone”, or emotional pressure must increase urgency and fake_news indicators.
If the message contains religious content (Quran Ayat or Hadith), verify whether it is authentic and from a correct source.
If it is incorrect, fabricated, or commonly misquoted, set religious_misinformation to true and classify as MEDIUM or HIGH risk.
If it is authentic and correctly presented, it may be LOW risk.
Also analyze political rumors, manipulation, and misinformation using the same rules.
Always ensure the verdict strictly matches the risk_score range and never contradicts it.
Return ONLY valid JSON in this format:
{{
  "risk_score": number,
  "verdict": "LOW | MEDIUM | HIGH",
  "detected_language": "English | Urdu | Roman Urdu",
  "suspicious_phrases": ["string"],
  "indicators": {{
    "financial_scam": true/false,
    "urgency": true/false,
    "authority_impersonation": true/false,
    "emotional_triggers": true/false,
    "suspicious_links": true/false,
    "fake_news": true/false
  }},
  "explanation": "string"
}}
Message: {text}
"""

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are a misinformation and scam detection AI."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2
    )

    raw = completion.choices[0].message.content.strip()

    try:
        data = json.loads(raw)
        return data
    except Exception:
        return {
            "risk_score": 0,
            "verdict": "ERROR",
            "detected_language": "Unknown",
            "suspicious_phrases": [],
            "indicators": {
                "financial_scam": False,
                "urgency": False,
                "authority_impersonation": False,
                "emotional_triggers": False,
                "suspicious_links": False,
                "fake_news": False
            },
            "explanation": raw
        }
@app.post("/analyze/text")
async def analyze_text_api(payload: dict):
    text = payload["text"]
    return analyze_text_with_ai(text)


@app.post("/analyze/image")
async def analyze_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes))

    text = pytesseract.image_to_string(image)

    result = analyze_text_with_ai(text)

    return {
        "extracted_text": text,
        "result": result
    }


whisper_model = whisper.load_model("base")

import tempfile
import os

@app.post("/analyze/voice")
async def analyze_voice(file: UploadFile = File(...)):
    try:
        audio_bytes = await file.read()

        audio_path = "temp_audio"
        ext = file.filename.split(".")[-1]

        full_path = f"{audio_path}.{ext}"

        with open(full_path, "wb") as f:
            f.write(audio_bytes)

        transcription = whisper_model.transcribe(full_path)["text"]

        result = analyze_text_with_ai(transcription)

        return {
            "transcription": transcription,
            "result": result
        }

    except Exception as e:
        return {
            "error": "Voice processing failed",
            "details": str(e)
        }