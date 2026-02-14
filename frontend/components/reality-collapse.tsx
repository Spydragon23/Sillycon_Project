"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle, FileText, Shield } from "lucide-react"

interface RealityCollapseProps {
  integrity: number
  onReset: () => void
  onClose: () => void
}

const SAFETY_TIPS = [
  "Revoke mic/camera in browser or device settings when you're done.",
  "Don't share full name, school, address, or passwords with people you don't know.",
  "If a site pressures you to allow access quickly, that's a red flag.",
]

export function RealityCollapse({ integrity, onReset, onClose }: RealityCollapseProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/90 backdrop-blur-xl"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg px-4">
        <div className="glass-panel-active rounded-2xl p-8 border-destructive/20">
          {/* Red glow behind */}
          <div
            className="absolute -inset-2 rounded-2xl opacity-20 blur-2xl -z-10"
            style={{
              background:
                "radial-gradient(ellipse, hsla(0, 85%, 55%, 0.3), transparent 70%)",
            }}
          />

          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-destructive animate-pulse-slow" />
            <h2 className="font-mono text-sm tracking-[0.3em] neon-text-red uppercase font-bold">
              Safety report: verdict
            </h2>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-secondary/20 rounded-xl px-4 py-3 border border-border/20">
              <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1">
                Session
              </p>
              <p className="font-mono text-xs text-foreground leading-relaxed">
                Privacy education demo
              </p>
            </div>
            <div className="bg-secondary/20 rounded-xl px-4 py-3 border border-border/20">
              <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1">
                Privacy integrity
              </p>
              <p className="font-mono text-2xl neon-text-red font-bold">{integrity}%</p>
            </div>
          </div>

          {/* What was detected */}
          <div className="mb-5">
            <h3 className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2">
              Risks in this session
            </h3>
            <div className="bg-secondary/15 rounded-xl px-4 py-3 border border-border/15 font-mono text-xs text-foreground/80 space-y-1.5 leading-relaxed">
              <p>{">"} Mic / voice access used or offered</p>
              <p>{">"} Chat with simulated “agents” (educational)</p>
              <p>{">"} Camera / gallery permissions (if you allowed)</p>
              <p>{">"} Data sent to backend for transcription only</p>
            </div>
          </div>

          {/* Safety tips */}
          <div className="mb-6">
            <h3 className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              Remember
            </h3>
            <div className="flex flex-col gap-2">
              {SAFETY_TIPS.map((tip) => (
                <span
                  key={tip}
                  className="font-mono text-[10px] text-accent bg-accent/10 border border-accent/20 rounded-lg px-2.5 py-1.5 leading-relaxed"
                >
                  {tip}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onReset}
              className="flex-1 font-mono text-xs tracking-[0.15em] uppercase bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20 hover:border-destructive/50 rounded-xl h-10 transition-all duration-300"
            >
              Back to chat
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 font-mono text-xs tracking-[0.15em] uppercase bg-secondary/20 text-muted-foreground border-border/30 hover:bg-secondary/40 rounded-xl h-10 transition-all duration-300"
            >
              <FileText className="w-3.5 h-3.5 mr-2" />
              Close report
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
