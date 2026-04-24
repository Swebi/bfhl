import { useState } from "react";
import type { TreeNode } from "../types/types";

const NODE_BG = [
  "bg-[#2f4d48]",
  "bg-[#3a5c56]",
  "bg-[#456b64]",
  "bg-[#507a72]",
  "bg-[#5c8980]",
  "bg-[#68988e]",
];

const NodeView = ({
  label,
  subtree,
  depth,
}: {
  label: string;
  subtree: TreeNode;
  depth: number;
}) => {
  const [open, setOpen] = useState(true);
  const children = Object.entries(subtree);
  const hasChildren = children.length > 0;
  const colorClass = NODE_BG[depth % NODE_BG.length];

  return (
    <div className={depth > 0 ? "ml-4 sm:ml-5 pl-3 border-l border-line" : ""}>
      <div className="flex flex-wrap items-center gap-2 py-1">
        <button
          type="button"
          onClick={() => hasChildren && setOpen((o) => !o)}
          className={`min-w-[2rem] h-8 px-1.5 rounded-lg flex items-center justify-center font-semibold text-sm text-white select-none transition-all duration-200
            ${colorClass}
            ${
              hasChildren
                ? "cursor-pointer hover:brightness-110 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                : "opacity-70 cursor-default"
            }`}
          title={hasChildren ? (open ? "Collapse" : "Expand") : "Leaf node"}
        >
          {label}
        </button>
        {hasChildren ? (
          <button
            type="button"
            className="text-xs text-mist hover:text-ink transition-colors duration-200 rounded-md px-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
            onClick={() => setOpen((o) => !o)}
          >
            {open
              ? "Hide children"
              : `Show ${children.length} child${children.length > 1 ? "ren" : ""}`}
          </button>
        ) : (
          <span className="text-xs text-mist">Leaf</span>
        )}
      </div>

      {open && hasChildren && (
        <div>
          {children.map(([key, sub]) => (
            <NodeView key={key} label={key} subtree={sub} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const TreeView = ({ tree }: { tree: TreeNode }) => (
  <div className="pt-1">
    {Object.entries(tree).map(([key, sub]) => (
      <NodeView key={key} label={key} subtree={sub} depth={0} />
    ))}
  </div>
);

export default TreeView;
