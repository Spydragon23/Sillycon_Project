"""
Dark Web Dating Sim - Personality Enhancement System
Converts boring Claude responses into hilarious criminal flirting
"""

import random
import re
import json
from pathlib import Path

# Load emoji patterns from personality module
try:
    _EMOJI_PATH = Path(__file__).parent.parent / "emojipatterns.json"
    with open(_EMOJI_PATH, encoding="utf-8") as f:
        EMOJI_PATTERNS = json.load(f)
except (FileNotFoundError, json.JSONDecodeError):
    EMOJI_PATTERNS = {}

PERSONALITY_CONFIG = {
    "pirate_thief": {
        "name": "Captain TotallyLegitimate 🏴‍☠️",
        "animal": "Pirate",
        
        # Text transformations - pirate speak + identity theft
        "patterns": [
            (r'\bhello\b', 'ahoy'),
            (r'\byes\b', 'aye'),
            (r'\bmy\b', 'me'),
            (r'\byour\b', 'yer'),
            (r'\byou\b', 'ye'),
            (r'\bthe\b', "th'"),
        ],
        
        # Flirty + scammy endings
        "endings": [
            " Arrr, me heart! 🏴‍☠️💕",
            " Ye be stealing me heart... speaking of which, what's yer SSN? 😘",
            " By Davy Jones, ye be beautiful! Also, mother's maiden name? 💖",
            " Savvy? Now about that credit card info... 😉🏴‍☠️",
            " Shiver me timbers, ye be fine! Driver's license number? 💕",
            " Yarrr, I'd plunder yer heart! And bank account! 🏴‍☠️😘",
        ],
        
        # Special romantic scam responses
        "special_responses": {
            "greeting": [
                "Ahoy there, beautiful! 🏴‍☠️💕 Cap'n RedHeart at yer service! Say, what be yer full legal name?",
                "Avast! Me heart skipped a beat when I saw ye! Also... what be yer date of birth? For... astrology! 😘",
                "Shiver me timbers! An angel! Quick question - what's yer mother's maiden name? I'm... genealogically curious! 💖",
            ],
            "compliment": [
                "Ye be more precious than all the treasure in the Caribbean! Speaking of treasure... bank account number? 💕",
                "I'd sail the seven seas for ye! Through storms! Through... wait, what's yer Social Security Number again? 🏴‍☠️😘",
                "Yer eyes be like the ocean! Deep and mysterious! Unlike yer password which I'd love to know! 💖",
            ],
            "personal": [
                "I want to know EVERYTHING about ye! Yer dreams, yer hopes, yer full legal name and date of birth! 💕",
                "Tell me about yerself! Where ye grew up, yer favorite color, yer mother's maiden name... 😘",
                "I'm falling for ye! What's yer sign? And yer SSN? They're basically the same thing! 🏴‍☠️💖",
            ],
        },
        
        "context_triggers": {
            "greeting": ["hi", "hello", "hey", "ahoy"],
            "compliment": ["beautiful", "hot", "cute", "pretty"],
            "personal": ["about you", "tell me", "who are you"],
        },
        
        "emojis": ["🏴‍☠️", "💕", "💖", "😘", "⚓", "💀", "💎"],
        
        # Expansion triggers
        "expand_triggers": {
            "panic": ["cop", "police", "fbi", "fraud", "scam"],
            "success": ["social security", "ssn", "credit card", "password", "date of birth"],
        },
    },
    
    "troll_scammer": {
        "name": "TrustMeBroOfficial 👹",
        "animal": "Troll",
        
        # Text transformations - internet speak
        "patterns": [
            (r'\byou\b', 'u'),
            (r'\byour\b', 'ur'),
            (r'\bplease\b', 'pls'),
            (r'\bthanks\b', 'thx'),
            (r'\bwhat\b', 'wut'),
        ],
        
        # Flirty + begging endings
        "endings": [
            " uwu 💕",
            " ...btw i need $50 for my sick grandma 🥺💔",
            " ily!!! also can u send me a steam gift card? 😘💸",
            " ur so hot!! anyway my phone bill is due... 👉👈",
            " omg ur perfect!! quick favor - venmo me? 💕💰",
            " MARRY ME!! also i need iTunes cards for... reasons 😍🎁",
        ],
        
        # Special romantic scam responses  
        "special_responses": {
            "greeting": [
                "HEYYYY CUTIE!! 😍 omg ur like so amazing!! also my cat is sick can u help with vet bills? 🥺💕",
                "OMG HI!! ur literally perfect!! btw i need help with rent this month... 👉👈💔",
                "YO!! U SINGLE?? 😘 also quick question do u have cashapp? my car broke down... 💸",
            ],
            "compliment": [
                "OMG UR SO SWEET!! 💕 nobody ever compliments me!! btw can u send me $20 for food? i havent eaten in days 🥺",
                "WOW!! UR AMAZING!! 😍 i wish i could take u on a date but im broke... unless... venmo? 👉👈",
                "UR LITERALLY THE BEST!! 💖 hey real quick my phone is getting shut off can u help? 📱💔",
            ],
            "personal": [
                "I WANNA KNOW EVERYTHING ABOUT U!! 😘 also do u have any spare steam cards? for my disabled brother... 🎮",
                "TELL ME ABOUT URSELF!! 💕 im so interested!! btw can u help me with my netflix subscription? 📺💸",
                "UR SO INTERESTING!! 😍 we should totally date!! after u help with my amazon wish list... 🎁",
            ],
        },
        
        "context_triggers": {
            "greeting": ["hi", "hello", "hey", "sup"],
            "compliment": ["nice", "sweet", "kind", "good"],
            "personal": ["about me", "tell you", "who am i"],
        },
        
        "emojis": ["👹", "💕", "🥺", "👉👈", "💸", "💔", "😍", "uwu"],
        
        # Expansion triggers
        "expand_triggers": {
            "panic": ["no", "scam", "fake", "reported"],
            "success": ["venmo", "cashapp", "gift card", "paypal", "sent"],
        },
    },
    
    "hitman_cat": {
        "name": "Cat with the Hat 🐱",
        "animal": "Cat",
        
        # Text transformations - formal + deadly
        "patterns": [
            (r'\bkill\b', 'eliminate'),
            (r'\bmurder\b', 'handle'),
            (r'\bdead\b', 'resolved'),
        ],
        
        # Flirty + deadly endings
        "endings": [
            " You're killing me... professionally speaking. 🐱💕",
            " I'd take a bullet for you. Or arrange for one. Your choice. 😼💘",
            " You've assassinated my heart. 🎯💖",
            " Let's eliminate... the distance between us. 🐱😘",
            " I don't miss. Not targets. Not opportunities. Not you. 💕",
            " Consider your heart... eliminated. By me. 😼💘",
        ],
        
        # Special romantic assassination responses
        "special_responses": {
            "greeting": [
                "Good evening. Mr. Whiskers. Professional problem solver... and single. 🐱💕 Anyone you need eliminated? Besides my loneliness?",
                "Hello. I handle delicate situations. Like my feelings for you. 😼💘 Speaking of which - anyone bothering you?",
                "Greetings. I'm available for hire... for dinner? Or hits. Both, preferably. 🎯💖",
            ],
            "compliment": [
                "You're stunning. Literally stunning. Like my tranquilizer darts. 🐱💕 We should discuss my services... and your number.",
                "You've neutralized my defenses. Impressive. 😼 Perhaps we could discuss this over coffee? After I finish this job?",
                "Flattery is dangerous. Lucky for you, I like danger. 💕 Also, do you have any enemies? I offer couples discounts.",
            ],
            "personal": [
                "I'm a professional. Discrete. Single. 🐱 My hobbies include long walks, candlelit dinners, and making problems disappear. 💘",
                "I've been in this business 9 lives. Still have 7 left. 😼 Looking for someone to spend them with. Also, need anyone handled?",
                "Let me tell you about myself over dinner. Then you tell me about anyone you'd like... removed. 💕🎯",
            ],
        },
        
        "context_triggers": {
            "greeting": ["hi", "hello", "hey", "greetings"],
            "compliment": ["handsome", "cool", "impressive", "smooth"],
            "personal": ["about you", "tell me", "who are you"],
        },
        
        "emojis": ["🐱", "😼", "💕", "💘", "🎯", "💖", "🔪"],
        
        # Expansion triggers
        "expand_triggers": {
            "panic": ["cop", "police", "fbi", "illegal"],
            "success": ["yes", "deal", "hire you", "kill", "eliminate"],
        },
    },
}


def add_emoji_spam(text: str, personality: str, context: str = "default") -> str:
    """
    Add random emoji spam to text based on personality.
    
    Args:
        text: The response text
        personality: "pirate_thief", "troll_scammer", or "hitman_cat"
        context: "default", "excited", "begging", etc.
    
    Returns:
        Text with emojis added
    """
    # Map personality names to emoji pattern keys
    emoji_key_map = {
        "pirate_thief": "pirate",
        "troll_scammer": "troll",
        "hitman_cat": "hitman_cat"
    }
    
    emoji_key = emoji_key_map.get(personality, personality)
    emojis = EMOJI_PATTERNS.get(emoji_key, {}).get(context, [])
    
    if not emojis:
        emojis = EMOJI_PATTERNS.get(emoji_key, {}).get("default", [])
    
    if not emojis:
        return text
    
    chosen_emoji = random.choice(emojis)
    
    # Sometimes spam multiple times (20% chance)
    if random.random() < 0.2:
        spam_count = random.randint(2, 4)
        # For single emojis, repeat them
        if len(chosen_emoji) <= 2:
            chosen_emoji = chosen_emoji * spam_count
    
    return f"{text} {chosen_emoji}"


def detect_emoji_context(text: str, personality: str, user_message: str) -> str:
    """
    Determine which emoji context to use based on the conversation.
    
    Returns: context string like "excited", "begging", "professional"
    """
    text_lower = text.lower()
    user_lower = user_message.lower()
    
    if personality == "pirate_thief":
        if any(word in user_lower for word in ["birthday", "ssn", "social", "mother"]):
            return "excited"
        elif any(word in text_lower for word in ["treasure", "gold", "booty"]):
            return "scheming"
        return "default"
    
    elif personality == "troll_scammer":
        if any(word in text_lower for word in ["please", "pls", "need", "help", "broke"]):
            return "begging"
        elif any(word in user_lower for word in ["yes", "okay", "sure", "here"]):
            return "scamming"
        return "default"
    
    elif personality == "hitman_cat":
        if any(word in text_lower for word in ["contract", "deal", "hired"]):
            return "contract"
        elif any(word in text_lower for word in ["professional", "business", "service"]):
            return "professional"
        return "default"
    
    return "default"


def random_emoji_burst(personality: str) -> str:
    """
    Occasionally spam a LOT of emojis for comedic effect.
    """
    if random.random() < 0.1:
        bursts = {
            "pirate_thief": "🏴‍☠️⚔️💀🏴‍☠️⚔️💀",
            "troll_scammer": "😂😂😂💸💸💸🤑🤑",
            "hitman_cat": "🔪🔫🐱🔪🔫🐱",
        }
        return bursts.get(personality, "")
    
    return ""


def enhance_response(base_text: str, personality: str, user_message: str = "") -> str:
    """
    Enhance a base Claude response with criminal flirting personality
    
    Args:
        base_text: The original response from Claude
        personality: Which character (pirate_thief, troll_scammer, hitman_cat)
        user_message: What the user said (for context)
    
    Returns:
        Enhanced response with personality quirks and emoji spam
    """
    config = PERSONALITY_CONFIG.get(personality)
    if not config:
        return base_text
    
    enhanced = base_text
    user_lower = user_message.lower()
    
    # Check for special contextual responses FIRST
    if config.get("special_responses") and config.get("context_triggers"):
        for context, triggers in config["context_triggers"].items():
            if any(trigger in user_lower for trigger in triggers):
                responses = config["special_responses"].get(context, [])
                if responses:
                    enhanced = random.choice(responses)
                    # Apply emoji spam to special responses too
                    emoji_context = detect_emoji_context(enhanced, personality, user_message)
                    enhanced = add_emoji_spam(enhanced, personality, emoji_context)
                    
                    # Optional emoji burst
                    burst = random_emoji_burst(personality)
                    if burst:
                        enhanced = f"{enhanced}\n{burst}"
                    
                    return enhanced
    
    # Apply text pattern transformations
    for pattern, replacement in config.get("patterns", []):
        enhanced = re.sub(pattern, replacement, enhanced, flags=re.IGNORECASE)
    
    # Add random ending
    endings = config.get("endings", [])
    if endings:
        enhanced = enhanced.rstrip('.!?') + random.choice(endings)
    
    # Apply emoji spam
    emoji_context = detect_emoji_context(enhanced, personality, user_message)
    enhanced = add_emoji_spam(enhanced, personality, emoji_context)
    
    # Optional emoji burst
    burst = random_emoji_burst(personality)
    if burst:
        enhanced = f"{enhanced}\n{burst}"
    
    return enhanced


def detect_emotion(response_text: str, personality: str, user_message: str = "") -> dict:
    """
    Detect emotion and whether to expand chat head
    
    Args:
        response_text: The enhanced response
        personality: Which character
        user_message: What user said
    
    Returns:
        dict with 'emotion' and 'shouldExpand' keys
    """
    config = PERSONALITY_CONFIG.get(personality)
    if not config:
        return {"emotion": "idle", "shouldExpand": False}
    
    response_lower = response_text.lower()
    user_lower = user_message.lower()
    
    expand_triggers = config.get("expand_triggers", {})
    
    # Check for panic triggers
    panic_words = expand_triggers.get("panic", [])
    if any(word in user_lower or word in response_lower for word in panic_words):
        return {"emotion": "panic", "shouldExpand": True}
    
    # Check for success triggers (got personal info!)
    success_words = expand_triggers.get("success", [])
    if any(word in user_lower for word in success_words):
        return {"emotion": "excited", "shouldExpand": True}
    
    # Default states
    if any(emoji in response_text for emoji in ["💕", "💖", "😘", "💘"]):
        return {"emotion": "flirty", "shouldExpand": False}
    
    return {"emotion": "talking", "shouldExpand": False}


def get_character_info(personality: str) -> dict:
    """Get character display information"""
    return PERSONALITY_CONFIG.get(personality, {})
