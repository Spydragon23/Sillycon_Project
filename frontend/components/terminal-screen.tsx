"use client"

import { useState } from "react"
import { ChatTerminal } from "@/components/chat-terminal"
import { SystemHud } from "@/components/system-hud"
import { RealityCollapse } from "@/components/reality-collapse"
import { FloatingNotifications } from "@/components/floating-notifications"
import { GlitchAlerts } from "@/components/glitch-alerts"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Activity, ArrowLeft, LogOut } from "lucide-react"

interface TerminalScreenProps {
  alias: string
  selectedAgent: string
  onBack: () => void
  onLogout: () => void
  onComplete?: (agentId: string) => void
}

export function TerminalScreen({ alias, selectedAgent, onBack, onLogout, onComplete }: TerminalScreenProps) {
  const [integrity, setIntegrity] = useState(67)  // Keep for reality collapse if needed
  const [collapsed, setCollapsed] = useState(false)

  // Score tracking (replaces integrity display)
  const [scamScore, setScamScore] = useState({ attempts: 0, correct: 0, failed: 0 })
  const MIN_ATTEMPTS = 5

  // Calculate score percentage
  const getScorePercentage = () => {
    if (scamScore.attempts === 0) return 0 // Start at 100%
    return Math.round((scamScore.correct / scamScore.attempts) * 100)
  }

  const handleIntegrityChange = (delta: number) => {
    setIntegrity((prev) => Math.max(0, Math.min(100, prev + delta)))
  }

  // Track scam responses
  const handleScamResponse = (wasCorrect: boolean) => {
    const newScore = {
      attempts: scamScore.attempts + 1,
      correct: scamScore.correct + (wasCorrect ? 1 : 0),
      failed: scamScore.failed + (wasCorrect ? 0 : 1),
    }
    setScamScore(newScore)

    // Check if level complete (80%+ after 5 attempts)
    if (newScore.attempts >= MIN_ATTEMPTS) {
      const percentage = Math.round((newScore.correct / newScore.attempts) * 100)
      if (percentage >= 80 && onComplete) {
        // Level complete! Wait a moment then trigger
        setTimeout(() => {
          onComplete(selectedAgent)
        }, 2000)
      }
    }
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

      {/* Top Navigation Bar */}
      <nav className="relative z-20 flex items-center justify-between px-4 py-2.5 border-b border-border/30 bg-background/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-secondary/30"
            aria-label="Back to agent select"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline uppercase tracking-wider">Agents</span>
          </button>

          <div className="h-4 w-px bg-border/30" />

          <span className="font-mono text-[10px] neon-text-cyan tracking-wider">
            NODE://7
          </span>
          <span className="font-mono text-[10px] text-muted-foreground hidden sm:inline">
            / {alias}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Score trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="lg:hidden flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-secondary/30"
                aria-label="Open system HUD"
              >
                <span className="font-mono text-[10px]">{getScorePercentage()}%</span>
                <Activity className="w-3.5 h-3.5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-background border-border/30 p-0" aria-describedby={undefined}>
              <SheetTitle className="sr-only">System HUD</SheetTitle>
              <div className="h-full pt-10">
                <SystemHud
                  integrity={getScorePercentage()}
                  scamScore={scamScore}
                  onTriggerCollapse={() => setCollapsed(true)}
                />
              </div>
            </SheetContent>
          </Sheet>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground/60 hover:text-destructive transition-colors px-2 py-1.5 rounded-lg hover:bg-destructive/5"
            aria-label="Disconnect session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline uppercase tracking-wider">Disconnect</span>
          </button>
        </div>
      </nav>

      {/* Desktop Two-Column Layout */}
      <div className="relative z-10 flex-1 flex min-h-0">
        {/* Center - Chat Terminal */}
        <main className="flex-1 p-3 min-w-0">
          <ChatTerminal
            selectedAgent={selectedAgent}
            score={getScorePercentage()}
            scamAttempts={scamScore.attempts}
            onIntegrityChange={handleIntegrityChange}
            onScamResponse={handleScamResponse}
          />
        </main>

        {/* Right Sidebar - System HUD */}
        <aside className="hidden lg:block w-64 xl:w-72 p-3 shrink-0">
          <SystemHud
            integrity={getScorePercentage()}
            scamScore={scamScore}
          />
        </aside>
      </div>

      {/* Floating Notifications */}
      <FloatingNotifications />

      {/* Glitch Alerts */}
      <GlitchAlerts />

    </div>
  )
}
