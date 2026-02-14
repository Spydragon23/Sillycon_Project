"use client"

import { useEffect, useState, useRef } from "react"

type AnimationType = "IDLE" | "WALK" | "RUN" | "ATTACK" | "HURT" | "JUMP" | "DIE"

interface PirateAnimationProps {
  agentId: string
  messageText: string
  className?: string
}

// Map keywords from backend responses to animation types
const ANIMATION_TRIGGERS: Record<AnimationType, string[]> = {
  IDLE: [], // Fallback when nothing else matches
  WALK: ["looking", "searching", "wondering", "tell me", "what"],
  RUN: ["quick", "fast", "hurry", "wait", "need"],
  ATTACK: [
    "arrr",
    "yarr",
    "treasure",
    "gold",
    "booty",
    "plunder",
    "steal",
    "account",
    "ssn",
    "credit card",
    "password",
    "bank",
    "driver",
    "legal name",
  ],
  HURT: ["no", "stop", "police", "fbi", "fraud", "scam", "reported", "blocked"],
  JUMP: [
    "yes!",
    "birthday",
    "1995",
    "1990",
    "1985",
    "social",
    "mother",
    "maiden",
    "date of birth",
    "love",
    "beautiful",
    "astrology",
    "genealog",
  ],
  DIE: ["goodbye", "leave", "never", "blocked", "reported", "bye"],
}

// Check in this order: most specific first, IDLE last
const ANIMATION_PRIORITY: AnimationType[] = [
  "JUMP",
  "ATTACK",
  "HURT",
  "DIE",
  "RUN",
  "WALK",
  "IDLE",
]

export function PirateAnimation({
  agentId,
  messageText,
  className = "",
}: PirateAnimationProps) {
  const [currentAnimation, setCurrentAnimation] = useState<AnimationType>("IDLE")
  const [frameIndex, setFrameIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Detect which animation to play based on message content
  useEffect(() => {
    const messageLower = messageText.toLowerCase().trim()
    let detectedAnimation: AnimationType = "IDLE"

    // Check in priority order so e.g. "birthday" triggers JUMP not WALK
    for (const animation of ANIMATION_PRIORITY) {
      const keywords = ANIMATION_TRIGGERS[animation]
      if (keywords.length > 0 && keywords.some((kw) => messageLower.includes(kw))) {
        detectedAnimation = animation
        break
      }
    }

    setCurrentAnimation(detectedAnimation)
    setFrameIndex(0)
    setIsAnimating(true)

    // Reset to IDLE after one shot animation completes
    if (detectedAnimation !== "IDLE") {
      const timeout = setTimeout(() => {
        setCurrentAnimation("IDLE")
        setFrameIndex(0)
      }, 800) // Play one full cycle (7 frames * ~100ms) then idle

      return () => clearTimeout(timeout)
    }
  }, [messageText])

  // Animate frames
  useEffect(() => {
    if (!isAnimating) return

    animationRef.current = setInterval(() => {
      setFrameIndex((prev) => {
        const nextFrame = (prev + 1) % 7 // 7 frames (000-006)
        return nextFrame
      })
    }, 100) // 100ms per frame = 10fps

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current)
      }
    }
  }, [isAnimating, currentAnimation])

  // Only show for pirate agent
  if (agentId !== "archivist") return null

  const pirateVariant = "1" // Can be 1, 2, or 3
  const framePadded = String(frameIndex).padStart(3, "0")
  const imagePath = `/pirate_sprites/PNG/${pirateVariant}/${pirateVariant}_entity_000_${currentAnimation}_${framePadded}.png`

  return (
    <div
      className={`relative w-32 h-32 ${className}`}
      title={`Animation: ${currentAnimation}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imagePath}
        alt={`Pirate ${currentAnimation}`}
        className="absolute inset-0 w-full h-full object-contain pixelated"
      />
    </div>
  )
}
