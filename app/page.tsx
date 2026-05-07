export default function Page() {
  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-lg font-medium">Genredle</h1>
        <p className="text-sm text-muted-foreground">
          Listen to the clip, then traverse the genre tree. Wrong branch costs a strike; 6 strikes and you&apos;re out.
        </p>
      </header>

      {/** Client-only island (local date + localStorage) */}
      <GenredleGameIsland />
    </main>
  )
}

import { GenredleGameIsland } from "@/components/genredle/game-island"
