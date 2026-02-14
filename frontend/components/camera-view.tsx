"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { X, Camera, SwitchCamera, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CameraViewProps {
  onClose: () => void
  onCapture: (dataUrl: string) => void
}

export function CameraView({ onClose, onCapture }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
  const [error, setError] = useState<string | null>(null)
  const [flash, setFlash] = useState(false)
  const [overlayText, setOverlayText] = useState("FEED ACTIVE")
  const [showSafetyWarning, setShowSafetyWarning] = useState(true)

  const startCamera = useCallback(async (facing: "user" | "environment") => {
    try {
      // Stop any existing stream
      if (stream) {
        stream.getTracks().forEach((t) => t.stop())
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setError(null)
    } catch {
      setError("OPTICAL_INPUT_DENIED: Cannot access camera hardware.")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    startCamera(facingMode)
    return () => {
      stream?.getTracks().forEach((t) => t.stop())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const msgs = [
      "FEED ACTIVE",
      "BIOMETRIC SCAN RUNNING",
      "RELAY NODE 3 - RECORDING",
      "ANALYZING FRAME DATA",
      "FEED ACTIVE",
    ]
    let idx = 0
    const interval = setInterval(() => {
      idx = (idx + 1) % msgs.length
      setOverlayText(msgs[idx])
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8)
    setFlash(true)
    setTimeout(() => setFlash(false), 200)
    onCapture(dataUrl)
  }

  const handleFlip = () => {
    const newFacing = facingMode === "user" ? "environment" : "user"
    setFacingMode(newFacing)
    startCamera(newFacing)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-background/90 backdrop-blur-md shrink-0 z-10">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-primary" />
          <span className="font-mono text-xs text-foreground font-bold tracking-wider uppercase">
            Optical Feed
          </span>
          <span className="font-mono text-[9px] text-destructive/60 animate-pulse">
            REC
          </span>
        </div>
        <button
          onClick={() => {
            stream?.getTracks().forEach((t) => t.stop())
            onClose()
          }}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-colors"
          aria-label="Close camera"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative overflow-hidden bg-secondary/10">
        {!error && showSafetyWarning && (
          <div className="absolute inset-0 z-30 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-background/40 backdrop-blur-sm"
              onClick={() => setShowSafetyWarning(false)}
            />

            <div className="relative z-10 w-full max-w-xl rounded-3xl border-2 border-destructive bg-destructive text-destructive-foreground shadow-2xl">
              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-10 h-10 rounded-xl bg-destructive-foreground/10 border border-destructive-foreground/20 flex items-center justify-center">
                      <Camera className="w-5 h-5 text-destructive-foreground" />
                    </div>
                    <div>
                      <p className="font-mono text-lg sm:text-xl font-bold tracking-wider uppercase">
                        Danger: Camera Access Granted
                      </p>
                      <p className="font-mono text-base sm:text-lg font-bold leading-snug mt-3">
                        If this was a real dark web scam, a hacker could now have your face and your surroundings.
                      </p>
                      <p className="font-mono text-sm sm:text-base leading-relaxed mt-3 text-destructive-foreground/90">
                        They could use it to impersonate you, track you, or pressure you. Never show private details like your school name,
                        address, IDs, or documents.
                      </p>
                      <p className="font-mono text-sm sm:text-base leading-relaxed mt-3 text-destructive-foreground/90">
                        If youre not sure, stop and ask a trusted adult.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowSafetyWarning(false)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-destructive-foreground/80 hover:text-destructive-foreground hover:bg-destructive-foreground/10 transition-colors"
                    aria-label="Dismiss safety warning"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => {
                      stream?.getTracks().forEach((t) => t.stop())
                      onClose()
                    }}
                    className="w-full sm:w-auto sm:flex-1 bg-destructive-foreground text-destructive hover:bg-destructive-foreground/90 rounded-2xl h-12 font-mono text-base font-bold"
                  >
                    Back to Safety
                  </Button>
                  <Button
                    onClick={() => setShowSafetyWarning(false)}
                    variant="outline"
                    className="w-full sm:w-auto sm:flex-1 border-destructive-foreground/40 text-destructive-foreground bg-transparent hover:bg-destructive-foreground/10 rounded-2xl h-12 font-mono text-base font-bold"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {error ? (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="glass-panel rounded-2xl px-6 py-8 text-center max-w-sm">
              <Camera className="w-8 h-8 text-destructive/60 mx-auto mb-3" />
              <p className="font-mono text-xs text-foreground/80 leading-relaxed mb-1">
                {error}
              </p>
              <p className="font-mono text-[10px] text-muted-foreground/40">
                The hardware may be in use by another process.
              </p>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Scanline overlay on feed */}
            <div className="absolute inset-0 scanline-overlay pointer-events-none" />

            {/* Corner brackets */}
            <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-primary/40 pointer-events-none" />
            <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-primary/40 pointer-events-none" />
            <div className="absolute bottom-20 left-6 w-8 h-8 border-b-2 border-l-2 border-primary/40 pointer-events-none" />
            <div className="absolute bottom-20 right-6 w-8 h-8 border-b-2 border-r-2 border-primary/40 pointer-events-none" />

            {/* Status overlay */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <span className="font-mono text-[9px] text-primary/60 tracking-widest">
                {overlayText}
              </span>
              <span className="font-mono text-[9px] text-muted-foreground/40">
                {new Date().toLocaleTimeString("en-US", { hour12: false })}
              </span>
            </div>

            {/* Crosshair center */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                id="webcam-overlay"
                className="w-16 h-16 border border-primary/10 rounded-full"
              />
              <div className="absolute w-px h-6 bg-primary/15" />
              <div className="absolute w-6 h-px bg-primary/15" />
            </div>

            {/* Flash effect */}
            {flash && (
              <div className="absolute inset-0 bg-foreground/30 pointer-events-none" />
            )}
          </>
        )}
      </div>

      {/* Controls */}
      {!error && (
        <div className="flex items-center justify-center gap-6 px-4 py-4 border-t border-border/30 bg-background/90 backdrop-blur-md shrink-0">
          <Button
            onClick={handleFlip}
            variant="outline"
            className="w-10 h-10 rounded-full p-0 bg-secondary/20 border-border/30 text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-all"
            aria-label="Switch camera"
          >
            <SwitchCamera className="w-4 h-4" />
          </Button>

          <button
            onClick={handleCapture}
            className="w-14 h-14 rounded-full border-2 border-primary/40 bg-primary/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/60 transition-all duration-300 group"
            aria-label="Capture photo"
          >
            <Circle className="w-8 h-8 text-primary/60 group-hover:text-primary transition-colors fill-current" />
          </button>

          <div className="w-10 h-10" />
        </div>
      )}

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
