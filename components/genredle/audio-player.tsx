"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { getUnlockedSeconds } from "@/lib/game"

type Props = {
  previewUrl: string
  strikesUsed: number
  disabled?: boolean
}

export function AudioPlayer({ previewUrl, strikesUsed, disabled }: Props) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(0)

  const unlockedSeconds = getUnlockedSeconds(strikesUsed)

  React.useEffect(() => {
    const el = audioRef.current
    if (!el) return

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onTimeUpdate = () => {
      const t = el.currentTime
      setCurrentTime(t)

      // Enforce unlock cap. Reset to 0 so each tier is still "a clip".
      if (t > unlockedSeconds) {
        el.pause()
        el.currentTime = 0
        setCurrentTime(0)
      }
    }

    el.addEventListener("play", onPlay)
    el.addEventListener("pause", onPause)
    el.addEventListener("timeupdate", onTimeUpdate)

    return () => {
      el.removeEventListener("play", onPlay)
      el.removeEventListener("pause", onPause)
      el.removeEventListener("timeupdate", onTimeUpdate)
    }
  }, [unlockedSeconds])

  React.useEffect(() => {
    // If the tier changes while playing, start over.
    const el = audioRef.current
    if (!el) return
    el.pause()
    el.currentTime = 0
    setCurrentTime(0)
  }, [previewUrl, unlockedSeconds])

  const toggle = async () => {
    const el = audioRef.current
    if (!el) return

    if (el.paused) {
      try {
        await el.play()
      } catch {
        // Ignore autoplay/gesture issues; the user can retry.
      }
    } else {
      el.pause()
    }
  }

  const pct = Math.min(100, Math.round((currentTime / unlockedSeconds) * 100))

  return (
    <div className="flex flex-col gap-3">
      <audio ref={audioRef} src={previewUrl} preload="none" />
      <div className="flex items-center justify-between gap-3">
        <Button onClick={toggle} disabled={disabled}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <div className="text-xs text-muted-foreground">
          Unlocked: {unlockedSeconds}s (strikes: {strikesUsed}/6)
        </div>
      </div>
      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-foreground"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
