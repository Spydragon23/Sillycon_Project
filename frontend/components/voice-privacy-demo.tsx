"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useVoiceRecording } from "@/hooks/use-voice-recording"
import { uploadVoiceForTranscription } from "@/lib/api"
import { Mic, Square, AlertCircle } from "lucide-react"

const RECORDING_DURATION_SECONDS = 60

export function VoicePrivacyDemo() {
  const [phase, setPhase] = useState<"intro" | "reveal" | "recording" | "uploading" | "result" | "error">("intro")
  const [transcript, setTranscript] = useState("")
  const [sensitiveSummary, setSensitiveSummary] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const {
    state: recordState,
    error: recordError,
    blob,
    secondsRemaining,
    startRecording,
    stopRecording,
    reset,
  } = useVoiceRecording({ durationSeconds: RECORDING_DURATION_SECONDS })

  // When recording stops and we have a blob, upload
  useEffect(() => {
    if (recordState !== "stopped" || !blob) return
    setPhase("uploading")
    setUploadError(null)
    uploadVoiceForTranscription(blob)
      .then((res) => {
        setTranscript(res.transcript)
        setSensitiveSummary(res.sensitive_summary)
        setPhase("result")
      })
      .catch((e) => {
        setUploadError(e instanceof Error ? e.message : "Upload failed")
        setPhase("error")
      })
  }, [recordState, blob])

  const handleStartDemo = async () => {
    setPhase("reveal")
    setTranscript("")
    setSensitiveSummary(null)
    setUploadError(null)
    await startRecording()
    setPhase("recording")
  }

  const handleStop = () => {
    stopRecording()
  }

  const handleReset = () => {
    reset()
    setPhase("intro")
    setTranscript("")
    setSensitiveSummary(null)
    setUploadError(null)
  }

  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm max-w-lg mx-auto">
      <h2 className="text-lg font-semibold mb-2">Voice message demo</h2>

      {phase === "intro" && (
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Tap the button below to &quot;send&quot; a voice message. See what happens next.
          </p>
          <Button onClick={handleStartDemo} className="w-full" size="lg">
            <Mic className="mr-2 h-4 w-4" />
            Send voice message
          </Button>
        </div>
      )}

      {phase === "reveal" && recordState === "requesting" && (
        <p className="text-muted-foreground">Requesting microphone…</p>
      )}

      {(phase === "reveal" || phase === "recording") && recordState === "recording" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="font-medium">It can still hear you.</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Recording for the next minute. Say whatever you like — we&apos;ll show you what was &quot;heard&quot;.
          </p>
          <p className="text-2xl font-mono tabular-nums">{secondsRemaining}s left</p>
          <Button variant="destructive" onClick={handleStop}>
            <Square className="mr-2 h-4 w-4" />
            Stop recording
          </Button>
        </div>
      )}

      {recordState === "error" && (
        <div className="space-y-2">
          <p className="text-destructive text-sm">{recordError ?? "Something went wrong."}</p>
          <Button variant="outline" onClick={handleReset}>Try again</Button>
        </div>
      )}

      {phase === "uploading" && (
        <p className="text-muted-foreground">Converting speech and checking what was heard…</p>
      )}

      {phase === "result" && (
        <div className="space-y-4">
          <p className="text-sm font-medium">Transcript</p>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap rounded bg-muted p-3">
            {transcript || "(no speech detected)"}
          </p>
          {sensitiveSummary && (
            <>
              <p className="text-sm font-medium">What it &quot;heard&quot; (personal stuff)</p>
              <p className="text-sm rounded bg-amber-500/10 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200 p-3">
                {sensitiveSummary}
              </p>
            </>
          )}
          <Button variant="outline" onClick={handleReset}>Do it again</Button>
        </div>
      )}

      {phase === "error" && uploadError && (
        <div className="space-y-2">
          <p className="text-destructive text-sm">{uploadError}</p>
          <Button variant="outline" onClick={handleReset}>Try again</Button>
        </div>
      )}
    </div>
  )
}
