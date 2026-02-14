"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Camera, ImageIcon, Mic, Square } from "lucide-react"
import { type Agent, AGENTS } from "@/components/agent-select-screen"
import { SketchyPermissionDialog } from "@/components/sketchy-permission-dialog"
import { VoiceEducationDialog } from "@/components/voice-education-dialog"
import { CameraView } from "@/components/camera-view"
import { sendChatMessage, uploadVoiceForTranscription, type ChatMessage as ApiChatMessage } from "@/lib/api"
import { playClick, playHover } from "@/lib/sounds"
import { useVoiceRecording } from "@/hooks/use-voice-recording"
import { PirateAnimation } from "@/components/pirate-animation"
import { TrollAnimation } from "@/components/troll-animation"
import { CatGifHead } from "@/components/cat-gif-head"

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

function AgentFlyToWebcam({
  play,
  imageSrc,
  onShoot,
  onDone,
}: {
  play: boolean
  imageSrc: string
  onShoot: () => void
  onDone: () => void
}) {
  const tokenRef = useRef<HTMLDivElement | null>(null)
  const beamRef = useRef<HTMLDivElement | null>(null)
  const flashRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!play) return

    const token = tokenRef.current
    if (!token) return

    const target = document.getElementById("webcam-overlay")
    if (!target) return

    const targetRect = target.getBoundingClientRect()
    const endX = targetRect.left + targetRect.width / 2
    const endY = targetRect.top + targetRect.height / 2

    const startX = -120
    const startY = window.innerHeight * 0.5

    const midX = window.innerWidth * 0.5
    const midY = window.innerHeight * 0.5

    let didShoot = false
    const anim = token.animate(
      [
        { transform: `translate(${startX}px, ${startY}px) scale(1)`, opacity: 0.0 },
        { transform: `translate(${startX + 60}px, ${startY}px) scale(1)`, opacity: 1.0, offset: 0.08 },
        { transform: `translate(${midX}px, ${midY}px) scale(1)`, opacity: 1.0, offset: 0.66 },
        { transform: `translate(${midX}px, ${midY}px) scale(1)`, opacity: 1.0 },
      ],
      {
        duration: 12000,
        easing: "cubic-bezier(.2,.9,.2,1)",
        fill: "forwards",
      }
    )

    const shootTimer = window.setTimeout(() => {
      didShoot = true

      const gunshot = new Audio("/gunshot_sound.webm")
      gunshot.volume = 0.6
      gunshot.play().catch(() => {})

      const beam = beamRef.current
      if (beam) {
        const left = Math.min(midX, endX)
        const width = Math.max(0, Math.abs(endX - midX))
        beam.style.left = `${left}px`
        beam.style.top = `${midY}px`
        beam.style.width = `${width}px`
        beam.style.transformOrigin = endX >= midX ? "left center" : "right center"
        beam.animate(
        [
          { opacity: 0, transform: "scaleX(0.2)" },
          { opacity: 1, transform: "scaleX(1)" },
          { opacity: 0, transform: "scaleX(1.15)" },
        ],
        { duration: 260, easing: "ease-out", fill: "forwards" }
        )
      }
      const flash = flashRef.current
      if (flash) {
        flash.animate(
          [
            { opacity: 0 },
            { opacity: 1, offset: 0.05 },
            { opacity: 1, offset: 0.85 },
            { opacity: 0, offset: 1 },
          ],
          { duration: 2000, easing: "linear", fill: "forwards" }
        )
      }
      onShoot()

      anim.cancel()

      const fadeOut = token.animate(
        [
          { opacity: 1, transform: `translate(${midX}px, ${midY}px) scale(1)` },
          { opacity: 0, transform: `translate(${midX}px, ${midY}px) scale(0.85)` },
        ],
        { duration: 350, easing: "ease-in", fill: "forwards" }
      )

      fadeOut.onfinish = () => onDone()
    }, 8000)

    anim.onfinish = () => {
      if (didShoot) return
      window.clearTimeout(shootTimer)
      const fade = token.animate(
        [
          { opacity: 1, transform: `translate(${midX}px, ${midY}px) scale(1)` },
          { opacity: 0, transform: `translate(${midX}px, ${midY}px) scale(0.7)` },
        ],
        { duration: 600, easing: "ease-in", fill: "forwards" }
      )
      fade.onfinish = () => onDone()
    }

    return () => {
      window.clearTimeout(shootTimer)
      anim.cancel()
    }
  }, [play, onDone, onShoot])

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      <div ref={flashRef} className="absolute inset-0 bg-white opacity-0" />
      <div
        ref={beamRef}
        className="absolute h-1 origin-left bg-[hsl(0,85%,55%)] shadow-[0_0_18px_hsla(0,85%,55%,0.6)] opacity-0"
        style={{
          left: 0,
          top: 0,
          width: 0,
          transform: "scaleX(0.2)",
        }}
      />

      <div
        ref={tokenRef}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px]"
        style={{ left: 0, top: 0 }}
      >
        <img
          src={imageSrc}
          alt="Cat shooter"
          className="w-full h-full object-contain select-none tilt-to-and-fro"
          draggable={false}
        />
      </div>
    </div>
  )
}

interface ChatTerminalProps {
  selectedAgent: string
  score: number  // Changed from integrity
  scamAttempts: number  // NEW: Show attempts
  onIntegrityChange?: (delta: number) => void
  onScamResponse?: (wasCorrect: boolean) => void
}

export function ChatTerminal({
  selectedAgent,
  score,
  scamAttempts,
  onIntegrityChange,
  onScamResponse,
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
  const voiceRecordingMsgAdded = useRef(false)
  const agent = AGENTS.find((a) => a.id === selectedAgent) as Agent

  // Permission state
  const [permissionType, setPermissionType] = useState<"camera" | "gallery" | null>(null)
  const [cameraPermission, setCameraPermission] = useState(false)
  const [galleryPermission, setGalleryPermission] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [popup, setPopup] = useState<null | { type: string; message: string }>(null)
  const popupTimer = useRef<number | null>(null)
  const showPopup = (type: string, message: string) => {
  setPopup({ type, message })

  if (popupTimer.current) window.clearTimeout(popupTimer.current)
  popupTimer.current = window.setTimeout(() => setPopup(null), 3000)
}
useEffect(() => {
  return () => {
    if (popupTimer.current) window.clearTimeout(popupTimer.current)
  }
}, [])

  // Voice message / privacy demo
  const [showVoiceEducation, setShowVoiceEducation] = useState(false)
  const [voiceUploading, setVoiceUploading] = useState(false)
  const {
    state: voiceState,
    error: voiceError,
    blob: voiceBlob,
    secondsRemaining: voiceSecondsRemaining,
    startRecording: startVoiceRecording,
    stopRecording: stopVoiceRecording,
    reset: resetVoice,
  } = useVoiceRecording({ durationSeconds: 60 })
  const [playAgentAnim, setPlayAgentAnim] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Voice: add system message when recording starts (once per session)
  useEffect(() => {
    if (voiceState === "recording" && !voiceRecordingMsgAdded.current) {
      voiceRecordingMsgAdded.current = true
      const sysMsg: Message = {
        id: `sys-voice-start-${Date.now()}`,
        type: "system",
        text: "AUDIO_INPUT active. Recording. Relay will transcribe and analyze.",
        timestamp: getTimestamp(),
      }
      setMessages((prev) => [...prev, sysMsg])
      onIntegrityChange?.(-2)
    }
    if (voiceState === "idle" || voiceState === "stopped") voiceRecordingMsgAdded.current = false
  }, [voiceState, onIntegrityChange])

  // Voice: add system message on mic error (denied or failed)
  useEffect(() => {
    if (voiceState === "error" && voiceError) {
      const sysMsg: Message = {
        id: `sys-voice-err-${Date.now()}`,
        type: "system",
        text: "AUDIO_INPUT access denied or unavailable.",
        timestamp: getTimestamp(),
      }
      setMessages((prev) => [...prev, sysMsg])
    }
  }, [voiceState, voiceError])

  // Voice: when recording stops, transcribe then treat transcript like a text message (chat API + warnings)
  useEffect(() => {
    if (voiceState !== "stopped" || !voiceBlob || voiceUploading) return
    setVoiceUploading(true)
    const addTranscribingMsg = () => {
      const sysMsg: Message = {
        id: `sys-voice-xcr-${Date.now()}`,
        type: "system",
        text: "AUDIO_INPUT stream closed. Transcribing and analyzing...",
        timestamp: getTimestamp(),
      }
      setMessages((prev) => [...prev, sysMsg])
    }
    addTranscribingMsg()
    uploadVoiceForTranscription(voiceBlob)
      .then((res) => {
        const transcript = (res.transcript || "").trim() || "(no speech detected)"
        // Add user message (same as typing): voice content as the message
        const userMsg: Message = {
          id: `user-voice-${Date.now()}`,
          type: "user",
          text: `[Voice] ${transcript}`,
          timestamp: getTimestamp(),
        }
        setMessages((prev) => [...prev, userMsg])

        // Send transcript to chat API so agent responds the same way as text
        return sendChatMessage(transcript, selectedAgent, chatHistory).then((chatResponse) => ({
          chatResponse,
          transcript,
          sensitiveSummary: res.sensitive_summary,
        }))
      })
      .then(({ chatResponse, transcript, sensitiveSummary }) => {
        // Update chat history with user + assistant
        const newHistory: ApiChatMessage[] = [
          ...chatHistory,
          { role: "user", content: transcript },
          { role: "assistant", content: chatResponse.response },
        ]
        setChatHistory(newHistory)

        // Add agent response (same as text flow)
        const agentMsg: Message = {
          id: `agent-${Date.now()}`,
          type: "agent",
          text: chatResponse.response,
          timestamp: getTimestamp(),
        }
        setMessages((prev) => [...prev, agentMsg])
        setChatHeadTriggerText(chatResponse.response)

        // Feedback popup + scoring if backend sent one
        if (chatResponse.feedback_popup?.show && onScamResponse) {
          const t = String(chatResponse.feedback_popup.type || "").toLowerCase()
          showPopup(chatResponse.feedback_popup.type, chatResponse.feedback_popup.message)
          if (t === "success" || t === "danger") onScamResponse(t === "success")
        }

        onIntegrityChange?.(-5)

        // After a bit: "websites can still hear you" warning
        const warningDelay = 1800
        window.setTimeout(() => {
          showPopup(
            "warning",
            "Websites can still hear you after you allow once—even if you don't see a red dot."
          )
        }, warningDelay)

        // If something personal was picked up, send another message (system + popup)
        const nothingPersonal =
          !sensitiveSummary ||
          /nothing personal was shared/i.test(sensitiveSummary)
        if (!nothingPersonal && sensitiveSummary) {
          const analysisMsg: Message = {
            id: `sys-voice-ana-${Date.now()}`,
            type: "system",
            text: `AUDIO_INPUT picked up: ${sensitiveSummary}`,
            timestamp: getTimestamp(),
          }
          setMessages((prev) => [...prev, analysisMsg])
          window.setTimeout(() => {
            showPopup(
              "warning",
              `Something personal was detected in what you said. In real life, sites could use that.`
            )
          }, warningDelay + 2200)
        }
      })
      .catch((err) => {
        console.error("Voice transcribe or chat failed:", err)
        const errMsg: Message = {
          id: `sys-voice-fail-${Date.now()}`,
          type: "system",
          text: "[RELAY ERROR] Transcription or chat failed. Check backend.",
          timestamp: getTimestamp(),
        }
        setMessages((prev) => [...prev, errMsg])
      })
      .finally(() => {
        setVoiceUploading(false)
        resetVoice()
      })
  }, [voiceState, voiceBlob, voiceUploading, selectedAgent, chatHistory, onIntegrityChange, onScamResponse, resetVoice])

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
    playClick()

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

      // Check for feedback popup and track scoring (silent - no UI change)
      if (response.feedback_popup?.show && onScamResponse) {
        const t = String(response.feedback_popup.type || "").toLowerCase()
        showPopup(response.feedback_popup.type, response.feedback_popup.message)

        // Only count REAL scam outcomes
        const isScorable = t === "success" || t === "danger"

        if (isScorable) {
          const wasCorrect = t === "success"
          onScamResponse(wasCorrect)
        }
      }

      // Add agent response
      const agentMsg: Message = {
        id: `agent-${Date.now()}`,
        type: "agent",
        text: response.response,
        timestamp: getTimestamp(),
      }
      setMessages((prev) => [...prev, agentMsg])

      // Drive chat head from latest response (pirate / troll animation, cat random GIF)
      setChatHeadTriggerText(response.response)

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

  useEffect(() => {
    if (!showCamera) return
    const t = window.setTimeout(() => {
      setPlayAgentAnim(true)
    }, 3000)
    return () => window.clearTimeout(t)
  }, [showCamera])

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
      // Open camera after a brief momonInteent
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
      setTimeout(() => fileInputRef.current?.click(), 400)
    }
  }

  const handleVoiceMessageClick = () => {
    setShowVoiceEducation(true)
  }

  const handleVoiceEducationContinue = () => {
    setShowVoiceEducation(false)
    startVoiceRecording()
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
    {popup && (
  <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-4">
    <div
      className="rounded-xl border bg-black/80 px-4 py-3 shadow-lg backdrop-blur"
      onClick={() => setPopup(null)}
    >
      <div className="font-semibold mb-1">
        {popup.type === "success"
          ? "Nice catch!"
          : popup.type === "danger"
          ? "Scam risk!"
          : popup.type === "warning"
          ? "Be careful"
          : "Tip"}
      </div>
      <div className="text-sm">{popup.message}</div>
    </div>
  </div>
)}

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
              Detection Score:{" "}
              <span
                className={
                  score > 70
                    ? "neon-text-green"
                    : score > 50
                    ? "text-accent"
                    : "neon-text-red"
                }
              >
                {score}%
              </span>
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/60">
              Attempts: {scamAttempts}
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
        {selectedAgent === "witness" && (
          <div className="shrink-0 flex justify-center py-4 px-2 border-b border-border/20 bg-background/30">
            <CatGifHead
              triggerText={chatHeadTriggerText}
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
          {/* Recording strip: show when voice is recording or uploading */}
          {(voiceState === "recording" || voiceUploading) && (
            <div className="mb-2 flex items-center justify-between rounded-lg bg-primary/10 border border-primary/20 px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                <span className="font-mono text-[10px] text-accent/90 uppercase tracking-wider">
                  {voiceUploading ? "Transcribing…" : `Recording — ${voiceSecondsRemaining}s left`}
                </span>
              </div>
              {voiceState === "recording" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    playClick()
                    stopVoiceRecording()
                  }}
                  onMouseEnter={playHover}
                  className="h-7 px-2 font-mono text-[9px] text-destructive hover:bg-destructive/10"
                >
                  <Square className="w-3 h-3 mr-1" />
                  Stop
                </Button>
              )}
            </div>
          )}

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
              onClick={() => {
                playClick()
                handleCameraClick()
              }}
              onMouseEnter={playHover}
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
              onClick={() => {
                playClick()
                handleGalleryClick()
              }}
              onMouseEnter={playHover}
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 border ${
                galleryPermission
                  ? "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
                  : "bg-secondary/20 border-border/30 text-muted-foreground/50 hover:text-muted-foreground hover:bg-secondary/30"
              }`}
              aria-label="Open gallery"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>

            {/* Voice message button */}
            <button
              type="button"
              onClick={() => {
                playClick()
                handleVoiceMessageClick()
              }}
              onMouseEnter={playHover}
              disabled={voiceState === "recording" || voiceState === "requesting" || voiceUploading}
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 border ${
                voiceState === "recording" || voiceUploading
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-secondary/20 border-border/30 text-muted-foreground/50 hover:text-muted-foreground hover:bg-secondary/30 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
              aria-label="Send voice message"
            >
              <Mic className="w-3.5 h-3.5" />
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
              onMouseEnter={playHover}
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

      {/* Voice education dialog: theme-matched message before requesting mic */}
      {showVoiceEducation && (
        <VoiceEducationDialog
          onContinue={handleVoiceEducationContinue}
          onClose={() => setShowVoiceEducation(false)}
        />
      )}

      {playAgentAnim && (
        <AgentFlyToWebcam
          play={playAgentAnim}
          imageSrc="/cat-shooter.png"
          onShoot={() => window.setTimeout(() => setGameOver(true), 2000)}
          onDone={() => setPlayAgentAnim(false)}
        />
      )}

      {gameOver && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-destructive/55 backdrop-blur-sm" />
          <div className="relative w-full max-w-xl rounded-3xl border-2 border-destructive-foreground/30 bg-background/10 text-destructive-foreground shadow-2xl p-8 text-center">
            <p className="font-mono text-[12px] tracking-[0.35em] uppercase opacity-90">Unauthorized Capture</p>
            <h2 className="mt-3 text-5xl font-extrabold tracking-wider">GAME OVER</h2>
            <p className="mt-4 font-mono text-base leading-relaxed opacity-90">
              In real life, a scammer could grab your face, your room, and your location.
              Never allow camera access unless a trusted adult says it's safe.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => {
                  playClick()
                  setGameOver(false)
                  setShowCamera(false)
                  setPlayAgentAnim(false)
                }}
                onMouseEnter={playHover}
                className="h-12 px-6 rounded-2xl bg-destructive-foreground text-destructive hover:bg-destructive-foreground/90 font-mono font-bold"
              >
                Back to Safety
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
