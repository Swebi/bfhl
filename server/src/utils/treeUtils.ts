import { TreeNode } from "../types/types";

export const buildTree = (node: string, childrenOf: Map<string, string[]>): TreeNode => {
  const children = childrenOf.get(node) ?? [];
  const childrenObj: TreeNode = {};
  for (const child of children) {
    Object.assign(childrenObj, buildTree(child, childrenOf));
  }
  return { [node]: childrenObj };
};

export const calcDepth = (node: string, childrenOf: Map<string, string[]>): number => {
  const children = childrenOf.get(node) ?? [];
  if (children.length === 0) return 1;
  return 1 + Math.max(...children.map((c) => calcDepth(c, childrenOf)));
};

export const detectCycle = (
  node: string,
  childrenOf: Map<string, string[]>,
  visited: Set<string>,
  stack: Set<string>
): boolean => {
  visited.add(node);
  stack.add(node);
  for (const child of childrenOf.get(node) ?? []) {
    if (!visited.has(child)) {
      if (detectCycle(child, childrenOf, visited, stack)) return true;
    } else if (stack.has(child)) {
      return true;
    }
  }
  stack.delete(node);
  return false;
};
