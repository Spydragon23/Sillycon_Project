"use client"

import { useEffect, useState } from "react"

const CAT_GIFS = ["/gif1.gif", "/gif2.gif", "/gif3.gif", "/gif4.gif", "/gif5.gif", "/gif6.gif"]

function getRandomGifIndex() {
  return Math.floor(Math.random() * CAT_GIFS.length)
}

interface CatGifHeadProps {
  /** When this changes (e.g. new backend response), a new random GIF is picked. */
  triggerText: string
  className?: string
}

export function CatGifHead({ triggerText, className = "" }: CatGifHeadProps) {
  const [gifIndex, setGifIndex] = useState(() => getRandomGifIndex())

  // Pick a new random GIF whenever we get a new response from the backend
  useEffect(() => {
    setGifIndex(getRandomGifIndex())
  }, [triggerText])

  const src = CAT_GIFS[gifIndex]

  return (
    <div className={`flex items-center justify-center overflow-hidden rounded-xl bg-background/20 border border-border/20 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Mr. Whiskers"
        className="w-full h-full object-cover object-center"
        unselectable="on"
        draggable={false}
      />
    </div>
  )
}
