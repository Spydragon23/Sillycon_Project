"use client"

import { ScrollArea } from "@/components/ui/scroll-area"

export interface Agent {
  id: string
  name: string
  tagline: string
  avatar: string
}

export const AGENTS: Agent[] = [
  {
    id: "archivist",
    name: "The Archivist",
    tagline: "Everything leaves a trace.",
    avatar: "A",
  },
  {
    id: "jester",
    name: "The Jester",
    tagline: "I broke something. Not sure what.",
    avatar: "J",
  },
  {
    id: "witness",
    name: "The Witness",
    tagline: "We are not alone in this node.",
    avatar: "W",
  },
]

interface AgentDirectoryProps {
  selectedAgent: string
  onSelectAgent: (id: string) => void
}

export function AgentDirectory({ selectedAgent, onSelectAgent }: AgentDirectoryProps) {
  return (
    <div className="glass-panel rounded-2xl h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border/30">
        <h2 className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
          Agent Directory
        </h2>
      </div>

      {/* Agent List */}
      <ScrollArea className="flex-1 px-3 py-3">
        <div className="flex flex-col gap-2">
          {AGENTS.map((agent) => {
            const isSelected = selectedAgent === agent.id
            return (
              <button
                key={agent.id}
                onClick={() => onSelectAgent(agent.id)}
                className={`w-full text-left rounded-xl p-3 transition-all duration-300 group ${
                  isSelected
                    ? "glass-panel-active neon-border-cyan"
                    : "hover:bg-secondary/30 border border-transparent"
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-sm shrink-0 transition-all duration-300 ${
                      isSelected
                        ? "bg-primary/15 neon-text-cyan border border-primary/30"
                        : "bg-secondary/50 text-muted-foreground border border-border/30 group-hover:border-border/50"
                    }`}
                  >
                    {agent.avatar}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-mono text-xs font-bold truncate transition-colors ${
                        isSelected ? "neon-text-cyan" : "text-foreground"
                      }`}
                    >
                      {agent.name}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground/70 truncate mt-0.5 leading-relaxed">
                      {`"${agent.tagline}"`}
                    </p>
                  </div>
                </div>

                {/* Selected indicator */}
                {isSelected && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow" />
                    <span className="font-mono text-[9px] text-primary/70 uppercase tracking-widest">
                      Connected
                    </span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
