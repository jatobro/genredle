"use client"

import dynamic from "next/dynamic"

const GenredleGame = dynamic(
  () => import("@/components/genredle/game").then((m) => m.GenredleGame),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-lg border p-4 text-sm text-muted-foreground">
        Loading today&apos;s puzzle...
      </div>
    ),
  }
)

export function GenredleGameIsland() {
  return <GenredleGame />
}
