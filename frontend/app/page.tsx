"use client"

import { useState } from "react"
import { BootScreen } from "@/components/boot-screen"
import { LoginScreen } from "@/components/login-screen"
import { HandshakeScreen } from "@/components/handshake-screen"
import { AgentSelectScreen } from "@/components/agent-select-screen"
import { TerminalScreen } from "@/components/terminal-screen"

type Screen = "boot" | "login" | "handshake" | "agent-select" | "terminal"

export default function Page() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("boot")
  const [alias, setAlias] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("")

  if (currentScreen === "boot") {
    return <BootScreen onComplete={() => setCurrentScreen("login")} />
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
      />
    )
  }

  return (
    <TerminalScreen
      alias={alias}
      selectedAgent={selectedAgent}
      onBack={() => setCurrentScreen("agent-select")}
      onLogout={() => setCurrentScreen("login")}
    />
  )
}
