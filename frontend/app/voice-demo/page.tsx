"use client"

import { VoicePrivacyDemo } from "@/components/voice-privacy-demo"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function VoiceDemoPage() {
  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center gap-6">
      <Button variant="ghost" asChild className="absolute top-4 left-4">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>
      <VoicePrivacyDemo />
    </div>
  )
}
