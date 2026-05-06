export type DailyPuzzle = {
  date: string // YYYY-MM-DD (user local)
  deezerTrackId: number
  answerGenreId: string
}

// Static list for MVP. Add one entry per day.
// Note: the answer can be an internal node.
export const PUZZLES: DailyPuzzle[] = [
  // Example: Daft Punk - Harder, Better, Faster, Stronger
  { date: "2026-05-06", deezerTrackId: 3135556, answerGenreId: "french-house" },
]

export function getPuzzleForDate(date: string) {
  return PUZZLES.find((p) => p.date === date) ?? null
}
