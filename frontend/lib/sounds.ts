/**
 * Lightweight UI sounds: Web Audio API for buttons, and helpers for asset playback.
 */

let audioContext: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null
  if (!audioContext) audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  return audioContext
}

/** Short, soft tick for button hover (must be called on user gesture for some browsers). */
export function playHover(): void {
  const ctx = getContext()
  if (!ctx) return
  try {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.connect(g)
    g.connect(ctx.destination)
    o.frequency.setValueAtTime(280, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.04)
    g.gain.setValueAtTime(0.06, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06)
    o.start(ctx.currentTime)
    o.stop(ctx.currentTime + 0.06)
  } catch {
    // ignore
  }
}

/** Clear click for button press. */
export function playClick(): void {
  const ctx = getContext()
  if (!ctx) return
  try {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = "sine"
    o.connect(g)
    g.connect(ctx.destination)
    o.frequency.setValueAtTime(400, ctx.currentTime)
    g.gain.setValueAtTime(0.12, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
    o.start(ctx.currentTime)
    o.stop(ctx.currentTime + 0.08)
  } catch {
    // ignore
  }
}

/** Play an audio file from public (e.g. /music.webm). Returns the Audio instance for control. */
export function playAudio(src: string, options?: { loop?: boolean; volume?: number }): HTMLAudioElement | null {
  if (typeof window === "undefined") return null
  try {
    const a = new Audio(src)
    if (options?.loop) a.loop = true
    if (options?.volume != null) a.volume = Math.max(0, Math.min(1, options.volume))
    a.play().catch(() => {})
    return a
  } catch {
    return null
  }
}
