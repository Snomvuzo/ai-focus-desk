/**
 * Frontend-only AI service abstraction.
 *
 * Everything here runs in the browser with deterministic, template-driven
 * "demo" intelligence. No network calls, no API keys, no backend.
 * Swapping in a real provider later only requires re-implementing these
 * exported functions.
 */

import type { Task } from "./types";

export type ResponseLength = "short" | "balanced" | "detailed";
export type ResponseStyle = "professional" | "friendly" | "concise";

export interface AiPreferences {
  length: ResponseLength;
  style: ResponseStyle;
  behaviour: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const simulateLatency = (base = 700) => delay(base + Math.random() * 700);

/* ------------------------------------------------------------------ */
/* Scheduling                                                          */
/* ------------------------------------------------------------------ */

export interface ScheduleBlock {
  id: string;
  day: string;
  start: string;
  end: string;
  title: string;
  detail?: string;
  kind: "task" | "break" | "focus" | "admin";
  taskId?: string;
  priority?: Task["priority"];
}

const priorityWeight: Record<Task["priority"], number> = { high: 0, medium: 1, low: 2 };

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const toTime = (mins: number) => {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const sortTasks = (tasks: Task[]) =>
  [...tasks].sort((a, b) => {
    const p = priorityWeight[a.priority] - priorityWeight[b.priority];
    if (p !== 0) return p;
    const da = a.deadline ? new Date(a.deadline).getTime() : Number.MAX_SAFE_INTEGER;
    const db = b.deadline ? new Date(b.deadline).getTime() : Number.MAX_SAFE_INTEGER;
    if (da !== db) return da - db;
    return a.duration - b.duration;
  });

const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

interface PlanOptions {
  workStart: string;
  workEnd: string;
  horizon: "day" | "week";
}

export async function generateSchedule(tasks: Task[], options: PlanOptions): Promise<ScheduleBlock[]> {
  await simulateLatency(900);

  const pending = sortTasks(tasks.filter((t) => t.status !== "completed"));
  if (pending.length === 0) return [];

  const days = options.horizon === "day" ? ["Today"] : dayLabels;
  const blocks: ScheduleBlock[] = [];
  const startMin = toMinutes(options.workStart);
  const endMin = toMinutes(options.workEnd);

  let dayIndex = 0;
  let cursor = startMin;
  let sinceBreak = 0;
  let lunchDone = false;

  const pushBreak = (label: string, length: number, kind: ScheduleBlock["kind"]) => {
    if (cursor + length > endMin) return;
    blocks.push({
      id: `${dayIndex}-${cursor}-break`,
      day: days[dayIndex],
      start: toTime(cursor),
      end: toTime(cursor + length),
      title: label,
      kind,
      detail: "Protected recovery time keeps focus quality high.",
    });
    cursor += length;
    sinceBreak = 0;
  };

  for (const task of pending) {
    const length = Math.max(15, Math.min(task.duration, 180));

    if (!lunchDone && cursor >= 12 * 60 && dayIndex < days.length) {
      pushBreak("Lunch break", 60, "break");
      lunchDone = true;
    }

    if (sinceBreak >= 120) pushBreak("Short reset break", 15, "break");

    if (cursor + length > endMin) {
      dayIndex += 1;
      if (dayIndex >= days.length) break;
      cursor = startMin;
      sinceBreak = 0;
      lunchDone = false;
    }

    blocks.push({
      id: `${dayIndex}-${cursor}-${task.id}`,
      day: days[dayIndex],
      start: toTime(cursor),
      end: toTime(cursor + length),
      title: task.title,
      detail:
        task.description ||
        (task.deadline
          ? `Scheduled early because it is due ${new Date(task.deadline).toLocaleDateString()}.`
          : "Sequenced by priority and estimated effort."),
      kind: task.priority === "high" ? "focus" : "task",
      taskId: task.id,
      priority: task.priority,
    });

    cursor += length;
    sinceBreak += length;
  }

  if (blocks.length && cursor + 30 <= endMin) {
    blocks.push({
      id: `${dayIndex}-${cursor}-wrap`,
      day: days[Math.min(dayIndex, days.length - 1)],
      start: toTime(cursor),
      end: toTime(cursor + 30),
      title: "Wrap-up & inbox triage",
      kind: "admin",
      detail: "Close loops, update statuses and prepare tomorrow's top three.",
    });
  }

  return blocks;
}

/* ------------------------------------------------------------------ */
/* Research                                                            */
/* ------------------------------------------------------------------ */

export type ResearchAction =
  | "summarize"
  | "key-points"
  | "insights"
  | "recommendations"
  | "explain"
  | "questions";

export interface ResearchResult {
  action: ResearchAction;
  title: string;
  summary: string;
  keyPoints: string[];
  recommendations: string[];
  considerations: string[];
}

const sentencesOf = (text: string) =>
  text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 12);

const keywordsOf = (text: string) => {
  const stop = new Set(
    "the a an and or of to in for on with is are was were be been that this it as at by from about into how what why we you your our their can will should would could".split(
      " ",
    ),
  );
  const counts = new Map<string, number>();
  for (const raw of text.toLowerCase().match(/[a-z][a-z'-]{2,}/g) ?? []) {
    if (stop.has(raw)) continue;
    counts.set(raw, (counts.get(raw) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([w]) => w);
};

const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export function deriveTitle(input: string) {
  const first = sentencesOf(input)[0] ?? input;
  const trimmed = first.length > 68 ? `${first.slice(0, 65).trim()}…` : first;
  return titleCase(trimmed.replace(/[.?!]$/, ""));
}

export function deriveTags(input: string) {
  return keywordsOf(input).slice(0, 4).map(titleCase);
}

export async function runResearch(input: string, action: ResearchAction, prefs: AiPreferences): Promise<ResearchResult> {
  await simulateLatency(1000);

  const sentences = sentencesOf(input);
  const keywords = keywordsOf(input);
  const topic = keywords.slice(0, 3).join(", ") || "the submitted material";
  const depth = prefs.length === "short" ? 2 : prefs.length === "detailed" ? 5 : 3;
  const opener =
    prefs.style === "friendly"
      ? "Here's what stands out"
      : prefs.style === "concise"
        ? "Bottom line"
        : "Analysis summary";

  const base = sentences.length
    ? sentences.slice(0, depth).join(" ")
    : `The material centres on ${topic}. There is enough signal to act on, but the source detail is limited, so treat the output as a starting framework rather than a conclusion.`;

  const actionSummary: Record<ResearchAction, string> = {
    summarize: `${opener}: ${base}`,
    "key-points": `${opener}: the material can be reduced to a handful of decision-relevant points centred on ${topic}.`,
    insights: `${opener}: beyond the surface content, ${topic} points to shifts worth planning around over the next quarter.`,
    recommendations: `${opener}: the practical next steps below convert ${topic} into work you can schedule this week.`,
    explain: `In plain language: ${base} Put simply, ${topic} matters because it changes how the work gets prioritised day to day.`,
    questions: `${opener}: the strongest way forward is to interrogate ${topic} with the questions below before committing resources.`,
  };

  const genericPoints = [
    `${titleCase(keywords[0] ?? "The core theme")} is the anchor concept and drives most of the downstream implications.`,
    `Impact is concentrated in a small number of workflows rather than spread evenly across the organisation.`,
    `Timelines matter more than scope — a smaller change delivered early outperforms a broad change delivered late.`,
    `Measurement is currently the weakest link; without a baseline, improvement claims cannot be verified.`,
    `Stakeholder alignment is a prerequisite, not a follow-up activity.`,
  ];

  const keyPoints =
    action === "questions"
      ? [
          `What outcome would prove ${keywords[0] ?? "this"} was worth the investment?`,
          "Which assumption, if wrong, breaks the whole approach?",
          "Who owns the decision, and what do they need to see?",
          "What is the smallest test that would produce real evidence?",
          "What does doing nothing cost over the next two quarters?",
        ].slice(0, depth + 1)
      : (sentences.length > 1 ? sentences.slice(0, depth + 1).map((s) => s) : genericPoints).slice(0, depth + 1);

  const recommendations = [
    `Define one measurable objective for ${topic} and review it weekly.`,
    "Run a two-week pilot with a single team before scaling anything.",
    "Document assumptions explicitly so they can be challenged later.",
    "Assign a named owner and a decision date to avoid drift.",
    "Schedule a short retrospective to capture what the pilot actually proved.",
  ].slice(0, depth);

  const considerations = [
    "This analysis is generated from the text provided only — no external sources were consulted.",
    "Figures, dates and claims in the source have not been independently verified.",
    "Context specific to your organisation, contracts or jurisdiction may change the conclusions.",
    "Treat as decision support, not professional, legal or financial advice.",
  ].slice(0, prefs.length === "short" ? 2 : 4);

  return {
    action,
    title: deriveTitle(input),
    summary: actionSummary[action],
    keyPoints,
    recommendations,
    considerations,
  };
}

/* ------------------------------------------------------------------ */
/* Assistant chat                                                      */
/* ------------------------------------------------------------------ */

export type Intent = "plan" | "prioritise" | "summary" | "meeting" | "project" | "email" | "general";

export function detectIntent(message: string): Intent {
  const m = message.toLowerCase();
  if (/(plan (my )?day|schedule|time.?block|plan my week)/.test(m)) return "plan";
  if (/(priorit|urgent|what should i do first)/.test(m)) return "prioritise";
  if (/(summar|tl;?dr|recap)/.test(m)) return "summary";
  if (/(meeting|standup|agenda|1:1)/.test(m)) return "meeting";
  if (/(project plan|roadmap|milestone|deliverab)/.test(m)) return "project";
  if (/(email|write to|draft a message|follow.?up note)/.test(m)) return "email";
  return "general";
}

export async function respondToChat(message: string, tasks: Task[], prefs: AiPreferences): Promise<string> {
  await simulateLatency(800);

  const intent = detectIntent(message);
  const open = tasks.filter((t) => t.status !== "completed");
  const high = open.filter((t) => t.priority === "high");
  const taskLine = open.length
    ? `You currently have ${open.length} open task${open.length === 1 ? "" : "s"}${high.length ? `, ${high.length} of them high priority` : ""}.`
    : "You have no open tasks in the workspace yet — add a few in Task Planner and I can build a real schedule around them.";

  const sign =
    prefs.style === "friendly" ? "\n\nWant me to turn any of this into tasks? 🙂" : "\n\nSay the word and I'll expand any section.";

  const templates: Record<Intent, string> = {
    plan: `### Suggested plan for today\n\n${taskLine}\n\n| Time | Focus |\n| --- | --- |\n| 09:00 – 10:30 | Deep work on your highest-priority item${high[0] ? `: **${high[0].title}**` : ""} |\n| 10:30 – 10:45 | Reset break |\n| 10:45 – 12:00 | Second priority block |\n| 12:00 – 13:00 | Lunch |\n| 13:00 – 14:30 | Collaboration, reviews and meetings |\n| 14:30 – 16:00 | Third priority block |\n| 16:00 – 16:30 | Wrap-up, inbox triage, plan tomorrow |\n\n**Why this shape:** cognitively demanding work sits before lunch, meetings cluster in the afternoon, and the final block protects tomorrow's start.`,
    prioritise: `### Prioritisation\n\n${taskLine}\n\n1. **Do first** — high urgency *and* high importance. ${high[0] ? `Right now that's **${high[0].title}**.` : "Nothing currently qualifies."}\n2. **Schedule** — important but not urgent. Give these a fixed slot or they will never happen.\n3. **Delegate or batch** — urgent but low value. Group them into one 30-minute window.\n4. **Drop** — neither urgent nor important. Removing these is a productivity gain, not a failure.\n\nA useful test: if you finished only one task today, which one would make the day worthwhile?`,
    summary: `### Structured summary\n\n**Overview** — The material you shared can be condensed into a short set of decision-relevant points.\n\n**Key points**\n- The central theme drives most downstream implications.\n- Impact concentrates in a few workflows rather than everywhere.\n- Timing matters more than scope.\n\n**Suggested next step** — Convert the single most actionable point into a task with an owner and a date.\n\nFor longer documents, paste the full text into **Research Assistant** for a deeper structured breakdown.`,
    meeting: `### Meeting preparation\n\n**Before**\n- Write the one decision the meeting must produce.\n- Share an agenda with time boxes and pre-reading.\n- Note the two questions you most need answered.\n\n**During**\n- Open with the outcome, not the background.\n- Capture decisions and owners live, not afterwards.\n- Reserve the last five minutes for next steps.\n\n**After**\n- Send a short recap: decisions, owners, dates.\n- Turn each action item into a task with a deadline.`,
    project: `### Project plan outline\n\n**Phase 1 — Define (week 1)**\nScope, success metrics, stakeholders, constraints.\n\n**Phase 2 — Design (weeks 2–3)**\nApproach, dependencies, risk register, resourcing.\n\n**Phase 3 — Build (weeks 4–7)**\nWeekly increments with a demo at the end of each week.\n\n**Phase 4 — Validate (week 8)**\nTesting, stakeholder review, sign-off criteria.\n\n**Phase 5 — Launch & review (week 9)**\nRollout, comms, retrospective against the original metrics.\n\nEach phase should have one owner and one visible deliverable.`,
    email: `### Draft email\n\n**Subject:** Quick update and next steps\n\nHi [Name],\n\nThanks for your time earlier. To recap where we landed: [one-sentence summary of the decision or context].\n\nNext steps from our side:\n1. [Action] — owner, by [date]\n2. [Action] — owner, by [date]\n\nIf anything above looks off, let me know before [date] and I'll adjust. Otherwise we'll proceed as described.\n\nBest regards,\n[Your name]\n\n*Tone can be made warmer or more formal — just ask.*`,
    general: `Here's how I'd approach that.\n\n**1. Clarify the outcome.** State what "done" looks like in one sentence — it makes the rest of the decisions easier.\n\n**2. Reduce the scope.** Find the smallest version that still produces real evidence or value.\n\n**3. Sequence the work.** ${taskLine}\n\n**4. Set a review point.** A short checkpoint beats a long plan that nobody revisits.\n\nIf you tell me more about the constraints — deadline, people involved, budget — I can make this a lot more specific.`,
  };

  let body = templates[intent];
  if (prefs.length === "short") body = body.split("\n\n").slice(0, 3).join("\n\n");
  return body + (prefs.length === "detailed" ? sign : "");
}

export const suggestedPrompts = [
  "Help me plan my day",
  "Prioritise my tasks",
  "Summarise this information",
  "Help me prepare for a meeting",
  "Create a project plan",
  "Write a professional email",
];
