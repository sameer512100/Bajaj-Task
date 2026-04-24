import { useState } from "react";
import { ChevronDown, ChevronRight, Folder, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface TreeNodeProps {
  name: string;
  children?: Record<string, unknown> | null;
  level?: number;
}

export const TreeNode = ({ name, children, level = 0 }: TreeNodeProps) => {
  const [open, setOpen] = useState(true);
  const childEntries = children
    ? Object.entries(children).filter(([, v]) => v !== null && v !== undefined)
    : [];
  const hasChildren = childEntries.length > 0;

  return (
    <div className="animate-fade-in">
      <button
        type="button"
        onClick={() => hasChildren && setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 w-full text-left py-1.5 px-2 rounded-md transition-smooth",
          hasChildren && "hover:bg-accent cursor-pointer",
          !hasChildren && "cursor-default"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          open ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          )
        ) : (
          <span className="w-4 shrink-0" />
        )}
        {hasChildren ? (
          <Folder className="h-4 w-4 text-primary shrink-0" />
        ) : (
          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
        <span className="font-mono text-sm font-medium text-foreground">
          {name}
        </span>
        {hasChildren && (
          <span className="text-xs text-muted-foreground ml-1">
            ({childEntries.length})
          </span>
        )}
      </button>
      {hasChildren && open && (
        <div className="border-l border-border ml-4">
          {childEntries.map(([childName, childTree]) => (
            <TreeNode
              key={childName}
              name={childName}
              children={childTree as Record<string, unknown> | null}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};