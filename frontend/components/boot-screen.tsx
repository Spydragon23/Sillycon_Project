"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

const BOOT_LINES = [
  { text: "Initializing node...", delay: 0 },
  { text: "Routing encrypted channels...", delay: 800 },
  { text: "Masking identity...", delay: 1600 },
  { text: "Session key generated...", delay: 2400 },
  { text: "", delay: 3200 },
  { text: "Connection established.", delay: 3600 },
  { text: 'Welcome to NODE://7', delay: 4200 },
]

interface BootScreenProps {
  onComplete: () => void
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const [phase, setPhase] = useState<"intro" | "boot">("intro")
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const [typingIndex, setTypingIndex] = useState<number>(0)
  const [currentTypedText, setCurrentTypedText] = useState("")

  useEffect(() => {
    if (visibleLines >= BOOT_LINES.length) {
      const timeout = setTimeout(onComplete, 1500)
      return () => clearTimeout(timeout)
    }

    const currentLine = BOOT_LINES[visibleLines]
    if (!currentLine) return

    if (visibleLines === 0 && typingIndex === 0) {
      const timeout = setTimeout(() => {
        setTypingIndex(1)
      }, currentLine.delay)
      return () => clearTimeout(timeout)
    }

    if (typingIndex > 0 && currentTypedText.length < currentLine.text.length) {
      const charTimeout = setTimeout(() => {
        setCurrentTypedText(currentLine.text.slice(0, currentTypedText.length + 1))
      }, 25 + Math.random() * 35)
      return () => clearTimeout(charTimeout)
    }

    if (typingIndex > 0 && currentTypedText.length === currentLine.text.length) {
      const nextTimeout = setTimeout(() => {
        setVisibleLines((prev) => prev + 1)
        setCurrentTypedText("")
        setTypingIndex(1)
      }, 400)
      return () => clearTimeout(nextTimeout)
    }
  }, [visibleLines, typingIndex, currentTypedText, onComplete])

  // Intro phase: educational summary + parent instructions
  if (phase === "intro") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />
        <div className="scanline-overlay absolute inset-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-lg px-6">
          <div className="glass-panel rounded-2xl border border-border/30 p-6 sm:p-8">
            <h1 className="font-mono text-xs tracking-[0.35em] text-muted-foreground uppercase mb-4">
              For parents & guardians
            </h1>

            <p className="font-mono text-sm text-foreground/90 leading-relaxed mb-4">
              This is an <strong className="text-primary">educational experience</strong> designed to help children learn about online privacy and safety. Kids interact with simulated “agents” and try a voice demo that shows how websites can keep listening after you allow the microphone once.
            </p>

            <p className="font-mono text-sm text-foreground/80 leading-relaxed mb-5">
              The content is fictional and age-appropriate. No real data is sold or shared. Use it as a conversation starter about when to share—or not share—personal information online.
            </p>

            <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3 mb-6">
              <p className="font-mono text-[10px] tracking-[0.2em] text-primary/80 uppercase mb-1">
                Instructions
              </p>
              <p className="font-mono text-xs text-foreground/90 leading-relaxed">
                Press <strong>Start</strong> below, then give the device to your child. They can explore the experience on their own. You can revisit this screen anytime by refreshing the page.
              </p>
            </div>

            <Button
              onClick={() => setPhase("boot")}
              className="w-full font-mono text-xs tracking-[0.2em] uppercase bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 hover:border-primary/50 rounded-xl h-11 transition-all duration-300"
            >
              Start
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      <div className="scanline-overlay absolute inset-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl px-6">
        <div className="font-mono text-sm leading-7 tracking-wide">
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              className={`animate-fade-in ${
                i === BOOT_LINES.length - 1
                  ? "neon-text-cyan text-base mt-2 font-bold"
                  : i === BOOT_LINES.length - 2
                  ? "neon-text-green mt-2"
                  : "text-muted-foreground"
              }`}
            >
              {line.text === "" ? <br /> : (
                <>
                  <span className="text-primary/40 mr-2">{">"}</span>
                  {line.text}
                </>
              )}
            </div>
          ))}

          {visibleLines < BOOT_LINES.length && typingIndex > 0 && (
            <div className={`${
              visibleLines >= BOOT_LINES.length - 2
                ? "neon-text-green"
                : "text-muted-foreground"
            }`}>
              <span className="text-primary/40 mr-2">{">"}</span>
              {currentTypedText}
              <span className="typing-cursor" />
            </div>
          )}

          {visibleLines === 0 && typingIndex === 0 && (
            <div className="text-muted-foreground">
              <span className="typing-cursor" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
