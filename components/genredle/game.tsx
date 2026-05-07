"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { GENRES } from "@/data/genres"
import { getPuzzleForDate } from "@/data/puzzles"
import { getLocalDateKey } from "@/lib/date"
import { buildGenreTree, getBreadcrumb } from "@/lib/genre-tree"
import { applyPick, createNewDayState, MAX_STRIKES } from "@/lib/game"
import { AudioPlayer } from "@/components/genredle/audio-player"
import { loadDayState, saveDayState, loadStats, saveStats } from "@/lib/storage"

type DeezerTrackResponse = {
  id: number
  title: string
  artist: string | null
  previewUrl: string
}

function getPreviousDateKey(dateKey: string) {
  // dateKey is YYYY-MM-DD (local)
  const [y, m, d] = dateKey.split("-").map((x) => Number(x))
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1)
  dt.setDate(dt.getDate() - 1)
  return getLocalDateKey(dt)
}

export function GenredleGame() {
  const tree = React.useMemo(() => buildGenreTree(GENRES), [])

  const dateKey = React.useMemo(() => getLocalDateKey(), [])
  const puzzle = React.useMemo(() => getPuzzleForDate(dateKey), [dateKey])
  const puzzleTrackId = puzzle?.deezerTrackId ?? null

  const [state, setState] = React.useState(() => {
    const existing = loadDayState(dateKey)
    return existing ?? createNewDayState(dateKey)
  })
  // Track preview state is managed via trackState below.

  // Fetch track preview when puzzle changes.
  const [trackState, setTrackState] = React.useState<{
    status: "idle" | "loaded" | "error"
    trackId: number | null
    track: DeezerTrackResponse | null
    error: string | null
  }>(() => ({ status: "idle", trackId: null, track: null, error: null }))

  React.useEffect(() => {
    if (!puzzleTrackId) return

    const ac = new AbortController()

    fetch(`/api/deezer/track/${puzzleTrackId}`, { signal: ac.signal })
      .then(async (r) => {
        const j = await r.json().catch(() => null)
        if (!r.ok) {
          throw new Error((j && j.error) || `Request failed (${r.status})`)
        }
        return j as DeezerTrackResponse
      })
      .then((t) => {
        setTrackState({
          status: "loaded",
          trackId: puzzleTrackId,
          track: t,
          error: null,
        })
      })
      .catch((e) => {
        if (ac.signal.aborted) return
        setTrackState({
          status: "error",
          trackId: puzzleTrackId,
          track: null,
          error: String(e?.message ?? e),
        })
      })

    return () => ac.abort()
  }, [puzzleTrackId])

  React.useEffect(() => {
    // Persist on every change for MVP simplicity.
    if (state.dateKey !== dateKey) return
    saveDayState(state)
  }, [dateKey, state])

  React.useEffect(() => {
    // Commit stats once when a day transitions to a terminal state.
    if (state.dateKey !== dateKey) return
    if (state.status === "playing") return

    const stats = loadStats()
    if (stats.lastPlayedDateKey === dateKey) return

    stats.played += 1
    stats.lastPlayedDateKey = dateKey

    if (state.status === "won") {
      stats.won += 1
      const k = String(state.strikesUsed)
      stats.strikeDistribution[k] = (stats.strikeDistribution[k] ?? 0) + 1

      const prev = stats.lastWonDateKey
      const yesterday = getPreviousDateKey(dateKey)
      stats.streak = prev === yesterday ? stats.streak + 1 : 1
      stats.bestStreak = Math.max(stats.bestStreak, stats.streak)
      stats.lastWonDateKey = dateKey
    } else {
      stats.streak = 0
    }

    saveStats(stats)
  }, [dateKey, state.dateKey, state.status, state.strikesUsed])

  if (!puzzle) {
    return (
      <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-4 p-6">
        <h1 className="text-lg font-medium">Genredle</h1>
        <div className="rounded-lg border p-4 text-sm">
          <div className="font-medium">No puzzle configured for {dateKey}</div>
          <div className="mt-1 text-muted-foreground">
            Add an entry for this date in <code>data/puzzles.ts</code>.
          </div>
        </div>
      </div>
    )
  }

  const current = tree.byId.get(state.currentNodeId)
  const children = tree.childrenByParentId.get(state.currentNodeId) ?? []
  const breadcrumb = getBreadcrumb(tree, state.currentNodeId).filter((n) => n.id !== "root")
  const answerBreadcrumb = getBreadcrumb(tree, puzzle.answerGenreId).filter((n) => n.id !== "root")

  const onPick = (nodeId: string) => {
    setState((s) =>
      applyPick({
        state: s,
        pickedNodeId: nodeId,
        answerGenreId: puzzle.answerGenreId,
        tree,
      })
    )
  }

  const canPick = state.status === "playing"

  const share = async () => {
    const title = `Genredle ${dateKey}`
    const result =
      state.status === "won"
        ? `${state.strikesUsed}/${MAX_STRIKES} strikes`
        : `X/${MAX_STRIKES} strikes`
    const body = `${title}\n${result}\nPicks: ${state.picks.length}`
    try {
      await navigator.clipboard.writeText(body)
    } catch {
      // Clipboard may fail; ignore for MVP.
    }
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <header className="flex items-baseline justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-lg font-medium">Genredle</h1>
          <div className="text-xs text-muted-foreground">{dateKey}</div>
        </div>
        <div className="text-sm">
          Strikes: <span className="font-medium">{state.strikesUsed}</span>/{MAX_STRIKES}
        </div>
      </header>

      <section className="rounded-lg border p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="text-sm font-medium">Listen</div>
          <div className="text-xs text-muted-foreground">
            {state.status !== "playing" && trackState.track && trackState.trackId === puzzleTrackId ? (
              <span>
                Revealed:{" "}
                {trackState.track.artist
                  ? `${trackState.track.artist} - ${trackState.track.title}`
                  : trackState.track.title}
              </span>
            ) : null}
          </div>
        </div>

        {trackState.status === "error" && trackState.trackId === puzzleTrackId ? (
          <div className="text-sm text-destructive">{trackState.error}</div>
        ) : trackState.status === "loaded" && trackState.trackId === puzzleTrackId && trackState.track ? (
          <AudioPlayer
            previewUrl={trackState.track.previewUrl}
            strikesUsed={state.strikesUsed}
            disabled={false}
          />
        ) : (
          <div className="text-sm text-muted-foreground">Loading track preview...</div>
        )}
      </section>

      <section className="rounded-lg border p-4">
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">Guess the genre</div>
          <div className="text-xs text-muted-foreground">
            Current: {current?.id === "root" ? "Root" : current?.name}
          </div>
          <div className="text-xs">
            Path:{" "}
            {breadcrumb.length === 0 ? (
              <span className="text-muted-foreground">(none)</span>
            ) : (
              breadcrumb.map((n) => n.name).join(" / ")
            )}
          </div>
        </div>

        {state.status !== "playing" ? (
          <div className="mt-4 flex flex-col gap-3">
            <div className="text-sm">
              {state.status === "won" ? "You got it." : "Out of strikes."}
            </div>
            <div className="text-sm">
              Answer: <span className="font-medium">{answerBreadcrumb.map((n) => n.name).join(" / ")}</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={share}>Share</Button>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {children.map((c) => (
              <Button
                key={c.id}
                variant="secondary"
                onClick={() => onPick(c.id)}
                disabled={!canPick}
                className="justify-start"
              >
                {c.name}
              </Button>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
