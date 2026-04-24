import { useState } from "react";
import type { BfhlResponse } from "./types/types";
import TreeView from "./components/TreeView";
import StatCard from "./components/StatCard";
import Badge from "./components/Badge";
import TagSection from "./components/TagSection";

const EXAMPLE_INPUT =
  "A->B, A->C, B->D, C->E, E->F\nX->Y, Y->Z, Z->X\nP->Q, Q->R\nG->H, G->H, G->I\nhello, 1->2, A->";

const App = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BfhlResponse | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setShowRaw(false);

    const entries = input
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const apiBase = (
      import.meta.env.VITE_API_BASE_URL as string | undefined
    )?.replace(/\/$/, "");
    const bfhlUrl = apiBase ? `${apiBase}/bfhl` : "/bfhl";

    try {
      const res = await fetch(bfhlUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: entries }),
      });
      if (!res.ok) {
        throw new Error(
          `Server returned ${res.status}. Check the API and try again.`
        );
      }
      const data: BfhlResponse = await res.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell font-sans text-ink">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <header className="border-b border-line bg-surface/85 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-mist tracking-wide mb-2">
              BFHL challenge
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-balance text-ink leading-[1.1]">
              Hierarchy visualizer
            </h1>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        className="max-w-6xl mx-auto py-8 sm:py-11 px-4 sm:px-6 space-y-6 sm:space-y-8"
      >
        <section
          aria-labelledby="edges-label"
          className="rounded-2xl border border-line bg-surface p-5 sm:p-7 shadow-lift"
        >
          {loading && (
            <div
              className="h-0.5 -mx-5 sm:-mx-7 -mt-5 sm:-mt-7 mb-5 sm:mb-7 rounded-none bg-line overflow-hidden"
              aria-hidden
            >
              <div className="h-full w-1/3 bg-accent animate-pulse origin-left" />
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <label
              id="edges-label"
              htmlFor="edges-input"
              className="text-sm font-semibold text-ink"
            >
              Node edges
            </label>
            <button
              type="button"
              className="text-sm font-medium text-accent hover:text-accent-hover self-start sm:self-auto transition-colors duration-200 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded-sm focus-visible:outline-accent"
              onClick={() => setInput(EXAMPLE_INPUT)}
            >
              Load sample graph
            </button>
          </div>
          <textarea
            id="edges-input"
            rows={5}
            className="w-full border border-line rounded-xl p-3.5 font-mono text-sm leading-relaxed resize-y min-h-[7.5rem] bg-canvas/50 text-ink placeholder:text-mist/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:border-accent/50 transition-shadow duration-200"
            placeholder={"A->B, A->C, B->D\nX->Y, Y->Z, Z->X\nhello, 1->2"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            aria-busy={loading}
          />
          <div className="mt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-xs text-mist leading-relaxed max-w-content">
              Separate entries with commas or newlines. Direction matters:
              left is parent, right is child.
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
              className="shrink-0 px-6 py-2.5 rounded-xl bg-accent text-surface text-sm font-semibold shadow-lift transition-all duration-200 hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-accent disabled:hover:translate-y-0 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {loading ? "Sending request…" : "Run analysis"}
            </button>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-[#e8d4d2] bg-[#f7efee] px-5 py-4 text-[#5c2e2c] text-sm leading-relaxed"
          >
            <p className="font-semibold text-[#442220] mb-1">Request failed</p>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-6 sm:space-y-8">
            <section
              aria-labelledby="identity-heading"
              className="rounded-2xl border border-line bg-surface p-5 sm:p-7 shadow-lift"
            >
              <h2
                id="identity-heading"
                className="text-sm font-semibold text-ink mb-4"
              >
                Identity
              </h2>
              <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 text-sm">
                {[
                  ["User ID", result.user_id],
                  ["Email", result.email_id],
                  ["Roll number", result.college_roll_number],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs font-medium text-mist mb-1">
                      {label}
                    </p>
                    <p className="font-mono font-medium text-ink tabular-nums break-all">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid sm:grid-cols-3 gap-4">
              <StatCard
                value={result.summary.total_trees}
                label="Trees in the response"
                tone="accent"
              />
              <StatCard
                value={result.summary.total_cycles}
                label="Cycle groups detected"
                tone="danger"
              />
              <StatCard
                value={result.summary.largest_tree_root || "—"}
                label="Largest tree root"
                tone="neutral"
              />
            </div>

            <section aria-labelledby="hierarchies-heading">
              <h2
                id="hierarchies-heading"
                className="text-sm font-semibold text-ink mb-4"
              >
                Hierarchies ({result.hierarchies.length})
              </h2>
              <div className="space-y-4">
                {result.hierarchies.map((h, i) => (
                  <article
                    key={i}
                    className={`rounded-2xl border bg-surface p-5 sm:p-6 shadow-lift transition-shadow duration-200 hover:shadow-lg ${
                      h.has_cycle
                        ? "border-l-[3px] border-l-[#c47a76] border-line"
                        : "border-l-[3px] border-l-accent border-line"
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-1">
                      <div className="flex items-start gap-3 min-w-0">
                        <span
                          className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm tabular-nums shadow-inner
                            ${h.has_cycle ? "bg-[#9c5c59]" : "bg-accent"}`}
                        >
                          {h.root}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-ink text-sm sm:text-base">
                            Root{" "}
                            <span className="font-mono font-medium">
                              {h.root}
                            </span>
                          </p>
                          <p className="text-sm text-mist mt-1 leading-relaxed max-w-content">
                            {h.has_cycle
                              ? "Every node in this group sits on a cycle."
                              : `${h.depth} node${
                                  h.depth !== 1 ? "s" : ""
                                } on the longest path.`}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 items-center sm:justify-end">
                        {h.has_cycle ? (
                          <Badge tone="danger">Cycle</Badge>
                        ) : (
                          <>
                            <Badge tone="accent">Depth {h.depth}</Badge>
                            <Badge tone="ok">Tree</Badge>
                          </>
                        )}
                      </div>
                    </div>

                    {!h.has_cycle && Object.keys(h.tree).length > 0 && (
                      <div className="mt-4 rounded-xl p-4 bg-canvas/60 border border-line/80">
                        <TreeView tree={h.tree} />
                      </div>
                    )}
                    {h.has_cycle && (
                      <p className="text-sm text-mist mt-3 leading-relaxed">
                        Cyclic structure — no tree view for this group.
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>

            <div className="grid md:grid-cols-2 gap-4">
              <TagSection
                title="Invalid entries"
                count={result.invalid_entries.length}
                tags={result.invalid_entries}
                variant="invalid"
                emptyText="None — every token parsed as an edge or was skipped cleanly."
                renderTag={(e) => (e === "" ? '""' : e)}
              />
              <TagSection
                title="Duplicate edges"
                count={result.duplicate_edges.length}
                tags={result.duplicate_edges}
                variant="duplicate"
                emptyText="None — no repeated parent→child pairs in your input."
              />
            </div>

            <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-lift">
              <button
                type="button"
                className="text-sm font-semibold text-mist hover:text-ink transition-colors duration-200 rounded-md px-1 -mx-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                onClick={() => setShowRaw((v) => !v)}
                aria-expanded={showRaw}
              >
                {showRaw ? "Hide raw JSON" : "Show raw JSON"}
              </button>
              {showRaw && (
                <pre className="mt-4 bg-[#1a1f1e] text-[#c9ebd4] text-xs rounded-xl p-4 overflow-auto max-h-96 font-mono leading-relaxed border border-white/5">
                  {JSON.stringify(result, null, 2)}
                </pre>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
