import { createFileRoute } from "@tanstack/react-router";
import { BookMarked, Check, Copy, FileText, Lightbulb, ListChecks, Loader2, RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState, PageHeader, ResponsibleAiNotice } from "@/components/common";
import { useAppStore } from "@/lib/app-store";
import { deriveTags, runResearch, type ResearchAction, type ResearchResult } from "@/lib/ai-service";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — FlowDesk AI" },
      {
        name: "description",
        content: "Summarise topics, extract key points, generate insights and recommendations — all in the browser.",
      },
      { property: "og:title", content: "AI Research Assistant — FlowDesk AI" },
      { property: "og:description", content: "Paste an article or ask a question and get a structured analysis." },
    ],
  }),
  component: Research,
});

const actions: { id: ResearchAction; label: string }[] = [
  { id: "summarize", label: "Summarize" },
  { id: "key-points", label: "Key Points" },
  { id: "insights", label: "Generate Insights" },
  { id: "recommendations", label: "Recommendations" },
  { id: "explain", label: "Explain Simply" },
  { id: "questions", label: "Generate Questions" },
];

function Research() {
  const { prefs, saveResearch, logActivity } = useAppStore();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [loading, setLoading] = useState<ResearchAction | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const asText = (r: ResearchResult) =>
    [
      r.title,
      "",
      "Summary",
      r.summary,
      "",
      "Key insights",
      ...r.keyPoints.map((p) => `- ${p}`),
      "",
      "Recommendations",
      ...r.recommendations.map((p) => `- ${p}`),
      "",
      "Considerations",
      ...r.considerations.map((p) => `- ${p}`),
    ].join("\n");

  const run = async (action: ResearchAction) => {
    if (input.trim().length < 15) {
      toast.error("Add a bit more detail — at least 15 characters.");
      return;
    }
    setLoading(action);
    setSaved(false);
    try {
      const res = await runResearch(input, action, prefs);
      setResult(res);
      logActivity("Research analysed", `${actions.find((a) => a.id === action)?.label} · ${res.title}`);
    } catch {
      toast.error("The analysis failed. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Research Assistant"
        description="Drop in a topic, question or article and get a structured, decision-ready breakdown."
      />

      <div className="surface-card p-5">
        <Textarea
          rows={7}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a topic, question, or paste an article you'd like me to analyse..."
          className="resize-y text-sm"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {actions.map((a) => (
            <Button
              key={a.id}
              variant={a.id === "summarize" ? "default" : "outline"}
              size="sm"
              className="rounded-xl"
              disabled={loading !== null}
              onClick={() => run(a.id)}
            >
              {loading === a.id ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
              {a.label}
            </Button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          No account required. Your information is processed within this application and is not stored on a server.
        </p>
      </div>

      {loading ? (
        <div className="surface-card space-y-3 p-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-muted" style={{ width: `${90 - i * 9}%` }} />
          ))}
        </div>
      ) : !result ? (
        <EmptyState
          icon={Search}
          title="No analysis yet"
          description="Paste some text above and choose an action — the assistant will return a summary, insights, recommendations and considerations."
        />
      ) : (
        <div className="surface-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold">{result.title}</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {deriveTags(input).map((t) => (
                  <Badge key={t} variant="secondary" className="rounded-md text-[11px]">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="rounded-lg"
                onClick={async () => {
                  await navigator.clipboard.writeText(asText(result));
                  setCopied(true);
                  toast.success("Copied to clipboard");
                  setTimeout(() => setCopied(false), 1800);
                }}
              >
                {copied ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />} Copy
              </Button>
              <Button size="sm" variant="outline" className="rounded-lg" onClick={() => run(result.action)}>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Regenerate
              </Button>
              <Button
                size="sm"
                className="rounded-lg"
                disabled={saved}
                onClick={() => {
                  saveResearch({
                    title: result.title,
                    summary: result.summary,
                    keyPoints: result.keyPoints,
                    recommendations: result.recommendations,
                    considerations: result.considerations,
                    tags: deriveTags(input),
                    source: input,
                  });
                  setSaved(true);
                  toast.success("Saved for this session");
                }}
              >
                <BookMarked className="mr-1.5 h-3.5 w-3.5" /> {saved ? "Saved" : "Save"}
              </Button>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <Section icon={FileText} title="Summary">
              <p className="text-sm leading-relaxed text-muted-foreground">{result.summary}</p>
            </Section>
            <Section icon={Lightbulb} title="Key insights">
              <ul className="space-y-2">
                {result.keyPoints.map((p, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="min-w-0">{p}</span>
                  </li>
                ))}
              </ul>
            </Section>
            <Section icon={ListChecks} title="Recommendations">
              <ol className="space-y-2">
                {result.recommendations.map((p, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-primary/10 text-[11px] font-semibold text-primary">
                      {i + 1}
                    </span>
                    <span className="min-w-0">{p}</span>
                  </li>
                ))}
              </ol>
            </Section>
            <div className="rounded-xl bg-secondary/60 p-4">
              <p className="text-sm font-semibold">Considerations</p>
              <ul className="mt-2 space-y-1.5">
                {result.considerations.map((p, i) => (
                  <li key={i} className="text-xs leading-relaxed text-muted-foreground">
                    • {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <ResponsibleAiNotice />
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof FileText;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2.5 flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-primary" />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}
