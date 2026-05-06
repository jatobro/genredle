import { NextRequest, NextResponse } from "next/server"

// Must be statically analyzable.
export const revalidate = 3600

type DeezerTrack = {
  id: number
  title: string
  preview: string
  artist?: { name?: string }
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params
  const trackId = Number(id)

  if (!Number.isFinite(trackId)) {
    return NextResponse.json({ error: "Invalid track id" }, { status: 400 })
  }

  const res = await fetch(`https://api.deezer.com/track/${trackId}`)
  if (!res.ok) {
    return NextResponse.json(
      { error: `Deezer error (${res.status})` },
      { status: 502 }
    )
  }

  const data = (await res.json()) as DeezerTrack
  if (!data.preview) {
    return NextResponse.json({ error: "No preview available" }, { status: 404 })
  }

  return NextResponse.json({
    id: data.id,
    title: data.title,
    artist: data.artist?.name ?? null,
    previewUrl: data.preview,
  })
}
