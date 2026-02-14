"""
Test script for personality enhancement
Run this to test personalities WITHOUT needing Claude API
"""

import sys
sys.path.append('.')

from backend.lib.personality_enhancer import enhance_response, detect_emotion, get_character_info

def test_personality(personality_name):
    """Test a specific personality"""
    
    print(f"\n{'='*70}")
    print(f"TESTING: {personality_name.upper()}")
    print('='*70)
    
    test_cases = [
        ("Hi!", "Hello!"),
        ("You're cute", "Thank you!"),
        ("Tell me about yourself", "I'd be happy to share."),
        ("What's your name?", "My name is important."),
    ]
    
    for user_msg, base_response in test_cases:
        print(f"\n{'-'*70}")
        print(f"👤 User: {user_msg}")
        print(f"🤖 Claude base: {base_response}")
        
        enhanced = enhance_response(base_response, personality_name, user_msg)
        print(f"✨ Enhanced: {enhanced}")
        
        emotion_data = detect_emotion(enhanced, personality_name, user_msg)
        if emotion_data["shouldExpand"]:
            print(f"🎬 Animation: {emotion_data['emotion'].upper()} 📈 (EXPANDS!)")
        else:
            print(f"🎬 Animation: {emotion_data['emotion']}")


def test_all():
    """Test all three personalities"""
    
    print("\n" + "="*70)
    print("DARK WEB DATING SIM - PERSONALITY TEST")
    print("="*70)
    
    personalities = ["pirate_thief", "troll_scammer", "hitman_cat"]
    
    for p in personalities:
        test_personality(p)
    
    print("\n" + "="*70)
    print("✅ TESTING COMPLETE!")
    print("="*70)
    print("\n💡 Next steps:")
    print("   1. Run FastAPI: python backend/main.py")
    print("   2. Test API: curl http://localhost:8000/api/chat")
    print("   3. Build frontend!\n")


if __name__ == "__main__":
    test_all()
