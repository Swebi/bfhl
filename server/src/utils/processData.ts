import { BfhlResponse, USER_ID, EMAIL_ID, COLLEGE_ROLL_NUMBER } from "../types/types";
import { createUnionFind } from "./unionFind";
import { buildTree, calcDepth, detectCycle } from "./treeUtils";

export const processData = (data: unknown[]): BfhlResponse => {
  const invalidEntries: string[] = [];
  const seenEdgesSet = new Set<string>();
  const duplicateEdgesSet = new Set<string>();
  const duplicateEdges: string[] = [];

  const parentOf = new Map<string, string>();
  const childrenOf = new Map<string, string[]>();
  const allNodes = new Set<string>();
  const childNodes = new Set<string>();

  const nodeIntroOrder = new Map<string, number>();
  let orderIdx = 0;

  for (const entry of data) {
    const trimmed = String(entry).trim();

    if (!/^[A-Z]->[A-Z]$/.test(trimmed) || trimmed[0] === trimmed[3]) {
      invalidEntries.push(trimmed);
      continue;
    }

    const parent = trimmed[0];
    const child = trimmed[3];
    const edge = `${parent}->${child}`;

    if (seenEdgesSet.has(edge)) {
      if (!duplicateEdgesSet.has(edge)) {
        duplicateEdgesSet.add(edge);
        duplicateEdges.push(edge);
      }
      continue;
    }
    seenEdgesSet.add(edge);

    if (parentOf.has(child)) continue;

    parentOf.set(child, parent);
    childNodes.add(child);
    allNodes.add(parent);
    allNodes.add(child);

    if (!childrenOf.has(parent)) childrenOf.set(parent, []);
    childrenOf.get(parent)!.push(child);

    if (!nodeIntroOrder.has(parent)) nodeIntroOrder.set(parent, orderIdx++);
    if (!nodeIntroOrder.has(child)) nodeIntroOrder.set(child, orderIdx++);
  }

  const uf = createUnionFind([...allNodes]);
  for (const [child, parent] of parentOf) uf.union(child, parent);

  const componentMap = new Map<string, Set<string>>();
  for (const node of allNodes) {
    const rep = uf.find(node);
    if (!componentMap.has(rep)) componentMap.set(rep, new Set());
    componentMap.get(rep)!.add(node);
  }

  const sortedComponents = [...componentMap.values()].sort((a, b) => {
    const aMin = Math.min(...[...a].map((n) => nodeIntroOrder.get(n) ?? Infinity));
    const bMin = Math.min(...[...b].map((n) => nodeIntroOrder.get(n) ?? Infinity));
    return aMin - bMin;
  });

  const hierarchies = [];

  for (const component of sortedComponents) {
    const componentRoots = [...component]
      .filter((n) => !childNodes.has(n))
      .sort();

    const root =
      componentRoots.length > 0
        ? componentRoots[0]
        : [...component].sort()[0];

    const hasCycle = detectCycle(root, childrenOf, new Set<string>(), new Set<string>());

    if (hasCycle) {
      hierarchies.push({ root, tree: {}, has_cycle: true as const });
    } else {
      const tree = buildTree(root, childrenOf);
      const depth = calcDepth(root, childrenOf);
      hierarchies.push({ root, tree, depth });
    }
  }

  const nonCyclicTrees = hierarchies.filter((h) => !h.has_cycle);
  const totalCycles = hierarchies.length - nonCyclicTrees.length;

  let largestTreeRoot = "";
  let maxDepth = -1;
  for (const h of nonCyclicTrees) {
    const d = h.depth!;
    if (d > maxDepth || (d === maxDepth && h.root < largestTreeRoot)) {
      maxDepth = d;
      largestTreeRoot = h.root;
    }
  }

  return {
    user_id: USER_ID,
    email_id: EMAIL_ID,
    college_roll_number: COLLEGE_ROLL_NUMBER,
    hierarchies,
    invalid_entries: invalidEntries,
    duplicate_edges: duplicateEdges,
    summary: {
      total_trees: nonCyclicTrees.length,
      total_cycles: totalCycles,
      largest_tree_root: largestTreeRoot,
    },
  };
};
