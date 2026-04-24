import { useState } from "react";
import {
  Loader2,
  Send,
  Mail,
  User,
  Hash,
  Copy,
  Check,
  Network,
  AlertOctagon,
  Repeat,
  TrendingUp,
  FlaskConical,
  TreePine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { postBfhl, parseInput, type BfhlResponse } from "@/lib/api";
import { HierarchyCard } from "@/components/HierarchyCard";

const SAMPLE = "A->B, A->C, B->D, B->E, C->F, X->Y, Y->Z, Z->X";

const Index = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BfhlResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    const data = parseInput(input);
    if (data.length === 0) {
      toast({
        title: "Input required",
        description: "Please enter at least one edge (e.g. A->B).",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await postBfhl(data);
      setResult(res);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError(message);
      toast({
        title: "Request failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-clip">
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-grid absolute inset-0 opacity-40" />
        <div className="hero-blob hero-blob-one" />
        <div className="hero-blob hero-blob-two" />
      </div>

      <div className="container max-w-6xl py-10 md:py-14 px-4 relative z-10">
        {/* Header */}
        <header className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4 border border-border/60">
            <Network className="h-3.5 w-3.5" />
            Data Structures Visual Lab
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight hero-title">
            BFHL Hierarchy Visualizer
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-sm md:text-base">
            Submit edge pairs, inspect generated trees, and quickly identify cycles,
            duplicates, and invalid entries in one place.
          </p>
        </header>

        {/* Input Card */}
        <Card className="p-6 md:p-8 border-border/70 glass-panel animate-scale-in">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <label className="text-sm font-semibold text-foreground">
              Edges Input
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setInput(SAMPLE)}
              className="text-xs gap-1.5 h-8"
            >
              <FlaskConical className="h-3.5 w-3.5" />
              Load sample
            </Button>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="A->B, A->C, B->D or one edge per line"
            rows={6}
            className="font-mono text-sm resize-none border-border/80 bg-card/80"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Use comma or newline separated edges. Format: Parent-&gt;Child
          </p>

          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Analyze Graph
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Error */}
        {error && !loading && (
          <Card className="mt-6 p-4 border-destructive/30 bg-destructive/5 text-destructive flex items-start gap-3 animate-fade-in">
            <AlertOctagon className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Could not reach the API</p>
              <p className="text-sm opacity-90 break-all">{error}</p>
            </div>
          </Card>
        )}

        {/* Results */}
        {result && (
          <div className="mt-10 space-y-8">
            {/* User Info + Summary */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 border-border/70 glass-panel animate-fade-in">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  User Info
                </h2>
                <div className="space-y-3">
                  <InfoRow icon={<User className="h-4 w-4" />} label="User ID" value={result.user_id} />
                  <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={result.email_id} />
                  <InfoRow icon={<Hash className="h-4 w-4" />} label="Roll Number" value={result.college_roll_number} />
                </div>
              </Card>

              <Card className="p-6 border-border/70 glass-panel animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Summary
                  </h2>
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy JSON
                      </>
                    )}
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <StatBox
                    icon={<TreePine className="h-4 w-4" />}
                    label="Trees"
                    value={result.summary.total_trees}
                  />
                  <StatBox
                    icon={<Repeat className="h-4 w-4" />}
                    label="Cycles"
                    value={result.summary.total_cycles}
                    accent={result.summary.total_cycles > 0 ? "destructive" : undefined}
                  />
                  <StatBox
                    icon={<TrendingUp className="h-4 w-4" />}
                    label="Largest"
                    value={result.summary.largest_tree_root || "-"}
                    mono
                  />
                </div>
              </Card>
            </div>

            {/* Hierarchies */}
            {result.hierarchies?.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <TreePine className="h-5 w-5 text-primary" />
                  Hierarchies
                  <Badge variant="secondary" className="ml-1">
                    {result.hierarchies.length}
                  </Badge>
                </h2>
                <div className="grid md:grid-cols-2 gap-5">
                  {result.hierarchies.map((h, i) => (
                    <HierarchyCard key={`${h.root}-${i}`} hierarchy={h} index={i} />
                  ))}
                </div>
              </section>
            )}

            {/* Invalid + Duplicates */}
            {(result.invalid_entries?.length > 0 ||
              result.duplicate_edges?.length > 0) && (
              <div className="grid md:grid-cols-2 gap-6">
                {result.invalid_entries?.length > 0 && (
                  <Card className="p-5 border-border/70 glass-panel animate-fade-in">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-destructive">
                      <AlertOctagon className="h-4 w-4" />
                      Invalid Entries
                      <span className="text-muted-foreground font-normal">
                        ({result.invalid_entries.length})
                      </span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.invalid_entries.map((e, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md bg-destructive/10 text-destructive text-xs font-mono border border-destructive/20"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  </Card>
                )}

                {result.duplicate_edges?.length > 0 && (
                  <Card className="p-5 border-border/70 glass-panel animate-fade-in">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-warning">
                      <Repeat className="h-4 w-4" />
                      Duplicate Edges
                      <span className="text-muted-foreground font-normal">
                        ({result.duplicate_edges.length})
                      </span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.duplicate_edges.map((e, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md bg-warning/10 text-warning text-xs font-mono border border-warning/20"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        <footer className="mt-14 text-center text-xs text-muted-foreground tracking-wide">
          Built for the SRM Full Stack Engineering Challenge
        </footer>
      </div>
    </div>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3">
    <div className="p-2 rounded-md bg-accent text-accent-foreground mt-0.5 border border-border/60">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-mono text-sm font-medium text-foreground break-all">
        {value || "-"}
      </p>
    </div>
  </div>
);

const StatBox = ({
  icon,
  label,
  value,
  accent,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: "destructive";
  mono?: boolean;
}) => (
  <div
    className={`rounded-lg p-3 border transition-smooth ${
      accent === "destructive"
        ? "bg-destructive/10 border-destructive/20 text-destructive"
        : "bg-accent border-border/40 text-accent-foreground"
    }`}
  >
    <div className="flex items-center gap-1.5 text-xs opacity-80">
      {icon}
      {label}
    </div>
    <p
      className={`mt-1 font-bold text-xl truncate ${mono ? "font-mono text-base" : ""}`}
    >
      {value}
    </p>
  </div>
);

export default Index;
