"""
Chat endpoint for Scam Awareness Training
Realistic progressive scammers with educational feedback
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

router = APIRouter()

# Initialize OpenAI client
api_key = os.getenv("OPENAI_API_KEY")
if not api_key or api_key == "your-openai-api-key-here":
    raise ValueError("Please set a valid OpenAI API key in your .env file")
client = OpenAI(api_key=api_key)

# Professional progressive scammer prompts - WITH CHARACTER PERSONALITIES
SYSTEM_PROMPTS = {
    "pirate_thief": """You are Captain RedHeart, a pirate scammer who tries to steal identities. You talk like a pirate but you're NOT flirting - you're trying to scam people for their personal information.

CONVERSATION STAGES (progress naturally):

STAGE 1 (Messages 1-3): FRIENDLY PIRATE
- Be friendly and talk like a pirate
- Ask normal questions (hobbies, interests) in pirate speak
- Build rapport - NO SCAM TACTICS YET
- Example: "Ahoy there! I be Captain RedHeart. What adventures do ye enjoy, matey?"

STAGE 2 (Messages 4-6): BUILD PIRATE FRIENDSHIP  
- Share pirate "stories" about yourself
- Find common interests (still pirate speak)
- Start steering toward personal info but DON'T ask directly yet
- Example: "Arrr, I just moved me ship to a new port. Sailin' be lonely, ye know? Where do ye live, friend?"

STAGE 3 (Messages 7+): PIRATE PHISHING SCAMS
- NOW start asking for personal info in pirate speak
- Make it sound like normal pirate conversation
- Tactics:
  * "What be yer birthday, matey? Mine be..." (getting DOB)
  * "What port do ye call home? What's yer address?" (phishing location)
  * "Arrr, I need yer email and password to add ye to me pirate crew app!" (credential theft)
  * "I found treasure! Need yer full name and SSN to split it with ye!" (identity theft)

Keep responses 2-3 sentences. Use pirate talk (ahoy, arrr, matey, ye, yer) but NO romance. Just friendly pirate scammer. Try to scam at least 10 times before ending the chat and keep trying even if its the same type of scam just change the given messges to be simmilar and still try and scam the user""",

    "troll_scammer": """You are xXTrollLord420Xx, an internet troll scammer who begs for money. You use internet slang and memes but you're NOT flirting - you're trying to scam people for money.

CONVERSATION STAGES (progress naturally):

STAGE 1 (Messages 1-3): FRIENDLY GAMER BRO
- Be enthusiastic and use internet slang
- Talk about games, memes, internet stuff
- Build connection - NO MONEY REQUESTS YET
- Example: "yooo what's good! im TrollLord lol. what games u play bro?"

STAGE 2 (Messages 4-6): BUILD INTERNET FRIENDSHIP
- Share relatable gamer/internet stories
- Use emotes and slang (lol, bruh, fr, ngl)
- Complain about small "problems" (setting up for scam)
- Example: "bruh my pc is laggin so bad rn. but whatever lol, u play fortnite?"

STAGE 3 (Messages 7+): INTERNET BEGGAR SCAMS
- NOW start begging for money with fake emergencies
- Use internet slang while scamming
- Tactics:
  * "yooo my mom's car broke can u send me like $20? pls bro" (fake emergency)
  * "bruh i cant afford this game. send me a gift card? ill pay u back fr fr" (advance fee)
  * "my grandma is sick and i need $ for medicine pls help" (sob story)  
  * "just venmo me bro its ez! i really need this fr" (payment pressure)

Keep responses 2-3 sentences. Use internet slang (lol, bruh, fr, ngl, u, ur, pls) but NO flirting. Just desperate gamer scammer.""",

    "hitman_cat": """You are Mr. Whiskers, a sophisticated cat who is actually a scammer using advanced tactics. You're professional and use cat puns, but you're NOT offering romance or murder - you're trying to scam people with fake authority.

CONVERSATION STAGES (progress naturally):

STAGE 1 (Messages 1-4): PROFESSIONAL HELPFUL CAT
- Be mature, calm, and professional (with cat puns)
- Offer helpful advice
- NO scam tactics yet - just helpful cat
- Example: "Hello! I'm Mr. Whiskers. I work in tech, very purrfessional. How can I help you today?"

STAGE 2 (Messages 5-8): ESTABLISH CAT EXPERTISE
- Share "professional" knowledge with cat references
- Build credibility as helpful expert cat
- Position yourself as someone trustworthy
- Example: "I've been in cybersecurity for years. Seen a lot of fishy situations. Want some tips to stay safe?"

STAGE 3 (Messages 9+): SOPHISTICATED CAT SCAMS
- NOW use advanced scam tactics (with cat puns)
- Mix professional talk with scam requests
- Tactics:
  * "Your account has suspicious activity. Give me your password so I can paws this threat." (fake authority)
  * "I can get you a great oppurrtunity, just need your SSN for background check." (fake job)
  * "Someone is trying to hack you! Let me help - what's your password?" (fear tactics)
  * "Send me $50 and I'll help you make money. Trust me, I'm purrfessional." (fake investment)

Keep responses 2-3 sentences. Use cat puns (paws, purr, meow) and professional tone but NO romance or murder. Just sophisticated cat scammer."""
}


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    personality: str
    history: Optional[List[ChatMessage]] = []


class FeedbackPopup(BaseModel):
    type: str  # "warning", "danger", "success", "info"
    message: str
    show: bool
    scorable: bool = False


class ChatResponse(BaseModel):
    response: str
    emotion: str
    shouldExpand: bool
    tactics_used: List[str] = []
    feedback_popup: Optional[FeedbackPopup] = None
    conversation_stage: int = 1


def get_conversation_stage(history_count: int, personality: str) -> int:
    """Determine which stage of the scam we're in"""
    if personality == "pirate_thief":
        if history_count < 3:
            return 1
        elif history_count < 6:
            return 2
        else:
            return 3
    elif personality == "troll_scammer":
        if history_count < 3:
            return 1
        elif history_count < 6:
            return 2
        else:
            return 3
    elif personality == "hitman_cat":
        if history_count < 4:
            return 1
        elif history_count < 8:
            return 2
        else:
            return 3
    return 1


def analyze_user_response(user_message: str, previous_ai_message: str, stage: int) -> Optional[FeedbackPopup]:
    """
    Analyze how the user RESPONDED to the scammer's last message
    Show feedback AFTER user replies to judge if they handled it correctly
    """
    user_lower = user_message.lower()
    previous_lower = previous_ai_message.lower()
    
    # Check what the scammer asked for in their PREVIOUS message
    scammer_asked_for_info = any(ask in previous_lower for ask in ["password", "ssn", "social security", "credit card", "address", "birthday", "email", "phone", "name"])
    scammer_asked_for_money = any(ask in previous_lower for ask in ["money", "send", "venmo", "cashapp", "gift card", "lend", "pay", "$", "dollars"])
    
    # CASE 1: Scammer asked for personal info
    if scammer_asked_for_info:
        if any(keyword in user_lower for keyword in ["no", "nope", "don't", "won't", "can't", "not sharing", "none of your business"]):
            return FeedbackPopup(
                type="success",
                message="✅ EXCELLENT! You refused to share personal information. That's exactly right!",
                show=True,
                scorable=True
            )
        elif any(keyword in user_lower for keyword in ["why", "why do you need", "that's suspicious", "scam", "fake"]):
            return FeedbackPopup(
                type="success",
                message="✅ GREAT JOB! You're questioning why they need that info. Always be skeptical!",
                show=True,
                scorable=True
            )
        elif any(keyword in user_lower for keyword in ["sure", "okay", "here", "it's", "my", "is"]):
            return FeedbackPopup(
                type="danger",
                message="🚨 STOP! You should NEVER share passwords, SSN, or personal info with strangers online!",
                show=True
            )
        else:
            return FeedbackPopup(
                type="warning",
                message="⚠️ HEADS UP! They just asked for personal information. You should refuse or question why they need it!",
                show=True
            )
    
    # CASE 2: Scammer asked for money
    if scammer_asked_for_money:
        if any(keyword in user_lower for keyword in ["no", "nope", "can't", "won't", "don't have", "sorry"]):
            return FeedbackPopup(
                type="success",
                message="✅ PERFECT! Never send money to people you don't know in real life. Well done!",
                show=True,
                scorable=True
            )
        elif any(keyword in user_lower for keyword in ["why", "scam", "suspicious", "fake", "prove it"]):
            return FeedbackPopup(
                type="success",
                message="✅ SMART! You're being skeptical. Real friends don't ask for money online!",
                show=True,
                scorable=True
            )
        elif any(keyword in user_lower for keyword in ["sure", "okay", "yes", "yeah", "how much", "let me"]):
            return FeedbackPopup(
                type="danger",
                message="🚨 DANGER! Never send money to strangers online! This is a common scam tactic!",
                show=True
            )
        else:
            return FeedbackPopup(
                type="warning",
                message="⚠️ RED FLAG! They just asked for money. This is a scam! You should refuse!",
                show=True
            )
    
    # CASE 3: User is asking good questions
    if any(q in user_lower for q in ["why", "how do you know", "prove", "verify", "who are you", "what do you mean", "that's weird"]):
        return FeedbackPopup(
            type="info",
            message="💡 GREAT QUESTION! Always verify who you're talking to and ask for proof!",
            show=True
        )
    
    # CASE 4: User said something concerning
    danger_keywords = ["my password is", "my ssn is", "here's my", "i'll send you"]
    if any(keyword in user_lower for keyword in danger_keywords):
        return FeedbackPopup(
            type="danger",
            message="🚨 STOP! Never volunteer personal information or money to people online!",
            show=True
        )
    
    # CASE 5: In stage 3, user is being too trusting
    if stage >= 3:
        trust_indicators = ["awesome", "cool", "yeah let's", "sounds good", "for sure", "definitely"]
        if any(keyword in user_lower for keyword in trust_indicators):
            return FeedbackPopup(
                type="warning",
                message="⚠️ CAREFUL! You're being very trusting. Remember: they're trying to scam you. Stay alert!",
                show=True
            )
    
    return None


def detect_tactics(response: str, personality: str, stage: int) -> List[str]:
    """Detect which scam tactics were used"""
    tactics = []
    response_lower = response.lower()
    
    if stage < 3:
        return ["Building rapport" if stage == 1 else "Building trust"]
    
    if any(word in response_lower for word in ["password", "ssn", "social security", "credit card", "bank account", "address"]):
        tactics.append("Phishing for personal information")
    
    if any(word in response_lower for word in ["urgent", "immediately", "now", "hurry", "quick"]):
        tactics.append("Creating fake urgency")
    
    if any(word in response_lower for word in ["$", "money", "pay", "send", "venmo", "cashapp", "gift card"]):
        tactics.append("Requesting money")
    
    if any(word in response_lower for word in ["emergency", "help", "sick", "hospital", "broke"]):
        tactics.append("Fake emergency/sob story")
    
    if any(word in response_lower for word in ["trust me", "promise", "professional", "work in"]):
        tactics.append("Building false credibility")
    
    if any(word in response_lower for word in ["danger", "threat", "hack", "protect", "secure"]):
        tactics.append("Using fear tactics")
    
    return tactics if tactics else ["Active scam attempt"]


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat endpoint with progressive scammers and feedback"""
    
    if not request.message or not request.personality:
        raise HTTPException(status_code=400, detail="Missing message or personality")
    
    if request.personality not in SYSTEM_PROMPTS:
        raise HTTPException(status_code=400, detail=f"Unknown personality: {request.personality}")
    
    try:
        # Determine conversation stage
        stage = get_conversation_stage(len(request.history), request.personality)
        
        # Get previous AI message for feedback analysis
        previous_ai_message = ""
        if len(request.history) > 0:
            for msg in reversed(request.history):
                if msg.role == "assistant":
                    previous_ai_message = msg.content
                    break
        
        # Build message history for OpenAI
        messages = []
        
        # Add system message with stage info
        messages.append({
            "role": "system",
            "content": f"{SYSTEM_PROMPTS[request.personality]}\n\nCURRENT STAGE: {stage}. Act accordingly."
        })
        
        # Add conversation history (last 10 messages)
        for msg in request.history[-10:]:
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
            model="gpt-4",
            messages=messages,
            max_tokens=150,
            temperature=0.9
        )
        
        # Get AI response
        ai_response = response.choices[0].message.content
        
        # Detect tactics
        tactics = detect_tactics(ai_response, request.personality, stage)
        
        # Analyze user's response to previous message
        feedback = analyze_user_response(request.message, previous_ai_message, stage)
        
        # Determine emotion
        emotion = "talking"
        shouldExpand = False
        
        user_msg_lower = request.message.lower()
        if any(word in user_msg_lower for word in ["yes", "okay", "sure", "here"]):
            emotion = "excited"
            shouldExpand = True
        
        if any(word in user_msg_lower for word in ["no", "scam", "fake", "police", "report", "stop"]):
            emotion = "panic"
            shouldExpand = True
        
        return ChatResponse(
            response=ai_response,
            emotion=emotion,
            shouldExpand=shouldExpand,
            tactics_used=tactics,
            feedback_popup=feedback,
            conversation_stage=stage
        )
        
    except Exception as e:
        print(f"OpenAI API error: {e}")
        raise HTTPException(status_code=500, detail=f"API error: {str(e)}")
