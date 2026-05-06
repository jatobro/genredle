import { GenredleGame } from "@/components/genredle/game"

export default function Page() {
  return (
    <main>
      {/** Client-side because "today" is user-local and we persist in localStorage. */}
      <GenredleGame />
    </main>
  )
}
