"use client"

import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Mic, ShieldAlert, MessageSquare, Camera, Link2 } from "lucide-react"

const WARNINGS = [
  { text: "Sites can listen after you allow mic once—even if you don't see a red dot.", icon: Mic },
  { text: "Personal info shared in chat can be used by bad actors.", icon: AlertTriangle },
  { text: "Camera and mic access can stay on until you revoke it.", icon: ShieldAlert },
]

const ARTIFACTS = [
  { label: "Unmonitored mic access risk", confidence: 92, icon: Mic },
  { label: "Personal data in conversation", confidence: 76, icon: MessageSquare },
  { label: "Camera permission granted", confidence: 43, icon: Camera },
  { label: "Untrusted link / script exposure", confidence: 88, icon: Link2 },
]

interface SystemHudProps {
  integrity: number
  onTriggerCollapse: () => void
}

export function SystemHud({ integrity, onTriggerCollapse }: SystemHudProps) {
  return (
    <div className="glass-panel rounded-2xl h-full flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="px-4 py-4 flex flex-col gap-5">
          {/* Privacy / safety integrity */}
          <section>
            <h3 className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase mb-3">
              Privacy integrity
            </h3>
            <p className="font-mono text-[9px] text-muted-foreground/70 mb-2 max-w-[200px]">
              How much you&apos;ve shared or allowed access. Lower = more exposed.
            </p>
            <div className="text-center mb-3">
              <span
                className={`font-mono text-4xl font-bold ${
                  integrity > 50
                    ? "neon-text-green"
                    : integrity > 25
                    ? "text-accent"
                    : "neon-text-red"
                }`}
              >
                {integrity}%
              </span>
            </div>
            <Progress
              value={integrity}
              className={`h-2 bg-secondary/50 rounded-full [&>div]:transition-all [&>div]:duration-700 ${
                integrity > 50
                  ? "[&>div]:bg-[hsl(140,70%,45%)]"
                  : integrity > 25
                  ? "[&>div]:bg-accent"
                  : "[&>div]:bg-destructive"
              }`}
            />

            {/* Warnings */}
            <div className="mt-3 flex flex-col gap-1.5">
              {WARNINGS.map((warning, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-accent/5 border border-accent/10"
                >
                  <warning.icon className="w-3 h-3 text-accent/70 shrink-0" />
                  <span className="font-mono text-[10px] text-accent/80">
                    {warning.text}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-border/30" />

          {/* Detected risks / awareness */}
          <section>
            <h3 className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase mb-3">
              Detected risks
            </h3>
            <p className="font-mono text-[9px] text-muted-foreground/70 mb-2 max-w-[200px]">
              Things that can put your privacy at risk in this session.
            </p>
            <div className="flex flex-col gap-2">
              {ARTIFACTS.map((artifact, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-secondary/20 border border-border/15"
                >
                  <artifact.icon className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                  <span className="font-mono text-[10px] text-foreground/80 flex-1 truncate">
                    {artifact.label}
                  </span>
                  <span
                    className={`font-mono text-[10px] shrink-0 ${
                      artifact.confidence > 80
                        ? "neon-text-green"
                        : artifact.confidence > 60
                        ? "text-foreground/60"
                        : "text-muted-foreground/50"
                    }`}
                  >
                    {artifact.confidence}%
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-border/30" />

          {/* Learn more / report */}
          <section>
            <button
              onClick={onTriggerCollapse}
              className="w-full font-mono text-[10px] tracking-[0.2em] uppercase text-destructive/80 border border-destructive/20 bg-destructive/5 rounded-xl px-3 py-2.5 hover:bg-destructive/10 hover:border-destructive/30 transition-all duration-300"
            >
              View safety report
            </button>
          </section>
        </div>
      </ScrollArea>
    </div>
  )
}
