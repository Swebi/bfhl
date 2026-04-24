export const USER_ID = "suhayb_ahmed";
export const EMAIL_ID = "sa2171@srmist.edu.in";
export const COLLEGE_ROLL_NUMBER = "RA2311032010036";

export type TreeNode = { [key: string]: TreeNode };

export interface HierarchyItem {
  root: string;
  tree: TreeNode;
  depth?: number;
  has_cycle?: true;
}

export interface BfhlResponse {
  user_id: string;
  email_id: string;
  college_roll_number: string;
  hierarchies: HierarchyItem[];
  invalid_entries: string[];
  duplicate_edges: string[];
  summary: {
    total_trees: number;
    total_cycles: number;
    largest_tree_root: string;
  };
}
