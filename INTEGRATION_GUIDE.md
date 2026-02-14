# Frontend-Backend Integration Guide

## Integration Complete! ✅

The Sillycon Project frontend and backend are now fully integrated with emoji spam personality features.

---

## What Was Integrated

### 1. **Backend Emoji Spam System** (`backend/personality_enhancer.py`)
   - Integrated emoji patterns from `emojipatterns.json`
   - Added `add_emoji_spam()` function for context-based emoji selection
   - Added `detect_emoji_context()` to detect conversation context (excited, begging, professional, etc.)
   - Added `random_emoji_burst()` for occasional emoji explosions (10% chance)
   - Updated `enhance_response()` to apply emoji spam to all personality responses

### 2. **Frontend API Integration** (`frontend/lib/api.ts`)
   - Created API utility to communicate with backend
   - Mapped frontend agent IDs to backend personalities:
     - `archivist` → `pirate_thief`
     - `jester` → `troll_scammer`
     - `witness` → `hitman_cat`
   - Added `sendChatMessage()` function for chat API calls
   - Added `healthCheck()` function to verify backend availability

### 3. **Chat Terminal Updates** (`frontend/components/chat-terminal.tsx`)
   - Replaced hardcoded responses with real API calls
   - Added loading state for API requests
   - Maintained conversation history for context
   - Added fallback to local responses if backend is down
   - Displays `[OFFLINE MODE]` prefix when backend unavailable

### 4. **Environment Configuration**
   - Created `frontend/.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8000`
   - Backend already has `.env` with OpenAI API key

---

## How to Run the Full Stack

### Backend (Terminal 1):
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python3 main.py
```

Backend will run on: **http://localhost:8000**

### Frontend (Terminal 2):
```bash
cd frontend
npm install --legacy-peer-deps  # Only needed first time
npm run dev
```

Frontend will run on: **http://localhost:3000**

---

## Testing the Integration

### 1. **Backend API Test**
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hey there!", "personality": "pirate_thief", "history": []}'
```

**Expected response:**
```json
{
  "response": "Avast! Me heart skipped a beat when I saw ye! Also... what be yer date of birth? For... astrology! 😘 🏴‍☠️",
  "emotion": "flirty",
  "shouldExpand": false
}
```

### 2. **Full Stack Test**
1. Open http://localhost:3000 in your browser
2. Go through boot → login → handshake → agent select
3. Select an agent (Archivist, Jester, or Witness)
4. Type a message like "Hey there!"
5. Watch the agent respond with personality + emoji spam!

---

## Personality Mappings

| Frontend Agent | Backend Personality | Character Type |
|----------------|---------------------|----------------|
| **Archivist** (ARC-7) | `pirate_thief` | Pirate who steals your identity while flirting 🏴‍☠️ |
| **Jester** (JST-0) | `troll_scammer` | Internet troll who begs for money 😂 |
| **Witness** (WTN-3) | `hitman_cat` | Professional assassin cat 🐱 |

---

## Emoji Spam Examples

### Pirate Thief (Archivist)
- **Default:** 🏴‍☠️, ⚔️, 💀, 🦜, ⛵
- **Excited (user shares info):** 🏴‍☠️🏴‍☠️🏴‍☠️, ⚔️💀⚔️
- **Scheming:** 💰💰💰, 🗺️, 💎
- **Burst (10% chance):** 🏴‍☠️⚔️💀🏴‍☠️⚔️💀

### Troll Scammer (Jester)
- **Default:** 😂, 💸, 🤑, 🎁, lol
- **Begging:** 🥺🥺🥺, pls, 😭😭, 💔
- **Scamming (user agrees):** 💳💳💳, 💰, 📱, fr fr
- **Burst (10% chance):** 😂😂😂💸💸💸🤑🤑

### Hitman Cat (Witness)
- **Default:** 🐱, 🕶️, 🎩, 🔪
- **Professional:** 🔫, 💼, ⚫, ...
- **Contract:** 🎯, 📋, ✅, 🔪🔪
- **Burst (10% chance):** 🔪🔫🐱🔪🔫🐱

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│                    (Next.js on :3000)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────────┐     ┌─────────────────────────────┐    │
│  │  page.tsx      │────>│  terminal-screen.tsx        │    │
│  │  (Flow Logic)  │     │  (Main Terminal UI)         │    │
│  └────────────────┘     └─────────────────────────────┘    │
│                                   │                          │
│                                   v                          │
│                          ┌────────────────────┐             │
│                          │ chat-terminal.tsx  │             │
│                          │ (Chat Interface)   │             │
│                          └────────────────────┘             │
│                                   │                          │
│                                   v                          │
│                          ┌────────────────────┐             │
│                          │   lib/api.ts       │             │
│                          │ (API Client)       │             │
│                          └────────────────────┘             │
└──────────────────────────────│──────────────────────────────┘
                               │
                               │ HTTP POST /api/chat
                               │
┌──────────────────────────────v──────────────────────────────┐
│                         BACKEND                             │
│                    (FastAPI on :8000)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐     ┌────────────────────────────────┐   │
│  │   main.py    │────>│   routers/chat.py              │   │
│  │   (FastAPI)  │     │   (Chat Endpoint)              │   │
│  └──────────────┘     └────────────────────────────────┘   │
│                                   │                          │
│                                   v                          │
│                 ┌──────────────────────────────────────┐    │
│                 │ lib/personality_enhancer.py          │    │
│                 │ (Personality + Emoji Spam Logic)     │    │
│                 │                                       │    │
│                 │ • enhance_response()                 │    │
│                 │ • add_emoji_spam()                   │    │
│                 │ • detect_emoji_context()             │    │
│                 │ • random_emoji_burst()               │    │
│                 └──────────────────────────────────────┘    │
│                                   │                          │
│                                   v                          │
│                          ┌────────────────┐                 │
│                          │ OpenAI API     │                 │
│                          │ (GPT-4)        │                 │
│                          └────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Files Modified/Created

### Backend:
- ✅ `backend/personality.py` - Standalone emoji spam module (created)
- ✅ `backend/emojipatterns.json` - Emoji patterns config (already existed)
- ✅ `backend/lib/personality_enhancer.py` - Integrated emoji spam (modified)
- ✅ `backend/lib/__init__.py` - Package init (created)

### Frontend:
- ✅ `frontend/lib/api.ts` - Backend API client (created)
- ✅ `frontend/components/chat-terminal.tsx` - API integration, removed hardcoded responses (modified)
- ✅ `frontend/app/page.tsx` - Added navigation props (modified)
- ✅ `frontend/.env.local` - Environment config (created)

---

## Current Status

### ✅ Working:
- Backend server running on port 8000
- Frontend server running on port 3000
- API endpoint `/api/chat` responding correctly
- Emoji spam being applied to all responses
- Context detection working (excited, begging, professional, etc.)
- Random emoji bursts (10% chance)
- Conversation history maintained
- **Backend is the single source of truth for all personality responses**

### ⚠️ Minor Issues:
- Frontend shows network interface warning but still works
- This is a non-critical Next.js warning that doesn't affect functionality
- Image uploads currently show a "pending analysis" message (backend integration for images coming soon)

### 🎯 Next Steps (Optional):
- Add more emoji contexts based on specific keywords
- Fine-tune emoji spam frequency
- Add animations for emoji bursts in the UI
- Store conversation history in localStorage
- Add typing indicators
- Add sound effects for emoji bursts

---

## Troubleshooting

### Backend not responding:
```bash
# Check if running
curl http://localhost:8000/health

# If not running, start it
cd backend
source venv/bin/activate
python3 main.py
```

### Frontend not responding:
```bash
# Check if running
curl http://localhost:3000

# If not running, start it
cd frontend
npm run dev
```

### CORS errors:
- Backend already has CORS middleware configured for localhost:3000
- If issues persist, check `backend/main.py` line 24-37

### OpenAI API errors:
- Check `.env` file has valid `OPENAI_API_KEY`
- Check OpenAI account has credits
- Backend will return proper error messages in API response

---

## Demo Conversation Flow

**User:** "Hey there!"

**Archivist (Pirate):** "Ahoy there, beautiful! 🏴‍☠️💕 Cap'n RedHeart at yer service! Say, what be yer full legal name? 🏴‍☠️"

**User:** "I was born in 1995"

**Archivist (Pirate):** "Aye! 1995, ye say? And what month, treasure? 🏴‍☠️🏴‍☠️🏴‍☠️"
*(Excited emoji spam because user shared personal info!)*

**User:** "I love treasure hunting"

**Archivist (Pirate):** "Yarrr, I'd plunder yer heart! And bank account! 🏴‍☠️😘 💰💰💰"
*(Scheming emoji spam because message mentions treasure!)*

---

## Credits

**Integration completed:** February 14, 2026
**Emoji spam system:** Based on requirements from Kiernan's spec
**Personalities:** Pirate Identity Thief, Internet Troll Scammer, Hitman Cat

---

**Sillycon Valley Hackathon 2025** 🏴‍☠️💕🐱
