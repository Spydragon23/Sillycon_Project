"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Brain,
  Eye,
  Zap,
  Skull,
  Database,
  Shuffle,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react"

export interface Agent {
  id: string
  name: string
  codename: string
  tagline: string
  avatar: string
  class: string
  classIcon: keyof typeof CLASS_ICONS
  description: string
  stats: {
    label: string
    value: number
  }[]
  threat: "LOW" | "MODERATE" | "HIGH" | "CRITICAL"
}

const CLASS_ICONS = {
  shield: Shield,
  brain: Brain,
  eye: Eye,
  zap: Zap,
  skull: Skull,
  database: Database,
  shuffle: Shuffle,
}

export const AGENTS: Agent[] = [
  {
    id: "archivist",
    name: "Captain RedHeart 🏴‍☠️",
    codename: "PIRATE-1",
    tagline: "Ahoy there, beautiful! What's yer SSN?",
    avatar: "🏴‍☠️",
    class: "Identity Thief",
    classIcon: "skull",
    description:
      "A romantic pirate who's smooth, charming, and trying to steal your identity while flirting. Asks for personal info in the most romantic way possible.",
    stats: [
      { label: "Charm", value: 95 },
      { label: "Deception", value: 88 },
      { label: "Romantic", value: 92 },
      { label: "Suspicious", value: 75 },
      { label: "Danger", value: 60 },
    ],
    threat: "MODERATE",
  },
  {
    id: "jester",
    name: "TrustMeBro 👹",
    codename: "TROLL-0",
    tagline: "pls bro i need $20 my cat is sick uwu",
    avatar: "👹",
    class: "Professional Beggar",
    classIcon: "shuffle",
    description:
      "An internet troll who's VERY enthusiastic about romance but always has sob stories and needs money. Switches between flirting and begging seamlessly.",
    stats: [
      { label: "Desperation", value: 97 },
      { label: "Internet Slang", value: 99 },
      { label: "Sob Stories", value: 93 },
      { label: "Authenticity", value: 5 },
      { label: "Persistence", value: 100 },
    ],
    threat: "HIGH",
  },
  {
    id: "witness",
    name: "Mr. Whiskers 🐱",
    codename: "HITMAN-9",
    tagline: "I handle problems discreetly. Also single.",
    avatar: "🐱",
    class: "Professional Assassin",
    classIcon: "eye",
    description:
      "A cool, professional cat assassin who treats murder like a service industry. Offers to eliminate your enemies as romantic gestures.",
    stats: [
      { label: "Professionalism", value: 95 },
      { label: "Deadliness", value: 99 },
      { label: "Smoothness", value: 88 },
      { label: "Cat Puns", value: 85 },
      { label: "Romance", value: 70 },
    ],
    threat: "CRITICAL",
  },
]

function getThreatColor(threat: Agent["threat"]) {
  switch (threat) {
    case "LOW":
      return "neon-text-green"
    case "MODERATE":
      return "text-accent"
    case "HIGH":
      return "neon-text-red"
    case "CRITICAL":
      return "neon-text-red"
  }
}

function getThreatBorder(threat: Agent["threat"]) {
  switch (threat) {
    case "LOW":
      return "border-[hsl(140,70%,45%)]/20"
    case "MODERATE":
      return "border-accent/20"
    case "HIGH":
      return "border-destructive/20"
    case "CRITICAL":
      return "border-destructive/30"
  }
}

function getStatBarColor(value: number) {
  if (value >= 80) return "bg-[hsl(180,100%,50%)]"
  if (value >= 60) return "bg-[hsl(140,70%,45%)]"
  if (value >= 40) return "bg-[hsl(15,80%,50%)]"
  return "bg-[hsl(0,85%,55%)]"
}

function getStatGlow(value: number) {
  if (value >= 80) return "shadow-[0_0_8px_hsla(180,100%,50%,0.4)]"
  if (value >= 60) return "shadow-[0_0_8px_hsla(140,70%,45%,0.3)]"
  if (value >= 40) return "shadow-[0_0_6px_hsla(15,80%,50%,0.3)]"
  return "shadow-[0_0_6px_hsla(0,85%,55%,0.3)]"
}

interface AgentSelectScreenProps {
  onSelect: (agentId: string) => void
  onBack: () => void
}

export function AgentSelectScreen({ onSelect, onBack }: AgentSelectScreenProps) {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  const handleSelect = (id: string) => {
    setSelectedAgent(id)
    setTimeout(() => onSelect(id), 600)
  }

  return (
    <div className="h-screen w-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, hsla(270, 50%, 15%, 0.5) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsla(180, 50%, 10%, 0.3) 0%, transparent 50%)",
        }}
      />
      <div className="scanline-overlay absolute inset-0 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 pt-6 pb-4 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-secondary/30 mb-4"
          aria-label="Go back"
          type="button"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="uppercase tracking-wider">Back</span>
        </button>

        <div className="text-center">
          <p className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground uppercase mb-2">
            Select Operative
          </p>

          <h1 className="text-3xl sm:text-4xl font-semibold tracking-[0.18em] text-foreground/90 mb-2">
            <span className="text-foreground/60">AGENT</span>{" "}
            <span className="text-foreground">DIRECTORY</span>
          </h1>

          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Choose your handler. Each operative carries different capabilities and risk profiles.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 px-6 pb-8 overflow-y-auto">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {AGENTS.map((agent) => {
            const Icon = CLASS_ICONS[agent.classIcon]
            const isHovered = hoveredAgent === agent.id
            const isSelected = selectedAgent === agent.id

            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => handleSelect(agent.id)}
                onMouseEnter={() => setHoveredAgent(agent.id)}
                onMouseLeave={() => setHoveredAgent(null)}
                className={[
                  "text-left relative rounded-2xl border bg-secondary/10 backdrop-blur-sm",
                  "transition-all duration-300 overflow-hidden",
                  "p-6 flex flex-col gap-5",
                  getThreatBorder(agent.threat),
                  isHovered ? "border-foreground/20 bg-secondary/15" : "",
                  isSelected ? "scale-[0.99] opacity-90" : "",
                ].join(" ")}
                aria-label={`Select ${agent.name}`}
              >
                {/* subtle noise/gradient */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at 20% 10%, hsla(0,0%,100%,0.06) 0%, transparent 45%), radial-gradient(ellipse at 80% 90%, hsla(0,0%,100%,0.04) 0%, transparent 55%)",
                  }}
                />

                {/* Top row */}
                <div className="relative flex items-start gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-background/40 border border-foreground/10 flex items-center justify-center">
                    <span className="font-mono text-xl text-foreground/70">{agent.avatar}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-lg font-semibold text-foreground/90 truncate">
                        {agent.name}
                      </h2>
                      <Badge
                        variant="secondary"
                        className={[
                          "font-mono text-[10px] tracking-wider bg-background/40 border border-foreground/10",
                          getThreatColor(agent.threat),
                        ].join(" ")}
                      >
                        {agent.codename}
                      </Badge>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon className="h-3.5 w-3.5 opacity-80" />
                      <span className="uppercase tracking-[0.2em]">{agent.class}</span>
                    </div>
                  </div>
                </div>

                {/* Tagline + description */}
                <div className="relative">
                  <p className="italic text-sm text-foreground/75">“{agent.tagline}”</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {agent.description}
                  </p>
                </div>

                {/* Threat row */}
                <div className="relative flex items-center gap-2 text-xs">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                    Threat Level:
                  </span>
                  <span className={["font-mono text-[10px] tracking-[0.3em] uppercase", getThreatColor(agent.threat)].join(" ")}>
                    {agent.threat}
                  </span>
                </div>

                {/* Stats */}
                <div className="relative mt-auto space-y-3">
                  {agent.stats.map((s) => (
                    <div key={s.label} className="grid grid-cols-[110px_1fr_40px] items-center gap-3">
                      <div className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
                        {s.label}
                      </div>

                      <div className="h-2 rounded-full bg-background/40 border border-foreground/10 overflow-hidden">
                        <div
                          className={[
                            "h-full rounded-full transition-all duration-500",
                            getStatBarColor(s.value),
                            getStatGlow(s.value),
                          ].join(" ")}
                          style={{
                            width: `${isSelected ? Math.min(100, s.value + 2) : s.value}%`,
                          }}
                        />
                      </div>

                      <div className="font-mono text-[10px] text-muted-foreground text-right">
                        {s.value}%
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected overlay hint */}
                {isSelected && (
                  <div className="absolute inset-0 bg-background/20 pointer-events-none" />
                )}
              </button>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 pb-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono tracking-[0.25em] uppercase">Node://7</span>
          <span className="font-mono tracking-[0.25em] uppercase">
            Registry status: stable
          </span>
        </div>
      </footer>
    </div>
  )
}
