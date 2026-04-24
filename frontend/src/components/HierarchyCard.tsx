import { AlertTriangle, GitBranch, Layers } from "lucide-react";
import type { Hierarchy } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TreeNode } from "./TreeNode";

interface Props {
  hierarchy: Hierarchy;
  index: number;
}

export const HierarchyCard = ({ hierarchy, index }: Props) => {
  const { root, tree, depth, has_cycle } = hierarchy;

  return (
    <Card
      className="p-5 shadow-[var(--shadow-card)] border-border/60 animate-scale-in transition-smooth hover:shadow-[var(--shadow-glow)]"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground">
            <GitBranch className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Root
            </p>
            <p className="font-mono font-bold text-lg text-foreground">{root}</p>
          </div>
        </div>
        {!has_cycle && typeof depth === "number" && (
          <Badge variant="secondary" className="gap-1">
            <Layers className="h-3 w-3" />
            Depth {depth}
          </Badge>
        )}
      </div>

      {has_cycle ? (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-medium">Cycle detected</span>
        </div>
      ) : (
        <div className="rounded-lg bg-muted/40 border border-border/60 p-2 max-h-[400px] overflow-auto">
          <TreeNode
            name={root}
            children={tree as Record<string, unknown> | null}
          />
        </div>
      )}
    </Card>
  );
};