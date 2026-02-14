"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"

const HANDSHAKE_STEPS = [
  "Verifying alias...",
  "Locating available nodes...",
  "Scanning agent registry...",
  "Integrity baseline: 92%",
  "Synchronizing temporal index...",
  "NODE ACCESS GRANTED",
]

interface HandshakeScreenProps {
  alias: string
  onComplete: () => void
}

export function HandshakeScreen({ alias, onComplete }: HandshakeScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (currentStep >= HANDSHAKE_STEPS.length) {
      const timeout = setTimeout(onComplete, 1200)
      return () => clearTimeout(timeout)
    }

    const stepDelay = currentStep === HANDSHAKE_STEPS.length - 1 ? 600 : 500 + Math.random() * 400
    const timeout = setTimeout(() => {
      setCurrentStep((prev) => prev + 1)
      setProgress(((currentStep + 1) / HANDSHAKE_STEPS.length) * 100)
    }, stepDelay)

    return () => clearTimeout(timeout)
  }, [currentStep, onComplete])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, hsla(270, 50%, 15%, 0.5) 0%, transparent 70%)",
        }}
      />

      <div className="scanline-overlay absolute inset-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg px-4">
        <div className="glass-panel-active rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
              Establishing Connection
            </h2>
            <p className="font-mono text-xs text-muted-foreground/60 mt-1">
              Alias: <span className="neon-text-cyan">{alias}</span>
            </p>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <Progress
              value={progress}
              className="h-1.5 bg-secondary/50 rounded-full [&>div]:bg-primary [&>div]:transition-all [&>div]:duration-500"
            />
          </div>

          {/* Steps */}
          <div className="font-mono text-sm leading-7 space-y-1">
            {HANDSHAKE_STEPS.slice(0, currentStep).map((step, i) => (
              <div
                key={i}
                className={`animate-slide-up ${
                  i === HANDSHAKE_STEPS.length - 1
                    ? "neon-text-green font-bold mt-4 text-base"
                    : "text-muted-foreground"
                }`}
              >
                <span className="text-primary/40 mr-2">{">"}</span>
                {step}
              </div>
            ))}

            {currentStep < HANDSHAKE_STEPS.length && (
              <div className="text-muted-foreground/60">
                <span className="text-primary/40 mr-2">{">"}</span>
                <span className="typing-cursor" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
