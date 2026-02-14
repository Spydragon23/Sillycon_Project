"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Camera, ImageIcon } from "lucide-react"
import { type Agent, AGENTS } from "@/components/agent-select-screen"
import { SketchyPermissionDialog } from "@/components/sketchy-permission-dialog"
import { CameraView } from "@/components/camera-view"
import { sendChatMessage, type ChatMessage as ApiChatMessage } from "@/lib/api"
import { PirateAnimation } from "@/components/pirate-animation"
import { TrollAnimation } from "@/components/troll-animation"

interface Message {
  id: string
  type: "user" | "agent" | "system"
  text: string
  imageUrl?: string
  timestamp: string
}

const SYSTEM_MESSAGES = [
  "Contract accepted.",
  "Signal unstable.",
  "Additional presence detected.",
  "Integrity dropping.",
  "Temporal index realigned.",
  "Anomaly logged.",
]

function getTimestamp() {
  return new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

interface ChatTerminalProps {
  selectedAgent: string
  integrity: number
  onIntegrityChange: (delta: number) => void
}

export function ChatTerminal({
  selectedAgent,
  integrity,
  onIntegrityChange,
}: ChatTerminalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "sys-0",
      type: "system",
      text: "Session initialized. Agent standing by.",
      timestamp: getTimestamp(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<ApiChatMessage[]>([])
  const [chatHeadTriggerText, setChatHeadTriggerText] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const agent = AGENTS.find((a) => a.id === selectedAgent) as Agent

  // Permission state
  const [permissionType, setPermissionType] = useState<"camera" | "gallery" | null>(null)
  const [cameraPermission, setCameraPermission] = useState(false)
  const [galleryPermission, setGalleryPermission] = useState(false)
  const [showCamera, setShowCamera] = useState(false)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    setMessages([
      {
        id: "sys-reset",
        type: "system",
        text: `Connected to ${agent?.name || "unknown agent"}. Channel secured.`,
        timestamp: getTimestamp(),
      },
    ])
    setChatHistory([])
    setChatHeadTriggerText("")
  }, [selectedAgent, agent?.name])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      text: inputValue,
      timestamp: getTimestamp(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputValue("")
    setIsLoading(true)

    try {
      // Call backend API
      const response = await sendChatMessage(inputValue, selectedAgent, chatHistory)
      
      // Update chat history
      const newHistory: ApiChatMessage[] = [
        ...chatHistory,
        { role: "user", content: inputValue },
        { role: "assistant", content: response.response },
      ]
      setChatHistory(newHistory)

      // Add agent response
      const agentMsg: Message = {
        id: `agent-${Date.now()}`,
        type: "agent",
        text: response.response,
        timestamp: getTimestamp(),
      }
      setMessages((prev) => [...prev, agentMsg])

      // Drive chat head animation from latest response (pirate or troll)
      if (selectedAgent === "archivist" || selectedAgent === "jester") {
        setChatHeadTriggerText(response.response)
      }

      // Maybe add a system message
      if (Math.random() > 0.5) {
        setTimeout(() => {
          const sysText = SYSTEM_MESSAGES[Math.floor(Math.random() * SYSTEM_MESSAGES.length)]
          const sysMsg: Message = {
            id: `sys-${Date.now()}`,
            type: "system",
            text: sysText,
            timestamp: getTimestamp(),
          }
          setMessages((prev) => [...prev, sysMsg])
          onIntegrityChange(-Math.floor(Math.random() * 5 + 1))
        }, 1200)
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      
      // Show error message if backend is unavailable
      const errorMsg: Message = {
        id: `agent-${Date.now()}`,
        type: "agent",
        text: "[CONNECTION ERROR] Unable to reach agent server. Please check that the backend is running.",
        timestamp: getTimestamp(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageMessage = async (dataUrl: string) => {
    const userMsg: Message = {
      id: `user-img-${Date.now()}`,
      type: "user",
      text: "[Image transmitted]",
      imageUrl: dataUrl,
      timestamp: getTimestamp(),
    }
    setMessages((prev) => [...prev, userMsg])

    // For now, show a system message about image processing
    // In the future, we could send the image to the backend for analysis
    setTimeout(() => {
      const sysMsg: Message = {
        id: `sys-img-${Date.now()}`,
        type: "system",
        text: "Image data captured. Visual analysis pending...",
        timestamp: getTimestamp(),
      }
      setMessages((prev) => [...prev, sysMsg])
      onIntegrityChange(-Math.floor(Math.random() * 3 + 2))
    }, 1000 + Math.random() * 800)
  }

  const handleCameraClick = () => {
    if (cameraPermission) {
      setShowCamera(true)
    } else {
      setPermissionType("camera")
    }
  }

  const handleGalleryClick = () => {
    if (galleryPermission) {
      fileInputRef.current?.click()
    } else {
      setPermissionType("gallery")
    }
  }

  const handlePermissionGrant = () => {
    if (permissionType === "camera") {
      setCameraPermission(true)
      setPermissionType(null)
      // Inject a creepy system message
      const sysMsg: Message = {
        id: `sys-cam-${Date.now()}`,
        type: "system",
        text: "OPTICAL_INPUT access granted. Feed now live on relay node.",
        timestamp: getTimestamp(),
      }
      setMessages((prev) => [...prev, sysMsg])
      onIntegrityChange(-3)
      // Open camera after a brief moment
      setTimeout(() => setShowCamera(true), 400)
    } else if (permissionType === "gallery") {
      setGalleryPermission(true)
      setPermissionType(null)
      const sysMsg: Message = {
        id: `sys-gal-${Date.now()}`,
        type: "system",
        text: "LOCAL_VAULT_ACCESS granted. File index being compiled...",
        timestamp: getTimestamp(),
      }
      setMessages((prev) => [...prev, sysMsg])
      onIntegrityChange(-2)
      setTimeout(() => fileInputRef.current?.click(), 400)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      if (dataUrl) handleImageMessage(dataUrl)
    }
    reader.readAsDataURL(file)
    // Reset so same file can be selected again
    e.target.value = ""
  }

  const latency = Math.floor(120 + Math.random() * 100)

  return (
    <>
      <div className="glass-panel rounded-2xl h-full flex flex-col overflow-hidden relative scanline-overlay">
        {/* Top Bar */}
        <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-slow" />
            <span className="font-mono text-xs text-foreground font-bold">
              {agent?.name || "No Agent"}
            </span>
            <Badge
              variant="outline"
              className="font-mono text-[9px] border-primary/30 text-primary/80 bg-primary/5 rounded-lg"
            >
              CONNECTED
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-muted-foreground">
              Integrity:{" "}
              <span
                className={
                  integrity > 50
                    ? "neon-text-green"
                    : integrity > 25
                    ? "text-accent"
                    : "neon-text-red"
                }
              >
                {integrity}%
              </span>
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/60">
              ~{latency}ms
            </span>
          </div>
        </div>

        {/* Single chat head - animations trigger from latest response */}
        {selectedAgent === "archivist" && (
          <div className="shrink-0 flex justify-center py-4 px-2 border-b border-border/20 bg-background/30">
            <PirateAnimation
              agentId={selectedAgent}
              messageText={chatHeadTriggerText}
              className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44"
            />
          </div>
        )}
        {selectedAgent === "jester" && (
          <div className="shrink-0 flex justify-center py-4 px-2 border-b border-border/20 bg-background/30">
            <TrollAnimation
              agentId={selectedAgent}
              messageText={chatHeadTriggerText}
              className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44"
            />
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef}>
          <div className="flex flex-col gap-3">
            {messages.map((msg) => {
              if (msg.type === "system") {
                return (
                  <div
                    key={msg.id}
                    className="w-full bg-secondary/30 border border-border/20 rounded-lg px-3 py-2 animate-slide-up"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] text-muted-foreground/50">
                        [{msg.timestamp}]
                      </span>
                      <span className="font-mono text-[10px] text-accent/80 tracking-wider uppercase">
                        {msg.text}
                      </span>
                    </div>
                  </div>
                )
              }

              if (msg.type === "user") {
                return (
                  <div key={msg.id} className="flex justify-end animate-slide-up">
                    <div className="max-w-[75%] bg-secondary/50 border border-border/30 rounded-xl rounded-br-sm px-4 py-2.5">
                      {msg.imageUrl && (
                        <div className="mb-2 rounded-lg overflow-hidden border border-border/20 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={msg.imageUrl}
                            alt="User transmitted image"
                            className="w-full max-h-48 object-cover"
                          />
                          <div className="absolute inset-0 scanline-overlay pointer-events-none" />
                          <div className="absolute bottom-1 right-1.5 font-mono text-[8px] text-primary/50 bg-background/60 px-1.5 py-0.5 rounded">
                            TRANSMITTED
                          </div>
                        </div>
                      )}
                      <p className="font-mono text-xs text-foreground leading-relaxed">{msg.text}</p>
                      <span className="font-mono text-[9px] text-muted-foreground/40 mt-1 block text-right">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                )
              }

              return (
                <div key={msg.id} className="flex justify-start animate-slide-up">
                  <div className="max-w-[75%] glass-panel-active rounded-xl rounded-bl-sm px-4 py-2.5">
                    <p className="font-mono text-xs text-foreground/90 leading-relaxed">
                      {msg.text}
                    </p>
                    <span className="font-mono text-[9px] text-primary/40 mt-1 block">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="px-4 py-3 border-t border-border/30 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-2"
          >
            {/* Camera button */}
            <button
              type="button"
              onClick={handleCameraClick}
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 border ${
                cameraPermission
                  ? "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
                  : "bg-secondary/20 border-border/30 text-muted-foreground/50 hover:text-muted-foreground hover:bg-secondary/30"
              }`}
              aria-label="Open camera"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>

            {/* Gallery button */}
            <button
              type="button"
              onClick={handleGalleryClick}
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 border ${
                galleryPermission
                  ? "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
                  : "bg-secondary/20 border-border/30 text-muted-foreground/50 hover:text-muted-foreground hover:bg-secondary/30"
              }`}
              aria-label="Open gallery"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>

            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your request..."
              className="flex-1 bg-secondary/30 border-border/30 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-primary/20 rounded-xl h-10"
            />
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 hover:border-primary/50 rounded-full h-10 w-10 p-0 shrink-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>

          {/* Hidden file input for gallery */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* Permission Dialog */}
      {permissionType && (
        <SketchyPermissionDialog
          type={permissionType}
          onGrant={handlePermissionGrant}
          onDeny={() => setPermissionType(null)}
        />
      )}

      {/* Camera View */}
      {showCamera && (
        <CameraView
          onClose={() => setShowCamera(false)}
          onCapture={(dataUrl) => {
            handleImageMessage(dataUrl)
            setShowCamera(false)
          }}
        />
      )}
    </>
  )
}
