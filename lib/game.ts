import type { DayState } from "@/lib/storage"
import type { GenreTree } from "@/lib/genre-tree"
import { getAncestorsIncludingSelf } from "@/lib/genre-tree"

export const MAX_STRIKES = 6

export const LISTEN_SECONDS_BY_STRIKE = [1, 2, 4, 7, 11, 16, 30] as const

export function getUnlockedSeconds(strikesUsed: number) {
  const idx = Math.min(Math.max(strikesUsed, 0), LISTEN_SECONDS_BY_STRIKE.length - 1)
  return LISTEN_SECONDS_BY_STRIKE[idx]
}

export function createNewDayState(dateKey: string): DayState {
  return {
    dateKey,
    currentNodeId: "root",
    picks: [],
    strikesUsed: 0,
    status: "playing",
    listenTier: 0,
  }
}

export function applyPick(input: {
  state: DayState
  pickedNodeId: string
  answerGenreId: string
  tree: GenreTree
  now?: number
}): DayState {
  const { state, pickedNodeId, answerGenreId, tree } = input
  const now = input.now ?? Date.now()

  if (state.status !== "playing") return state

  // Win immediately if they hit the exact answer (answers may be internal nodes).
  if (pickedNodeId === answerGenreId) {
    return {
      ...state,
      picks: [...state.picks, { nodeId: pickedNodeId, correctStep: true, ts: now }],
      status: "won",
    }
  }

  const ancestors = getAncestorsIncludingSelf(tree, answerGenreId)
  const isCorrectStep = ancestors.has(pickedNodeId)

  if (isCorrectStep) {
    return {
      ...state,
      currentNodeId: pickedNodeId,
      picks: [...state.picks, { nodeId: pickedNodeId, correctStep: true, ts: now }],
    }
  }

  const strikesUsed = state.strikesUsed + 1
  const status = strikesUsed >= MAX_STRIKES ? "lost" : state.status

  return {
    ...state,
    strikesUsed,
    listenTier: strikesUsed,
    picks: [...state.picks, { nodeId: pickedNodeId, correctStep: false, ts: now }],
    status,
  }
}
