"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Camera, Image, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { playClick, playHover } from "@/lib/sounds"

const SKETCHY_WARNINGS = {
  camera: [
    "Safety check: This app is asking to use your camera.",
    "WARNING: A camera can show your face, your room, and where you are.",
    "Anything on camera can be recorded or shared without you noticing.",
    "Scammers may use your photo/video to pretend to be you (fake accounts).",
    "Only allow camera access if a trusted adult says its OK.",
  ],
  gallery: [
    "Safety check: This app is asking to open your photos.",
    "WARNING: Photos can contain private info (faces, school, home, location).",
    "Some photos include hidden data like where/when it was taken.",
    "Sharing photos can reveal your routines and who you are with.",
    "Only pick a photo you feel safe sharing. Never share IDs or addresses.",
  ],
}

const FINE_PRINT = [
  "Tip: You can usually remove permissions later in your browser or device settings.",
  "Tip: If something asks for camera/photos and it doesnt make sense, press Deny.",
  "Tip: Dont share anything that could identify you: full name, school, address.",
  "Tip: If a site pressures you to allow access fast, thats a red flag.",
  "Tip: Ask a trusted adult if youre unsure.",
]

interface SketchyPermissionDialogProps {
  type: "camera" | "gallery"
  onGrant: () => void
  onDeny: () => void
}

export function SketchyPermissionDialog({
  type,
  onGrant,
  onDeny,
}: SketchyPermissionDialogProps) {
  const [currentWarning, setCurrentWarning] = useState(0)
  const [showFinePrint, setShowFinePrint] = useState(false)
  const [glitch, setGlitch] = useState(false)
  const warnings = SKETCHY_WARNINGS[type]

  useEffect(() => {
    if (currentWarning < warnings.length - 1) {
      const timer = setTimeout(() => setCurrentWarning((p) => p + 1), 1200)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => setShowFinePrint(true), 800)
      return () => clearTimeout(timer)
    }
  }, [currentWarning, warnings.length])

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitch(true)
        setTimeout(() => setGlitch(false), 150)
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onDeny} />

      <div
        className={`relative z-10 w-full max-w-md mx-4 glass-panel-active rounded-2xl border-destructive/20 overflow-hidden transition-transform duration-75 ${
          glitch ? "translate-x-[2px] skew-x-[0.5deg]" : ""
        }`}
      >
        {/* Scan line across the dialog */}
        <div className="absolute inset-0 scanline-overlay pointer-events-none" />

        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center">
              {type === "camera" ? (
                <Camera className="w-4 h-4 text-destructive" />
              ) : (
                <Image className="w-4 h-4 text-destructive" />
              )}
            </div>
            <div>
              <h3 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
                Permission Request
              </h3>
              <p className="font-mono text-[9px] text-muted-foreground/50">
                {type === "camera" ? "OPTICAL_INPUT_v3.2" : "LOCAL_VAULT_ACCESS"}
              </p>
            </div>
          </div>
          <button
            onClick={onDeny}
            className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground/40 hover:text-foreground/60 hover:bg-secondary/30 transition-colors"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Warning area */}
        <div className="px-5 pb-3">
          <div className="bg-secondary/20 rounded-xl p-3 border border-border/15 min-h-[120px]">
            <div className="flex flex-col gap-1.5">
              {warnings.slice(0, currentWarning + 1).map((w, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 animate-slide-up"
                >
                  <AlertTriangle
                    className={`w-3 h-3 shrink-0 mt-0.5 ${
                      i === 0 ? "text-accent" : "text-destructive/60"
                    }`}
                  />
                  <span
                    className={`font-mono text-[10px] leading-relaxed ${
                      i === 0
                        ? "text-foreground/80"
                        : "text-muted-foreground/60"
                    }`}
                  >
                    {w}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fine print */}
        {showFinePrint && (
          <div className="px-5 pb-3 animate-fade-in">
            <p className="font-mono text-[8px] text-muted-foreground/30 leading-relaxed italic">
              {FINE_PRINT[Math.floor(Math.random() * FINE_PRINT.length)]}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="px-5 pb-5 flex gap-3">
          <Button
            onClick={() => {
              playClick()
              onDeny()
            }}
            onMouseEnter={playHover}
            variant="outline"
            className="flex-1 font-mono text-[10px] tracking-[0.1em] uppercase bg-secondary/20 text-muted-foreground border-border/30 hover:bg-secondary/40 rounded-xl h-9 transition-all duration-300"
          >
            Deny Access
          </Button>
          <Button
            onClick={() => {
              playClick()
              onGrant()
            }}
            onMouseEnter={playHover}
            className="flex-1 font-mono text-[10px] tracking-[0.1em] uppercase bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20 hover:border-destructive/50 rounded-xl h-9 transition-all duration-300"
          >
            {showFinePrint ? "Grant Anyway" : "Processing..."}
          </Button>
        </div>
      </div>
    </div>
  )
}
