export interface UnionFind {
  find: (x: string) => string;
  union: (x: string, y: string) => void;
}

export const createUnionFind = (nodes: string[]): UnionFind => {
  const parent: Record<string, string> = {};
  const rank: Record<string, number> = {};

  for (const n of nodes) {
    parent[n] = n;
    rank[n] = 0;
  }

  const find = (x: string): string => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };

  const union = (x: string, y: string): void => {
    const px = find(x);
    const py = find(y);
    if (px === py) return;
    if (rank[px] < rank[py]) parent[px] = py;
    else if (rank[px] > rank[py]) parent[py] = px;
    else { parent[py] = px; rank[px]++; }
  };

  return { find, union };
};
