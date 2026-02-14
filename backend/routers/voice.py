"""
Voice / speech-to-text endpoint for privacy education demo.
Uses OpenAI Whisper for transcription and ChatGPT to highlight sensitive content.
"""

import io
import os
from typing import Optional
from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

api_key = os.getenv("OPENAI_API_KEY")
if not api_key or api_key == "your-openai-api-key-here":
    raise ValueError("Set OPENAI_API_KEY in .env for voice transcription")
client = OpenAI(api_key=api_key)

# Max file size ~25 MB (Whisper limit)
MAX_FILE_BYTES = 25 * 1024 * 1024
ALLOWED_AUDIO_PREFIXES = ("audio/webm", "audio/mpeg", "audio/mp3", "audio/mp4", "audio/wav", "audio/x-wav", "audio/ogg", "audio/flac", "audio/m4a")


class VoiceTranscribeResponse(BaseModel):
    transcript: str
    sensitive_summary: Optional[str] = None  # Kid-friendly "what it heard" from ChatGPT


@router.post("/voice/transcribe", response_model=VoiceTranscribeResponse)
async def transcribe_voice(audio: UploadFile = File(...)):
    """
    Accepts an audio file, transcribes with Whisper, then uses ChatGPT to
    extract any personal/sensitive info for the privacy education message.
    """
    ct = (audio.content_type or "").lower().split(";")[0].strip()
    if not ct or not any(ct.startswith(p) for p in ALLOWED_AUDIO_PREFIXES):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid content type. Allowed: {', '.join(ALLOWED_AUDIO_PREFIXES)}",
        )

    raw = await audio.read()
    if len(raw) > MAX_FILE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Max size: {MAX_FILE_BYTES // (1024*1024)} MB",
        )

    # Whisper expects a file-like object with a name (for format hint)
    name = audio.filename or "audio.webm"
    if not name.lower().endswith((".webm", ".mp3", ".mp4", ".wav", ".ogg", ".flac", ".m4a")):
        name = "audio.webm"
    file_like = io.BytesIO(raw)
    file_like.name = name

    try:
        # Speech-to-text with OpenAI Whisper
        transcript_response = client.audio.transcriptions.create(
            model="whisper-1",
            file=file_like,
            response_format="text",
        )
        transcript = getattr(transcript_response, "text", None) or (transcript_response if isinstance(transcript_response, str) else "")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

    # Optional: analyze transcript for "sensitive" content (kid-friendly summary)
    sensitive_summary = None
    if transcript.strip():
        try:
            analysis = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": """You are helping a privacy lesson for kids. Given a transcript of something they said,
list ONLY the personal or sensitive things that were mentioned (e.g. name, school, address, password, phone number, birthday).
Keep the reply short and kid-friendly, 1-3 sentences. If nothing personal was said, reply with exactly: "Nothing personal was shared."
Do not lecture; just state what was heard.""",
                    },
                    {"role": "user", "content": transcript},
                ],
                max_tokens=150,
                temperature=0.3,
            )
            sensitive_summary = analysis.choices[0].message.content
        except Exception:
            sensitive_summary = None  # Non-fatal; transcript still returned

    return VoiceTranscribeResponse(
        transcript=transcript.strip() or "(no speech detected)",
        sensitive_summary=sensitive_summary,
    )
