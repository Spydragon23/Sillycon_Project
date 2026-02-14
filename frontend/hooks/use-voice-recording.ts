"use client"

import { useState, useRef, useCallback } from "react"

export type RecordingState = "idle" | "requesting" | "recording" | "stopped" | "error"

export interface UseVoiceRecordingOptions {
  /** Recording length in seconds. Default 60. */
  durationSeconds?: number
  /** MIME type for MediaRecorder. Default "audio/webm;codecs=opus". */
  mimeType?: string
}

export interface UseVoiceRecordingReturn {
  state: RecordingState
  error: string | null
  blob: Blob | null
  /** Seconds remaining when recording (0 when idle/stopped). */
  secondsRemaining: number
  startRecording: () => Promise<void>
  stopRecording: () => void
  reset: () => void
}

export function useVoiceRecording(
  options: UseVoiceRecordingOptions = {}
): UseVoiceRecordingReturn {
  const { durationSeconds = 60, mimeType = "audio/webm;codecs=opus" } = options
  const [state, setState] = useState<RecordingState>("idle")
  const [error, setError] = useState<string | null>(null)
  const [blob, setBlob] = useState<Blob | null>(null)
  const [secondsRemaining, setSecondsRemaining] = useState(0)

  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setSecondsRemaining(0)
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop()
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    recorderRef.current = null
    if (state === "recording") setState("stopped")
  }, [state])

  const startRecording = useCallback(async () => {
    setError(null)
    setBlob(null)
    chunksRef.current = []
    setState("requesting")

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mime = MediaRecorder.isTypeSupported(mimeType) ? mimeType : "audio/webm"
      const recorder = new MediaRecorder(stream, { mimeType: mime })
      recorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        if (chunksRef.current.length > 0) {
          setBlob(new Blob(chunksRef.current, { type: mime }))
        }
        setState("stopped")
      }
      recorder.onerror = () => {
        setError("Recording failed")
        setState("error")
      }

      recorder.start(1000)
      setState("recording")
      let remaining = durationSeconds
      setSecondsRemaining(remaining)
      timerRef.current = setInterval(() => {
        remaining -= 1
        setSecondsRemaining(remaining)
        if (remaining <= 0) stopRecording()
      }, 1000)
    } catch (e) {
      const message = e instanceof Error ? e.message : "Could not access microphone"
      setError(message)
      setState("error")
    }
  }, [durationSeconds, mimeType, stopRecording])

  const reset = useCallback(() => {
    stopRecording()
    setState("idle")
    setError(null)
    setBlob(null)
    setSecondsRemaining(0)
    chunksRef.current = []
  }, [stopRecording])

  return {
    state,
    error,
    blob,
    secondsRemaining,
    startRecording,
    stopRecording,
    reset,
  }
}
