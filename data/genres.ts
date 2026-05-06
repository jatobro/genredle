export type GenreNode = {
  id: string
  name: string
  parentId: string | null
  // Optional synonyms for future search/typeahead.
  aliases?: string[]
  // If true, don't use as a daily answer.
  hidden?: boolean
}

// A small, curated tree inspired by (but not copied from) RYM.
// Keep it strict (single parent) so traversal is unambiguous.
export const GENRES: GenreNode[] = [
  { id: "root", name: "All", parentId: null, hidden: true },

  // Roots
  { id: "electronic", name: "Electronic", parentId: "root" },
  { id: "rock", name: "Rock", parentId: "root" },
  { id: "hip-hop", name: "Hip-Hop", parentId: "root", aliases: ["hip hop"] },
  { id: "pop", name: "Pop", parentId: "root" },
  { id: "jazz", name: "Jazz", parentId: "root" },
  { id: "metal", name: "Metal", parentId: "root" },
  { id: "folk", name: "Folk", parentId: "root" },
  { id: "classical", name: "Classical", parentId: "root" },

  // Electronic
  { id: "house", name: "House", parentId: "electronic" },
  { id: "techno", name: "Techno", parentId: "electronic" },
  { id: "drum-and-bass", name: "Drum & Bass", parentId: "electronic", aliases: ["dnb", "drum and bass"] },
  { id: "hardcore", name: "Hardcore", parentId: "electronic" },
  { id: "ambient", name: "Ambient", parentId: "electronic" },
  { id: "idm", name: "IDM", parentId: "electronic", aliases: ["intelligent dance music"] },
  { id: "trance", name: "Trance", parentId: "electronic" },

  // House
  { id: "deep-house", name: "Deep House", parentId: "house" },
  { id: "french-house", name: "French House", parentId: "house" },
  { id: "progressive-house", name: "Progressive House", parentId: "house" },
  { id: "acid-house", name: "Acid House", parentId: "house" },

  // Techno
  { id: "detroit-techno", name: "Detroit Techno", parentId: "techno" },
  { id: "minimal-techno", name: "Minimal Techno", parentId: "techno" },

  // Drum & Bass
  { id: "jungle", name: "Jungle", parentId: "drum-and-bass" },
  { id: "liquid-dnb", name: "Liquid D&B", parentId: "drum-and-bass", aliases: ["liquid drum and bass"] },
  { id: "neurofunk", name: "Neurofunk", parentId: "drum-and-bass" },

  // Hardcore
  { id: "gabber", name: "Gabber", parentId: "hardcore" },
  { id: "happy-hardcore", name: "Happy Hardcore", parentId: "hardcore" },
  { id: "breakbeat", name: "Breakbeat", parentId: "hardcore" },
  { id: "breakbeat-hardcore", name: "Breakbeat Hardcore", parentId: "breakbeat", aliases: ["uk hardcore"] },

  // Rock
  { id: "alternative-rock", name: "Alternative Rock", parentId: "rock" },
  { id: "indie-rock", name: "Indie Rock", parentId: "rock" },
  { id: "punk", name: "Punk", parentId: "rock" },
  { id: "classic-rock", name: "Classic Rock", parentId: "rock" },

  // Metal
  { id: "heavy-metal", name: "Heavy Metal", parentId: "metal" },
  { id: "thrash-metal", name: "Thrash Metal", parentId: "metal" },
  { id: "black-metal", name: "Black Metal", parentId: "metal" },
  { id: "death-metal", name: "Death Metal", parentId: "metal" },

  // Hip-Hop
  { id: "boom-bap", name: "Boom Bap", parentId: "hip-hop" },
  { id: "trap", name: "Trap", parentId: "hip-hop" },
  { id: "conscious-hip-hop", name: "Conscious", parentId: "hip-hop" },

  // Jazz
  { id: "bebop", name: "Bebop", parentId: "jazz" },
  { id: "cool-jazz", name: "Cool Jazz", parentId: "jazz" },
  { id: "fusion", name: "Fusion", parentId: "jazz" },
]
