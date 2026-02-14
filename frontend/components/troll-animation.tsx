"use client"

import { useEffect, useState, useRef } from "react"

type AnimationType = "IDLE" | "WALK" | "RUN" | "ATTACK" | "HURT" | "JUMP" | "DIE"

interface TrollAnimationProps {
  agentId: string
  messageText: string
  className?: string
}

// Troll personality: begging, scamming, excited when user agrees
const ANIMATION_TRIGGERS: Record<AnimationType, string[]> = {
  IDLE: [],
  WALK: ["wut", "tell me", "what", "how", "why"],
  RUN: ["quick", "fast", "hurry", "need", "asap", "pls", "please"],
  ATTACK: [
    "venmo",
    "cashapp",
    "gift card",
    "send",
    "money",
    "paypal",
    "steam",
    "itunes",
    "amazon",
    "$",
    "dollars",
  ],
  HURT: ["no", "stop", "scam", "fake", "reported", "blocked", "wrong"],
  JUMP: [
    "yes",
    "okay",
    "ok",
    "sure",
    "here",
    "sent",
    "done",
    "ily",
    "love",
    "tysm",
    "thanks",
    "thx",
  ],
  DIE: ["goodbye", "leave", "never", "blocked", "bye", "later"],
}

const ANIMATION_PRIORITY: AnimationType[] = [
  "JUMP",
  "ATTACK",
  "HURT",
  "DIE",
  "RUN",
  "WALK",
  "IDLE",
]

// Chance to actually play when keywords match (stops common words hogging one animation)
const TRIGGER_CHANCE: Record<AnimationType, number> = {
  IDLE: 1,
  JUMP: 0.8,
  ATTACK: 0.75,
  HURT: 0.85,
  DIE: 0.9,
  RUN: 0.45,
  WALK: 0.4,
}

const TROLL_VARIANTS = [1, 2, 3] as const
type TrollVariant = (typeof TROLL_VARIANTS)[number]

const TROLL_FRAME_COUNT = 10 // 000-009

function getRandomVariant(): TrollVariant {
  return TROLL_VARIANTS[Math.floor(Math.random() * TROLL_VARIANTS.length)]
}

export function TrollAnimation({
  agentId,
  messageText,
  className = "",
}: TrollAnimationProps) {
  const [trollVariant] = useState<TrollVariant>(getRandomVariant)
  const [currentAnimation, setCurrentAnimation] = useState<AnimationType>("IDLE")
  const [frameIndex, setFrameIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const messageLower = messageText.toLowerCase().trim()
    let detectedAnimation: AnimationType = "IDLE"

    for (const animation of ANIMATION_PRIORITY) {
      const keywords = ANIMATION_TRIGGERS[animation]
      if (keywords.length > 0 && keywords.some((kw) => messageLower.includes(kw))) {
        const chance = TRIGGER_CHANCE[animation]
        if (Math.random() < chance) {
          detectedAnimation = animation
        }
        break
      }
    }

    setCurrentAnimation(detectedAnimation)
    setFrameIndex(0)
    setIsAnimating(true)

    if (detectedAnimation !== "IDLE") {
      const timeout = setTimeout(() => {
        setCurrentAnimation("IDLE")
        setFrameIndex(0)
      }, 1000) // 10 frames * 100ms

      return () => clearTimeout(timeout)
    }
  }, [messageText])

  useEffect(() => {
    if (!isAnimating) return

    animationRef.current = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % TROLL_FRAME_COUNT)
    }, 100)

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current)
      }
    }
  }, [isAnimating, currentAnimation])

  if (agentId !== "jester") return null

  const framePadded = String(frameIndex).padStart(3, "0")
  const imagePath = `/troll_sprites/_PNG/${trollVariant}_TROLL/Troll_0${trollVariant}_1_${currentAnimation}_${framePadded}.png`

  return (
    <div
      className={`relative w-32 h-32 ${className}`}
      title={`Troll: ${currentAnimation}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imagePath}
        alt={`Troll ${currentAnimation}`}
        className="absolute inset-0 w-full h-full object-contain pixelated"
      />
    </div>
  )
}
