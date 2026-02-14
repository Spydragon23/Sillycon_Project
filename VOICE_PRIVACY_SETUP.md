# Voice Privacy Demo – Setup & Usage

Educational flow: kid taps “Send voice message” → app reveals “It can still hear you” → records for 1 minute → transcribes with **OpenAI Whisper** → sends transcript to **ChatGPT** to detect personal/sensitive content → shows the kid what was “heard.”

---

## 1. Speech-to-text library

The backend uses **OpenAI Whisper** via the official `openai` Python package. No extra library is required; the same dependency you use for chat handles transcription.

- **API:** `client.audio.transcriptions.create(model="whisper-1", file=...)`
- **Docs:** [OpenAI Speech-to-text](https://platform.openai.com/docs/guides/speech-to-text)

---

## 2. Backend setup

### 2.1 Dependencies

No new installs. The existing `openai` and FastAPI stack is enough.

```bash
cd backend
# If you use a venv, activate it first
pip install openai fastapi uvicorn python-dotenv  # if not already
```

### 2.2 Environment

Ensure the backend has a valid OpenAI API key (same as for chat):

```bash
# backend/.env (or project root .env loaded by backend)
OPENAI_API_KEY=sk-...
```

The voice router reads `OPENAI_API_KEY`; if it’s missing or placeholder, the app will raise at import time.

### 2.3 Run the backend

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Or:

```bash
python main.py
```

The voice endpoint is:

- **POST** `/api/voice/transcribe`  
- **Body:** `multipart/form-data` with field `audio` (file).  
- **Response:** `{ "transcript": "...", "sensitive_summary": "..." }`

---

## 3. Frontend setup

### 3.1 Dependencies

No new npm packages. Recording uses the browser **MediaRecorder API**; the rest is `fetch` and existing UI.

### 3.2 Environment

Point the frontend at the backend (optional; defaults to `http://localhost:8000`):

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3.3 Run the frontend

```bash
cd frontend
pnpm install   # if needed
pnpm dev
```

### 3.4 Where the demo lives

- **Page:** `/voice-demo` → `frontend/app/voice-demo/page.tsx`  
  Full-screen demo: “Send voice message” → reveal → record 1 min → upload → show transcript and “what it heard.”

- **API:** `frontend/lib/api.ts`  
  - `uploadVoiceForTranscription(audioBlob: Blob)`  
  - Sends the blob as `recording.webm` to `POST /api/voice/transcribe`.

- **Recording hook:** `frontend/hooks/use-voice-recording.ts`  
  - `useVoiceRecording({ durationSeconds?: number })`  
  - Returns: `state`, `error`, `blob`, `secondsRemaining`, `startRecording`, `stopRecording`, `reset`.

- **UI component:** `frontend/components/voice-privacy-demo.tsx`  
  - Uses the hook + API; you can drop `<VoicePrivacyDemo />` on any page (e.g. `/voice-demo`).

---

## 4. Flow summary

1. User opens `/voice-demo` and taps **“Send voice message”.**
2. Frontend requests microphone; after permission, shows **“It can still hear you”** and starts recording (default 60 seconds).
3. Recording uses **MediaRecorder** (e.g. `audio/webm`); user can stop early.
4. When recording stops, frontend calls **`uploadVoiceForTranscription(blob)`** → **POST /api/voice/transcribe**.
5. Backend:
   - Transcribes with **Whisper** (`whisper-1`).
   - Optionally sends transcript to **ChatGPT** (e.g. `gpt-4o-mini`) with a system prompt to list personal/sensitive info in a short, kid-friendly sentence.
6. Frontend shows **transcript** and **sensitive summary** (“What it heard”).

---

## 5. Backend details

- **Router:** `backend/routers/voice.py`  
- **Endpoint:** `POST /api/voice/transcribe`  
- **Accepted formats:** `audio/webm`, `audio/mpeg`, `audio/mp4`, `audio/wav`, `audio/ogg`, `audio/flac`, `audio/m4a` (by content-type prefix).  
- **Limit:** 25 MB per file (Whisper limit).  
- **Response:**  
  - `transcript`: full Whisper text.  
  - `sensitive_summary`: ChatGPT’s short “what personal stuff was said” or `null` if analysis is skipped/fails.

---

## 6. Optional: use the demo elsewhere

To reuse the flow on another page:

```tsx
import { VoicePrivacyDemo } from "@/components/voice-privacy-demo"

// In your JSX:
<VoicePrivacyDemo />
```

To only use recording + API (e.g. custom UI):

```tsx
import { useVoiceRecording } from "@/hooks/use-voice-recording"
import { uploadVoiceForTranscription } from "@/lib/api"

const { state, blob, startRecording, stopRecording } = useVoiceRecording({ durationSeconds: 60 })
// When blob is set (after stop), call uploadVoiceForTranscription(blob)
```

---

## 7. Troubleshooting

| Issue | What to check |
|-------|----------------|
| “Set OPENAI_API_KEY” on startup | `backend/.env` (or wherever `load_dotenv()` runs) has `OPENAI_API_KEY=sk-...`. |
| 400 Invalid content type | Backend allows `audio/*` with the prefixes listed above; browser usually sends `audio/webm` or `audio/webm;codecs=opus` (we accept by prefix). |
| Microphone not working | HTTPS or localhost; user must grant mic permission. |
| CORS errors | Backend `main.py` already allows `localhost:3000` (and similar). If using another origin, add it to `allow_origins`. |
| Transcription empty | Whisper can return empty for silence or very short/no speech; we show “(no speech detected)” in that case. |
