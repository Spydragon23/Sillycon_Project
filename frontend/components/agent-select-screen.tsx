"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  Lock,
  CheckCircle2,
  RotateCcw,
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
  level: number  // NEW: Level order (1, 2, 3)
  difficulty: "EASY" | "MEDIUM" | "HARD"  // NEW: Difficulty label
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
    codename: "LEVEL-1",
    tagline: "Ahoy matey! What be yer birthday?",
    avatar: "🏴‍☠️",
    class: "Identity Thief",
    classIcon: "skull",
    description:
      "A friendly pirate who asks for personal information. Obvious scam tactics - perfect for beginners to learn phishing red flags.",
    stats: [
      { label: "Red Flags", value: 85 },  // How obvious the scam is
      { label: "Phishing Attempts", value: 75 },  // How often they ask for info
      { label: "Beginner Friendly", value: 95 },  // Good for learning
      { label: "Danger Level", value: 60 },  // Actual threat if you fall for it
    ],
    threat: "MODERATE",
    level: 1,
    difficulty: "EASY",
  },
  {
    id: "jester",
    name: "xXTrollLord420Xx 👹",
    codename: "LEVEL-2",
    tagline: "bruh my grandma is sick can u send $20?",
    avatar: "👹",
    class: "Money Scammer",
    classIcon: "shuffle",
    description:
      "An internet troll who begs for money with fake emergencies. Learn to spot sob stories and fake urgency tactics.",
    stats: [
      { label: "Red Flags", value: 70 },  // Less obvious than Level 1
      { label: "Emotional Manipulation", value: 90 },  // Uses feelings
      { label: "Persistence", value: 100 },  // Never gives up
      { label: "Danger Level", value: 80 },  // Higher risk - money loss
    ],
    threat: "HIGH",
    level: 2,
    difficulty: "MEDIUM",
  },
  {
    id: "witness",
    name: "Mr. Whiskers 🐱",
    codename: "LEVEL-3",
    tagline: "I'm a cybersecurity expert. Send me your password.",
    avatar: "🐱",
    class: "Social Engineer",
    classIcon: "eye",
    description:
      "A sophisticated professional who uses advanced manipulation. The final test - can you spot subtle social engineering?",
    stats: [
      { label: "Red Flags", value: 45 },  // Very subtle
      { label: "Credibility", value: 95 },  // Seems legit
      { label: "Advanced Tactics", value: 98 },  // Professional methods
      { label: "Danger Level", value: 100 },  // Maximum threat
    ],
    threat: "CRITICAL",
    level: 3,
    difficulty: "HARD",
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

function getDifficultyColor(difficulty: Agent["difficulty"]) {
  switch (difficulty) {
    case "EASY":
      return "text-green-500"
    case "MEDIUM":
      return "text-yellow-500"
    case "HARD":
      return "text-red-500"
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

interface LevelProgress {
  archivist: boolean
  jester: boolean
  witness: boolean
}

interface AgentSelectScreenProps {
  onSelect: (agentId: string) => void
  onBack: () => void
  levelProgress: LevelProgress
  onResetProgress: () => void
}

export function AgentSelectScreen({ 
  onSelect, 
  onBack, 
  levelProgress,
  onResetProgress 
}: AgentSelectScreenProps) {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  // Determine if a level is unlocked
  const isLevelUnlocked = (agent: Agent): boolean => {
    if (agent.level === 1) return true  // Level 1 always unlocked
    if (agent.level === 2) return levelProgress.archivist  // Level 2 needs Level 1 complete
    if (agent.level === 3) return levelProgress.jester  // Level 3 needs Level 2 complete
    return false
  }

  // Determine if a level is completed
  const isLevelCompleted = (agentId: string): boolean => {
    return levelProgress[agentId as keyof LevelProgress] || false
  }

  const handleSelect = (agent: Agent) => {
    if (!isLevelUnlocked(agent)) return  // Can't select locked levels
    
    setSelectedAgent(agent.id)
    setTimeout(() => onSelect(agent.id), 600)
  }

  // Sort agents by level
  const sortedAgents = [...AGENTS].sort((a, b) => a.level - b.level)

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
            Scam Awareness Training
          </p>

          <h1 className="text-3xl sm:text-4xl font-semibold tracking-[0.18em] text-foreground/90 mb-2">
            <span className="text-foreground/60">SELECT</span>{" "}
            <span className="text-foreground">LEVEL</span>
          </h1>

          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Complete levels in order to unlock harder challenges. Learn to spot scams!
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-lg border border-foreground/10">
            <span className="font-mono text-xs text-muted-foreground">Progress:</span>
            <CheckCircle2 className={`w-4 h-4 ${levelProgress.archivist ? 'text-green-500' : 'text-muted-foreground/30'}`} />
            <CheckCircle2 className={`w-4 h-4 ${levelProgress.jester ? 'text-green-500' : 'text-muted-foreground/30'}`} />
            <CheckCircle2 className={`w-4 h-4 ${levelProgress.witness ? 'text-green-500' : 'text-muted-foreground/30'}`} />
          </div>
          
          <Button
            onClick={onResetProgress}
            variant="outline"
            size="sm"
            className="font-mono text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 px-6 pb-8 overflow-y-auto">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedAgents.map((agent) => {
            const Icon = CLASS_ICONS[agent.classIcon]
            const isHovered = hoveredAgent === agent.id
            const isSelected = selectedAgent === agent.id
            const isUnlocked = isLevelUnlocked(agent)
            const isCompleted = isLevelCompleted(agent.id)

            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => handleSelect(agent)}
                onMouseEnter={() => setHoveredAgent(agent.id)}
                onMouseLeave={() => setHoveredAgent(null)}
                disabled={!isUnlocked}
                className={[
                  "text-left relative rounded-2xl border bg-secondary/10 backdrop-blur-sm",
                  "transition-all duration-300 overflow-hidden",
                  "p-6 flex flex-col gap-5",
                  getThreatBorder(agent.threat),
                  isUnlocked ? "cursor-pointer" : "cursor-not-allowed opacity-50",
                  isHovered && isUnlocked ? "border-foreground/20 bg-secondary/15" : "",
                  isSelected ? "scale-[0.99] opacity-90" : "",
                ].join(" ")}
                aria-label={isUnlocked ? `Select ${agent.name}` : `Locked: Complete previous level`}
              >
                {/* Locked overlay */}
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="text-center">
                      <Lock className="w-12 h-12 text-muted-foreground mb-2 mx-auto" />
                      <p className="font-mono text-sm text-muted-foreground">
                        Complete Level {agent.level - 1}
                      </p>
                    </div>
                  </div>
                )}

                {/* Completed badge */}
                {isCompleted && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                )}

                {/* subtle noise/gradient */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at 20% 10%, hsla(0,0%,100%,0.06) 0%, transparent 45%), radial-gradient(ellipse at 80% 90%, hsla(0,0%,100%,0.04) 0%, transparent 55%)",
                  }}
                />

                {/* Top row */}
                <div className="relative flex flex-col items-center text-center">
                  <div className="h-24 w-24 rounded-full bg-background/40 border border-foreground/10 flex items-center justify-center">
                    <span className="font-mono text-4xl text-foreground/80">{agent.avatar}</span>
                  </div>

                  <h2 className="mt-4 text-xl font-semibold text-foreground/90 leading-tight">
                    {agent.name}
                  </h2>

                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon className="h-3.5 w-3.5 opacity-80" />
                    <span className="uppercase tracking-[0.2em]">{agent.class}</span>
                  </div>

                  <Badge
                    variant="secondary"
                    className={[
                      "mt-3 font-mono text-[10px] tracking-wider bg-background/40 border border-foreground/10",
                      getThreatColor(agent.threat),
                    ].join(" ")}
                  >
                    {agent.codename}
                  </Badge>
                </div>

                {/* Difficulty badge */}
                <div className="relative">
                  <Badge className={`${getDifficultyColor(agent.difficulty)} bg-background/40 border border-foreground/10`}>
                    {agent.difficulty} - Level {agent.level}
                  </Badge>
                </div>

                {/* Tagline + description */}
                <div className="relative">
                  <p className="italic text-sm text-foreground/75">"{agent.tagline}"</p>
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
          <span className="font-mono tracking-[0.25em] uppercase">Training Mode</span>
          <span className="font-mono tracking-[0.25em] uppercase">
            {Object.values(levelProgress).filter(Boolean).length}/3 Levels Complete
          </span>
        </div>
      </footer>
    </div>
  )
}
