"use client"

import { Mic, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VoiceEducationDialogProps {
  onContinue: () => void
  onClose: () => void
}

const VOICE_EDUCATION_LINES = [
  "Websites can keep listening after you press Allow once—even if you don't see a recording button or red dot.",
  "Your laptop or browser may show a small mic icon or indicator when something is using your microphone. Look for it in the address bar or system tray.",
  "In this demo we'll show you what can be \"heard\" from your microphone. Nothing is sent until you choose to send a voice message.",
]

export function VoiceEducationDialog({ onContinue, onClose }: VoiceEducationDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <div className="relative z-10 w-full max-w-md mx-4 glass-panel-active rounded-2xl border border-primary/20 overflow-hidden">
        <div className="absolute inset-0 scanline-overlay pointer-events-none" />

        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Mic className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
                Voice message
              </h3>
              <p className="font-mono text-[9px] text-muted-foreground/50">
                AUDIO_INPUT / PRIVACY_NOTICE
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground/40 hover:text-foreground/60 hover:bg-secondary/30 transition-colors"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Educational message */}
        <div className="px-5 pb-4">
          <div className="bg-secondary/20 rounded-xl p-3 border border-border/15">
            <p className="font-mono text-[10px] text-accent/90 tracking-wider uppercase mb-2">
              Before you continue
            </p>
            <ul className="flex flex-col gap-2">
              {VOICE_EDUCATION_LINES.map((line, i) => (
                <li
                  key={i}
                  className="flex gap-2 font-mono text-[10px] text-muted-foreground/80 leading-relaxed"
                >
                  <span className="text-primary/60 shrink-0">[{i + 1}]</span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 font-mono text-[10px] tracking-[0.1em] uppercase bg-secondary/20 text-muted-foreground border-border/30 hover:bg-secondary/40 rounded-xl h-9 transition-all duration-300"
          >
            Cancel
          </Button>
          <Button
            onClick={onContinue}
            className="flex-1 font-mono text-[10px] tracking-[0.1em] uppercase bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 hover:border-primary/50 rounded-xl h-9 transition-all duration-300"
          >
            I understand, continue
          </Button>
        </div>
      </div>
    </div>
  )
}
