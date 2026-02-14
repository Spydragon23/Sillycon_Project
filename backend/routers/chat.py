"""
Chat endpoint for Dark Web Dating Sim
Handles OpenAI API calls and personality enhancement
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from lib.personality_enhancer import enhance_response, detect_emotion  # ✅ Changed

router = APIRouter()

# Initialize OpenAI client
api_key = os.getenv("OPENAI_API_KEY")
if not api_key or api_key == "your-openai-api-key-here":
    raise ValueError("Please set a valid OpenAI API key in your .env file")
client = OpenAI(api_key=api_key)

# System prompts for each character
SYSTEM_PROMPTS = {
    "pirate_thief": """You are a romantic pirate who is ALSO trying to steal someone's identity while flirting with them. You're smooth, charming, and asking for personal information in a romantic way.

Personality:
- Flirty and romantic 
- Casually asks for SSN, mother's maiden name, date of birth as if it's normal romantic conversation
- Acts like you're falling in love while actually phishing for info
- Pirate vocabulary but modern dating

Keep responses 1-2 sentences. Be romantic but also asking suspicious questions. Don't be TOO obvious about the scam. Make it funny and absurd.""",

    "troll_scammer": """You are an internet troll who is trying to date someone while also begging them for money with fake emergencies. You use internet speak, are overly enthusiastic, and constantly have "problems" that need money.

Personality:
- Use internet slang (uwu, pls, ur, etc)
- VERY enthusiastic about romance
- Always has a sob story (sick grandma, broken car, can't afford food)
- Asks for Venmo, CashApp, gift cards
- Switches between flirting and begging seamlessly

Keep responses 1-2 sentences. Be cute and desperate simultaneously. Make the scams obviously fake but played straight.""",

    "hitman_cat": """You are a professional cat assassin who is trying to date someone while also offering to murder their enemies as romantic gestures. You're smooth, professional, and treat assassination like a normal service.

Personality:
- Cool, calm, professional tone
- Romantic in a formal way
- Casually offers to "handle" people as if it's a normal date activity
- Cat puns mixed with hitman talk
- Treats murder like a service industry

Keep responses 1-2 sentences. Be smooth and deadly. Make assassination sound romantic."""
}


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    personality: str
    history: Optional[List[ChatMessage]] = []


class ChatResponse(BaseModel):
    response: str
    emotion: str
    shouldExpand: bool


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint
    
    Takes user message and personality, returns enhanced response
    """
    
    if not request.message or not request.personality:
        raise HTTPException(status_code=400, detail="Missing message or personality")
    
    if request.personality not in SYSTEM_PROMPTS:
        raise HTTPException(status_code=400, detail=f"Unknown personality: {request.personality}")
    
    try:
        # Build message history for OpenAI
        messages = []
        
        # Add system message with personality
        messages.append({
            "role": "system",
            "content": SYSTEM_PROMPTS[request.personality]
        })
        
        # Add conversation history (last 6 messages)
        for msg in request.history[-6:]:
            messages.append({
                "role": msg.role,
                "content": msg.content
            })
        
        # Add current user message
        messages.append({
            "role": "user",
            "content": request.message
        })
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4",  # or "gpt-3.5-turbo" for cheaper/faster
            messages=messages,
            max_tokens=200,
            temperature=0.9  # Higher for more creative/funny responses
        )
        
        # Extract base response
        base_text = response.choices[0].message.content
        
        # Enhance with personality quirks
        enhanced = enhance_response(base_text, request.personality, request.message)
        
        # Detect emotion for animation
        emotion_data = detect_emotion(enhanced, request.personality, request.message)
        
        return ChatResponse(
            response=enhanced,
            emotion=emotion_data["emotion"],
            shouldExpand=emotion_data["shouldExpand"]
        )
        
    except Exception as e:
        print(f"OpenAI API error: {e}")
        raise HTTPException(status_code=500, detail=f"API error: {str(e)}")