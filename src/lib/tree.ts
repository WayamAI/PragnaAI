import type { HierarchyNode } from "@/data/hierarchy";

export type TreeRow = { node: HierarchyNode; depth: number; parentId: string | null };

/** Nodes open on first paint: the top two levels plus the Battery Pack branch. */
export function initialOpen(node: HierarchyNode, depth = 0, out = new Set<string>()) {
  if (depth < 2 || node.id === "power" || node.id === "battery-pack") out.add(node.id);
  node.children?.forEach((c) => initialOpen(c, depth + 1, out));
  return out;
}

export function visibleRows(
  node: HierarchyNode,
  open: Set<string>,
  depth = 0,
  parentId: string | null = null,
  out: TreeRow[] = [],
) {
  out.push({ node, depth, parentId });
  if (node.children?.length && open.has(node.id)) {
    node.children.forEach((c) => visibleRows(c, open, depth + 1, node.id, out));
  }
  return out;
}

/** Names from the root down to the parent of `id`, or null when the id is not in the tree. */
export function ancestorNames(
  node: HierarchyNode,
  id: string,
  trail: string[] = [],
): string[] | null {
  if (node.id === id) return trail;
  for (const c of node.children ?? []) {
    const hit = ancestorNames(c, id, [...trail, node.name]);
    if (hit) return hit;
  }
  return null;
}

/** Opens or closes `id` (or flips it when `to` is omitted) without mutating `open`. */
export function toggleOpen(open: Set<string>, id: string, to?: boolean) {
  const next = new Set(open);
  if (to ?? !next.has(id)) next.add(id);
  else next.delete(id);
  return next;
}
