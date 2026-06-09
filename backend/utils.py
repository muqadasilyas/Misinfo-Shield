import whisper
import pytesseract
from PIL import Image

# Load Whisper once
whisper_model = whisper.load_model("base")

def speech_to_text(audio_file):
    result = whisper_model.transcribe(audio_file)
    return result["text"]

def image_to_text(image_file):
    img = Image.open(image_file)
    text = pytesseract.image_to_string(img, lang="eng+urd")
    return text