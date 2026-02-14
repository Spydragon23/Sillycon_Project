"use client"

import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Coffee, Mail, Ghost, Globe, Clock } from "lucide-react"

const WARNINGS = [
  { text: "Narrative forming", icon: AlertTriangle },
  { text: "Object meaning unstable", icon: AlertTriangle },
  { text: "Temporal drift detected", icon: Clock },
]

const ARTIFACTS = [
  { label: "Empty coffee cup", confidence: 92, icon: Coffee },
  { label: "Unsent email", confidence: 76, icon: Mail },
  { label: "Ghost of a deadline", confidence: 43, icon: Ghost },
  { label: "Open browser tab cluster", confidence: 88, icon: Globe },
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
          {/* Reality Integrity */}
          <section>
            <h3 className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase mb-3">
              Reality Integrity
            </h3>
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

          {/* Detected Artifacts */}
          <section>
            <h3 className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase mb-3">
              Detected Artifacts
            </h3>
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

          {/* Collapse Trigger */}
          <section>
            <button
              onClick={onTriggerCollapse}
              className="w-full font-mono text-[10px] tracking-[0.2em] uppercase text-destructive/80 border border-destructive/20 bg-destructive/5 rounded-xl px-3 py-2.5 hover:bg-destructive/10 hover:border-destructive/30 transition-all duration-300"
            >
              Force Reality Collapse
            </button>
          </section>
        </div>
      </ScrollArea>
    </div>
  )
}
