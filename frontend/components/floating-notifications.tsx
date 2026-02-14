"use client"

import { useEffect, useState, useCallback } from "react"

const NOTIFICATIONS = [
  "Signal triangulated.",
  "Agent deviating from script.",
  "User attention detected.",
  "Encrypted payload intercepted.",
  "Node handshake renewed.",
  "Memory fragment recovered.",
  "Pattern anomaly flagged.",
  "Latency spike in sector 4.",
]

interface Notification {
  id: number
  text: string
}

export function FloatingNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const text = NOTIFICATIONS[Math.floor(Math.random() * NOTIFICATIONS.length)]
      const id = Date.now()

      setNotifications((prev) => {
        const next = [...prev, { id, text }]
        // Keep max 3 notifications
        return next.slice(-3)
      })

      // Auto-remove after 4 seconds
      setTimeout(() => removeNotification(id), 4000)
    }, 6000 + Math.random() * 8000)

    return () => clearInterval(interval)
  }, [removeNotification])

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 pointer-events-none max-w-xs">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="glass-panel-active rounded-xl px-4 py-2.5 animate-slide-up pointer-events-auto"
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow shrink-0" />
            <span className="font-mono text-[10px] text-foreground/80 tracking-wider">
              {notif.text}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
