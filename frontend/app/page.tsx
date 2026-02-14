"use client"

import { useState, useEffect, useRef } from "react"
import { BootScreen } from "@/components/boot-screen"
import { LoginScreen } from "@/components/login-screen"
import { HandshakeScreen } from "@/components/handshake-screen"
import { AgentSelectScreen } from "@/components/agent-select-screen"
import { TerminalScreen } from "@/components/terminal-screen"

type Screen = "boot" | "login" | "handshake" | "agent-select" | "terminal"

// Level progression tracking
interface LevelProgress {
  archivist: boolean  // Level 1 - Captain RedHeart
  jester: boolean     // Level 2 - TrollLord
  witness: boolean    // Level 3 - Mr. Whiskers
}

const DEFAULT_PROGRESS: LevelProgress = {
  archivist: false,  // Level 1 always available
  jester: false,     // Locked until Level 1 complete
  witness: false,    // Locked until Level 2 complete
}

export default function Page() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("boot")
  const [alias, setAlias] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("")
  const [levelProgress, setLevelProgress] = useState<LevelProgress>(DEFAULT_PROGRESS)
  const musicRef = useRef<HTMLAudioElement | null>(null)

  // Start music (call on load and on first user gesture – browsers often block until interaction)
  const startOpeningMusic = () => {
    if (currentScreen !== "boot" && currentScreen !== "login" && currentScreen !== "handshake") return
    if (!musicRef.current) {
      const a = new Audio("/music.webm")
      a.loop = true
      a.volume = 0.5
      musicRef.current = a
    }
    musicRef.current.play().catch(() => {})
  }

  // Opening music: try to play when on boot/login/handshake; stop when agent-select is shown
  useEffect(() => {
    if (currentScreen === "agent-select") {
      if (musicRef.current) {
        musicRef.current.pause()
        musicRef.current.src = ""
        musicRef.current = null
      }
      return
    }
    if (currentScreen === "boot" || currentScreen === "login" || currentScreen === "handshake") {
      if (!musicRef.current) {
        const a = new Audio("/music.webm")
        a.loop = true
        a.volume = 0.5
        musicRef.current = a
      }
      musicRef.current.play().catch(() => {}) // may fail until user interacts
    }
  }, [currentScreen])

  // Load progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("scam-training-progress")
    if (saved) {
      try {
        setLevelProgress(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load progress:", e)
      }
    }
  }, [])

  // Save progress to localStorage whenever it changes
  const updateProgress = (agentId: string, completed: boolean) => {
    const newProgress = { ...levelProgress, [agentId]: completed }
    setLevelProgress(newProgress)
    localStorage.setItem("scam-training-progress", JSON.stringify(newProgress))
  }

  // Mark a level as completed
  const completeLevel = (agentId: string) => {
    updateProgress(agentId, true)
  }

  // Reset all progress (for testing or restart)
  const resetProgress = () => {
    setLevelProgress(DEFAULT_PROGRESS)
    localStorage.removeItem("scam-training-progress")
  }

  const handleLevelComplete = (agentId: string) => {
  completeLevel(agentId) // uses your existing updateProgress() + localStorage save
}
const handleBack = () => {
  setSelectedAgent(null)
}
const handleLogout = () => {
  setAlias("")          // or however you return to login
  setSelectedAgent(null)
}
  if (currentScreen === "boot") {
    return (
      <BootScreen
        onComplete={() => setCurrentScreen("login")}
        onStartClick={startOpeningMusic}
      />
    )
  }

  if (currentScreen === "login") {
    return (
      <LoginScreen
        onConnect={(userAlias) => {
          setAlias(userAlias)
          setCurrentScreen("handshake")
        }}
      />
    )
  }

  if (currentScreen === "handshake") {
    return (
      <HandshakeScreen
        alias={alias}
        onComplete={() => setCurrentScreen("agent-select")}
      />
    )
  }

  if (currentScreen === "agent-select") {
    return (
      <AgentSelectScreen
        onSelect={(agentId) => {
          setSelectedAgent(agentId)
          setCurrentScreen("terminal")
        }}
        onBack={() => setCurrentScreen("handshake")}
        levelProgress={levelProgress}
        onResetProgress={resetProgress}
      />
    )
  }

  return (
  <TerminalScreen
    alias={alias}
    selectedAgent={selectedAgent}
    onBack={() => {
      setSelectedAgent("")
      setCurrentScreen("agent-select")
    }}
    onLogout={() => {
      setSelectedAgent("")
      setAlias("")
      setCurrentScreen("login")
    }}
    onComplete={(agentId) => completeLevel(agentId)}
  />
)
}
