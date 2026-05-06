import type { GenreNode } from "@/data/genres"

export type GenreTree = {
  byId: Map<string, GenreNode>
  childrenByParentId: Map<string, GenreNode[]>
  parentById: Map<string, string | null>
}

export function buildGenreTree(nodes: GenreNode[]): GenreTree {
  const byId = new Map<string, GenreNode>()
  const parentById = new Map<string, string | null>()

  for (const n of nodes) {
    byId.set(n.id, n)
    parentById.set(n.id, n.parentId)
  }

  const childrenByParentId = new Map<string, GenreNode[]>()
  for (const n of nodes) {
    if (n.parentId == null) continue
    const arr = childrenByParentId.get(n.parentId) ?? []
    arr.push(n)
    childrenByParentId.set(n.parentId, arr)
  }

  // Stable ordering for UI.
  for (const [k, arr] of childrenByParentId.entries()) {
    arr.sort((a, b) => a.name.localeCompare(b.name))
    childrenByParentId.set(k, arr)
  }

  return { byId, childrenByParentId, parentById }
}

export function getAncestorsIncludingSelf(tree: GenreTree, nodeId: string) {
  const out = new Set<string>()
  let cur: string | null | undefined = nodeId

  while (cur != null) {
    out.add(cur)
    cur = tree.parentById.get(cur)
  }
  return out
}

export function getBreadcrumb(tree: GenreTree, nodeId: string) {
  const path: GenreNode[] = []
  let cur: string | null | undefined = nodeId

  while (cur != null) {
    const n = tree.byId.get(cur)
    if (!n) break
    path.push(n)
    cur = n.parentId
  }

  path.reverse()
  return path
}
