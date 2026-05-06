const DAY_PREFIX = "genredle:day:v1:"
const STATS_KEY = "genredle:stats:v1"

export type StoredPick = {
  nodeId: string
  correctStep: boolean
  ts: number
}

export type DayState = {
  dateKey: string
  currentNodeId: string
  picks: StoredPick[]
  strikesUsed: number
  status: "playing" | "won" | "lost"
  listenTier: number
}

export type StatsState = {
  played: number
  won: number
  streak: number
  bestStreak: number
  // strikeDistribution[strikesUsed] = count; only for wins.
  strikeDistribution: Record<string, number>
  lastPlayedDateKey: string | null
  lastWonDateKey: string | null
}

export function loadDayState(dateKey: string): DayState | null {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(`${DAY_PREFIX}${dateKey}`)
  if (!raw) return null
  try {
    return JSON.parse(raw) as DayState
  } catch {
    return null
  }
}

export function saveDayState(state: DayState) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(`${DAY_PREFIX}${state.dateKey}`, JSON.stringify(state))
}

export function loadStats(): StatsState {
  if (typeof window === "undefined") {
    return {
      played: 0,
      won: 0,
      streak: 0,
      bestStreak: 0,
      strikeDistribution: {},
      lastPlayedDateKey: null,
      lastWonDateKey: null,
    }
  }

  const raw = window.localStorage.getItem(STATS_KEY)
  if (!raw) {
    return {
      played: 0,
      won: 0,
      streak: 0,
      bestStreak: 0,
      strikeDistribution: {},
      lastPlayedDateKey: null,
      lastWonDateKey: null,
    }
  }

  try {
    return JSON.parse(raw) as StatsState
  } catch {
    return {
      played: 0,
      won: 0,
      streak: 0,
      bestStreak: 0,
      strikeDistribution: {},
      lastPlayedDateKey: null,
      lastWonDateKey: null,
    }
  }
}

export function saveStats(stats: StatsState) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STATS_KEY, JSON.stringify(stats))
}
