# Pirate Animation System

## Overview

The pirate character now has sprite-based animations that trigger based on keywords from the backend responses!

## Animation Types

The pirate has 7 different animations (each with 7 frames):

| Animation | When It Triggers | Keywords |
|-----------|------------------|----------|
| **IDLE** | Default state | Always playing when no other animation |
| **WALK** | Casual conversation | "tell me", "what", "looking", "searching" |
| **RUN** | Urgent/excited | "quick", "fast", "hurry", "need" |
| **ATTACK** | Asking for info/money | "treasure", "gold", "ssn", "account", "credit card", "password" |
| **HURT** | User rejects/resists | "no", "stop", "police", "fraud", "scam", "reported" |
| **JUMP** | User gives personal info! | "birthday", "1995", "social", "mother", "maiden", "love", "beautiful" |
| **DIE** | User leaves | "goodbye", "leave", "blocked", "bye" |

## How It Works

### 1. **Keyword Detection** (`pirate-animation.tsx`)
- Scans the backend response for trigger keywords
- Matches keywords to animation types in priority order
- Plays the matching animation

### 2. **Frame Animation**
- Each animation has 7 frames (000-006)
- Plays at 10fps (100ms per frame)
- Total duration: 700ms per loop
- Returns to IDLE after 1.4 seconds

### 3. **Integration** (`chat-terminal.tsx`)
- Animation appears next to pirate messages
- Only shows for the pirate agent (archivist ID)
- Responsive sizing (20x20 on mobile, 24x24 on desktop)

## Example Scenarios

### Scenario 1: User Shares Birthday
**User:** "I was born in 1995"

**Backend Response:** "Aye! 1995, ye say? And what month, treasure? 🏴‍☠️🏴‍☠️🏴‍☠️"

**Animation:** **JUMP** (excited because user shared info!)

---

### Scenario 2: Pirate Asks for Money
**Backend Response:** "Tell me yer bank account number, love! 💰"

**Animation:** **ATTACK** (aggressive scamming mode)

---

### Scenario 3: User Rejects
**User:** "No, this is a scam!"

**Backend Response:** "Wait wait, I be legitimate! 💔"

**Animation:** **HURT** (pirate is sad/defensive)

---

### Scenario 4: User Says Goodbye
**User:** "I'm leaving"

**Backend Response:** "No wait, come back! 😭"

**Animation:** **DIE** (dramatic collapse)

---

## Technical Details

### File Structure
```
frontend/
├── components/
│   ├── pirate-animation.tsx    # Animation component
│   └── chat-terminal.tsx        # Integrated into chat
├── public/
│   └── pirate_sprites/
│       └── PNG/
│           ├── 1/               # Pirate variant 1
│           ├── 2/               # Pirate variant 2
│           └── 3/               # Pirate variant 3
└── styles/
    └── globals.css              # Added .pixelated class
```

### Animation Component Props
```typescript
<PirateAnimation
  agentId={selectedAgent}        // "archivist" for pirate
  messageText={msg.text}          // Backend response text
  className="w-20 h-20"           // Size styling
/>
```

### CSS
```css
.pixelated {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}
```

## Extending to Other Characters

To add animations for Troll or Hitman Cat:

1. **Add sprite assets** to `frontend/public/`
2. **Update `pirate-animation.tsx`**:
   - Add agent ID checks
   - Add troll/cat specific animation triggers
   - Update image paths

Example:
```typescript
if (agentId === "jester") {
  // Use troll sprites
  const imagePath = `/troll_sprites/PNG/${variant}/${variant}_entity_000_${currentAnimation}_${framePadded}.png`
}
```

## Testing the Animations

### Test JUMP animation:
**Say:** "I was born in 1990"
**Pirate should:** Jump excitedly when responding

### Test ATTACK animation:
**Backend says:** "Give me yer credit card!"
**Pirate should:** Show aggressive attacking pose

### Test HURT animation:
**Say:** "This is a scam!"
**Pirate should:** Recoil in pain

### Test DIE animation:
**Say:** "Goodbye"
**Pirate should:** Collapse dramatically

---

## Performance Notes

- Uses Next.js `<Image>` component with `unoptimized` flag for sprites
- `priority` flag on non-IDLE animations for instant loading
- Animations clean up properly with useEffect cleanup functions
- Frame cycling is efficient with setInterval

---

**Created:** February 14, 2026
**Animations:** 7 types × 7 frames × 3 variants = 147 sprite frames
**Trigger system:** Keyword-based from backend responses
