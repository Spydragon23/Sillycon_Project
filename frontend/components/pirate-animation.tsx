"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

type AnimationType = "IDLE" | "WALK" | "RUN" | "ATTACK" | "HURT" | "JUMP" | "DIE"

interface PirateAnimationProps {
  agentId: string
  messageText: string
  className?: string
}

// Map keywords from backend responses to animation types
const ANIMATION_TRIGGERS: Record<AnimationType, string[]> = {
  IDLE: ["default", "waiting", "listening"],
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
  ],
  HURT: ["no", "stop", "police", "fbi", "fraud", "scam", "reported", "blocked"],
  JUMP: [
    "yes!",
    "birthday",
    "1995",
    "social",
    "mother",
    "maiden",
    "date of birth",
    "love",
    "beautiful",
  ],
  DIE: ["goodbye", "leave", "never", "blocked", "reported", "bye"],
}

export function PirateAnimation({
  agentId,
  messageText,
  className = "",
}: PirateAnimationProps) {
  const [currentAnimation, setCurrentAnimation] = useState<AnimationType>("IDLE")
  const [frameIndex, setFrameIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)
  const animationRef = useRef<NodeJS.Timeout>()

  // Detect which animation to play based on message content
  useEffect(() => {
    const messageLower = messageText.toLowerCase()
    let detectedAnimation: AnimationType = "IDLE"

    // Check for keywords in priority order
    for (const [animation, keywords] of Object.entries(ANIMATION_TRIGGERS)) {
      if (keywords.some((keyword) => messageLower.includes(keyword))) {
        detectedAnimation = animation as AnimationType
        break
      }
    }

    setCurrentAnimation(detectedAnimation)
    setFrameIndex(0)
    setIsAnimating(true)

    // Reset to IDLE after animation completes
    if (detectedAnimation !== "IDLE") {
      const timeout = setTimeout(() => {
        setCurrentAnimation("IDLE")
        setFrameIndex(0)
      }, 1400) // 7 frames * 200ms = 1400ms

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
      <Image
        src={imagePath}
        alt={`Pirate ${currentAnimation}`}
        fill
        className="object-contain pixelated"
        unoptimized // For sprite sheets, we don't want Next.js optimization
        priority={currentAnimation !== "IDLE"} // Prioritize non-idle animations
      />
    </div>
  )
}
