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
}

export function TerminalScreen({ alias, selectedAgent, onBack, onLogout }: TerminalScreenProps) {
  const [integrity, setIntegrity] = useState(67)
  const [collapsed, setCollapsed] = useState(false)

  const handleIntegrityChange = (delta: number) => {
    setIntegrity((prev) => Math.max(0, Math.min(100, prev + delta)))
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
          {/* Mobile HUD trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="lg:hidden flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-secondary/30"
                aria-label="Open system HUD"
              >
                <span className="font-mono text-[10px]">{integrity}%</span>
                <Activity className="w-3.5 h-3.5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-background border-border/30 p-0" aria-describedby={undefined}>
              <SheetTitle className="sr-only">System HUD</SheetTitle>
              <div className="h-full pt-10">
                <SystemHud
                  integrity={integrity}
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
            integrity={integrity}
            onIntegrityChange={handleIntegrityChange}
          />
        </main>

        {/* Right Sidebar - System HUD */}
        <aside className="hidden lg:block w-64 xl:w-72 p-3 shrink-0">
          <SystemHud
            integrity={integrity}
            onTriggerCollapse={() => setCollapsed(true)}
          />
        </aside>
      </div>

      {/* Floating Notifications */}
      <FloatingNotifications />

      {/* Glitch Alerts */}
      <GlitchAlerts />

      {/* Reality Collapse Overlay */}
      {collapsed && (
        <RealityCollapse
          integrity={integrity}
          onReset={() => {
            setIntegrity(67)
            setCollapsed(false)
          }}
          onClose={() => setCollapsed(false)}
        />
      )}
    </div>
  )
}
