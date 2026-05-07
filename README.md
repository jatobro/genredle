# Genredle

A daily, music-themed guessing game inspired by Wordle-style "-dle" games.

Press play, listen to a short clip, then traverse a curated genre tree to find the correct genre (sometimes very specific, sometimes intentionally broad).

## How It Works

- One puzzle per day (based on your local date `YYYY-MM-DD`).
- You guess by selecting nodes in a genre tree.
- Picking a node that is on the correct branch advances you deeper without a strike.
- Picking a node on the wrong branch gives you +1 strike.
- You lose after 6 strikes.
- Answers can be internal nodes (not always a leaf).

### Audio Unlock

Audio is unlocked per strike (MVP tiers):

- `1, 2, 4, 7, 11, 16, 30` seconds (capped at 30s due to preview length)

## Audio Source (MVP)

The MVP uses Deezer 30s preview clips.

- API proxy route: `GET /api/deezer/track/:id`
- The client plays the returned `previewUrl`.

## Content and Audio Licensing

Genredle uses third-party preview clips for the MVP (currently via Deezer). Track previews, metadata, and availability are provided by Deezer and may change or disappear over time.

This project does not grant any rights to the underlying music. If you deploy Genredle publicly, ensure you have the appropriate rights to use any audio content and comply with the terms of the audio provider(s) you integrate.

Genredle is not affiliated with or endorsed by Deezer.

## No Login / Persistence

There is no login. Game history and stats are stored in the browser via `localStorage`.

- Per-day state: `genredle:day:v1:<YYYY-MM-DD>`
- Aggregate stats: `genredle:stats:v1`

## Configure Daily Puzzles

Daily puzzles are a static list in the repo.

- Genre taxonomy: `data/genres.ts`
- Daily puzzles: `data/puzzles.ts`

To add a puzzle:

1. Pick a date key: `YYYY-MM-DD` (local date)
2. Pick a Deezer track id
3. Set `answerGenreId` to a node id that exists in `data/genres.ts`

Example:

```ts
// data/puzzles.ts
{ date: "2026-05-06", deezerTrackId: 3135556, answerGenreId: "french-house" }
```

If today's date is missing from `data/puzzles.ts`, the app shows a "No puzzle configured" message.

## Development

```bash
npm install
npm run dev
```

Checks:

```bash
npm run lint
npm run typecheck
npm run build
```

## Project Structure (Relevant)

- `app/` - Next.js App Router
- `app/api/deezer/track/[id]/route.ts` - Deezer track preview proxy
- `components/genredle/`
- `game-island.tsx` - client-only island (`ssr: false`) to avoid hydration mismatches (local date + localStorage)
- `game.tsx` - main game UI/state
- `audio-player.tsx` - audio unlock enforcement
- `data/genres.ts` - curated genre tree
- `data/puzzles.ts` - static daily puzzle list
- `lib/` - game logic + storage helpers

## License

MIT (see `LICENSE`).
