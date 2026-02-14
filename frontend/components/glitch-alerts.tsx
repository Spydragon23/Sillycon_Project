"use client"

import { useEffect, useState, useCallback } from "react"
import { AlertTriangle, Eye, Radio, Skull, Bug, Wifi } from "lucide-react"

const GLITCH_MESSAGES = [
  { text: "SOMEONE IS WATCHING", icon: Eye, severity: "high" as const },
  { text: "SIGNAL INTERCEPTED", icon: Radio, severity: "medium" as const },
  { text: "NODE BREACH DETECTED", icon: Skull, severity: "high" as const },
  { text: "MEMORY CORRUPTION", icon: Bug, severity: "medium" as const },
  { text: "UNAUTHORIZED LISTENER", icon: Wifi, severity: "high" as const },
  { text: "DATA LEAK IN PROGRESS", icon: AlertTriangle, severity: "high" as const },
  { text: "SESSION BEING RECORDED", icon: Eye, severity: "medium" as const },
  { text: "TRUST SCORE RECALCULATED", icon: AlertTriangle, severity: "medium" as const },
  { text: "THEY KNOW YOUR ALIAS", icon: Skull, severity: "high" as const },
  { text: "PACKET INJECTION ATTEMPT", icon: Bug, severity: "medium" as const },
]

interface GlitchAlert {
  id: number
  message: typeof GLITCH_MESSAGES[number]
  phase: "glitch-in" | "visible" | "glitch-out" | "gone"
}

export function GlitchAlerts() {
  const [alert, setAlert] = useState<GlitchAlert | null>(null)
  const [screenGlitch, setScreenGlitch] = useState(false)

  const triggerAlert = useCallback(() => {
    const msg = GLITCH_MESSAGES[Math.floor(Math.random() * GLITCH_MESSAGES.length)]
    const id = Date.now()

    // Screen glitch first
    setScreenGlitch(true)
    setTimeout(() => setScreenGlitch(false), 200)

    // Show alert after brief glitch
    setTimeout(() => {
      setAlert({ id, message: msg, phase: "glitch-in" })

      // Transition to visible
      setTimeout(() => {
        setAlert((prev) => prev && prev.id === id ? { ...prev, phase: "visible" } : prev)
      }, 300)

      // Transition to glitch-out
      setTimeout(() => {
        setAlert((prev) => prev && prev.id === id ? { ...prev, phase: "glitch-out" } : prev)
      }, 2200)

      // Remove
      setTimeout(() => {
        setAlert((prev) => prev && prev.id === id ? null : prev)
        // Small aftershock glitch
        setScreenGlitch(true)
        setTimeout(() => setScreenGlitch(false), 100)
      }, 2600)
    }, 250)
  }, [])

  useEffect(() => {
    // Very infrequent: every 25-55 seconds on average
    const scheduleNext = () => {
      const delay = 25000 + Math.random() * 30000
      return setTimeout(() => {
        triggerAlert()
        timerId = scheduleNext()
      }, delay)
    }

    // First one after 15-30 seconds
    let timerId = setTimeout(() => {
      triggerAlert()
      timerId = scheduleNext()
    }, 15000 + Math.random() * 15000)

    return () => clearTimeout(timerId)
  }, [triggerAlert])

  return (
    <>
      {/* Full-screen glitch flash */}
      {screenGlitch && (
        <div className="fixed inset-0 z-[60] pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, transparent 48%, rgba(0,255,255,0.03) 49%, transparent 51%)",
              transform: `translateY(${Math.random() * 100}%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `repeating-linear-gradient(0deg, transparent, transparent ${2 + Math.random() * 3}px, rgba(0,255,255,0.05) ${2 + Math.random() * 3}px, rgba(0,255,255,0.05) ${4 + Math.random() * 4}px)`,
              transform: `skewX(${Math.random() * 2 - 1}deg)`,
            }}
          />
        </div>
      )}

      {/* Center glitch alert */}
      {alert && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center pointer-events-none">
          <div
            className={`
              relative px-8 py-5 rounded-xl max-w-sm mx-4 text-center
              ${alert.phase === "glitch-in" ? "animate-glitch-in" : ""}
              ${alert.phase === "visible" ? "opacity-100" : ""}
              ${alert.phase === "glitch-out" ? "animate-glitch-out" : ""}
            `}
            style={{
              background: alert.message.severity === "high"
                ? "rgba(30, 5, 5, 0.85)"
                : "rgba(5, 15, 30, 0.85)",
              backdropFilter: "blur(12px)",
              border: `1px solid ${
                alert.message.severity === "high"
                  ? "rgba(200, 50, 50, 0.3)"
                  : "rgba(0, 255, 255, 0.2)"
              }`,
              boxShadow: alert.message.severity === "high"
                ? "0 0 40px rgba(200, 50, 50, 0.15), inset 0 0 40px rgba(200, 50, 50, 0.05)"
                : "0 0 40px rgba(0, 255, 255, 0.1), inset 0 0 40px rgba(0, 255, 255, 0.03)",
              transform: alert.phase === "glitch-in"
                ? `translateX(${Math.random() * 6 - 3}px) skewX(${Math.random() * 3 - 1.5}deg)`
                : alert.phase === "glitch-out"
                ? `translateX(${Math.random() * 8 - 4}px) skewX(${Math.random() * 4 - 2}deg)`
                : "none",
              transition: "transform 0.15s, opacity 0.3s",
              opacity: alert.phase === "glitch-out" ? 0 : alert.phase === "glitch-in" ? 0.7 : 1,
            }}
          >
            <div className="scanline-overlay absolute inset-0 pointer-events-none rounded-xl" />

            <alert.message.icon
              className={`w-5 h-5 mx-auto mb-2 ${
                alert.message.severity === "high" ? "text-destructive" : "text-primary"
              }`}
              style={{
                filter: alert.message.severity === "high"
                  ? "drop-shadow(0 0 6px rgba(200, 50, 50, 0.5))"
                  : "drop-shadow(0 0 6px rgba(0, 255, 255, 0.5))",
              }}
            />

            <p
              className={`font-mono text-sm font-bold tracking-[0.25em] uppercase ${
                alert.message.severity === "high" ? "neon-text-red" : "neon-text-cyan"
              }`}
            >
              {alert.message.text}
            </p>

            <div className="mt-2 flex items-center justify-center gap-2">
              <div
                className={`w-1 h-1 rounded-full animate-pulse ${
                  alert.message.severity === "high" ? "bg-destructive" : "bg-primary"
                }`}
              />
              <span className="font-mono text-[9px] text-muted-foreground/50 tracking-widest">
                {alert.message.severity === "high" ? "CRITICAL ALERT" : "SYSTEM NOTICE"}
              </span>
              <div
                className={`w-1 h-1 rounded-full animate-pulse ${
                  alert.message.severity === "high" ? "bg-destructive" : "bg-primary"
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
