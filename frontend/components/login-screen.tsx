"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { playClick, playHover } from "@/lib/sounds"

interface LoginScreenProps {
  onConnect: (alias: string) => void
}

export function LoginScreen({ onConnect }: LoginScreenProps) {
  const [alias, setAlias] = useState("")
  const [accessKey, setAccessKey] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    playClick()
    onConnect(alias || "ANONYMOUS")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden flicker-effect">
      {/* Subtle animated background gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, hsla(270, 50%, 15%, 0.5) 0%, transparent 70%)",
        }}
      />

      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      <div className="scanline-overlay absolute inset-0 pointer-events-none" />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="glass-panel-active rounded-2xl p-8 animate-fade-in">
          {/* Glow effect behind the card */}
          <div
            className="absolute -inset-1 rounded-2xl opacity-20 blur-xl -z-10"
            style={{
              background:
                "radial-gradient(ellipse, hsla(180, 100%, 50%, 0.15), transparent 70%)",
            }}
          />

          <div className="flex flex-col items-center gap-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="font-mono text-lg tracking-[0.3em] neon-text-cyan font-bold">
                NODE ACCESS TERMINAL
              </h1>
              <p className="font-mono text-xs text-muted-foreground mt-2 tracking-wider">
                {'"Unauthorized users will be ignored."'}
              </p>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-border/50" />

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="alias"
                  className="font-mono text-xs text-muted-foreground uppercase tracking-widest"
                >
                  Alias
                </label>
                <Input
                  id="alias"
                  placeholder="Enter alias..."
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  className="bg-secondary/50 border-border/50 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:ring-primary/20 rounded-xl h-11"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="access-key"
                  className="font-mono text-xs text-muted-foreground uppercase tracking-widest"
                >
                  Access Key
                </label>
                <Input
                  id="access-key"
                  type="password"
                  placeholder="Access key (optional)"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  className="bg-secondary/50 border-border/50 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:ring-primary/20 rounded-xl h-11"
                />
              </div>

              <Button
                type="submit"
                onMouseEnter={playHover}
                className="w-full font-mono tracking-[0.25em] text-sm h-11 rounded-xl bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 mt-2"
              >
                CONNECT
              </Button>
            </form>

            {/* Footer */}
            <p className="font-mono text-[10px] text-muted-foreground/60 text-center tracking-wider leading-relaxed">
              All data is fictional. This is a simulated network.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
