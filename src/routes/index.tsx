import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock,
  Gauge,
  Search,
  Sparkles,
  Timer,
  Zap,
} from "lucide-react";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PriorityBadge, ResponsibleAiNotice } from "@/components/common";
import { useAppStore } from "@/lib/app-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — FlowDesk AI Workplace Assistant" },
      {
        name: "description",
        content:
          "See today's tasks, your productivity score, upcoming work and recent AI activity in one browser-only workspace.",
      },
      { property: "og:title", content: "Dashboard — FlowDesk AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Today's tasks, productivity score and quick AI actions — no account required.",
      },
    ],
  }),
  component: Dashboard,
});

const quickActions = [
  { label: "Plan My Day", to: "/planner", icon: CalendarDays, hint: "Turn your task list into a timed schedule" },
  { label: "Create Weekly Schedule", to: "/planner", icon: Timer, hint: "Spread work across the working week" },
  { label: "Research a Topic", to: "/research", icon: Search, hint: "Summarise, analyse and extract insights" },
  { label: "Ask AI", to: "/assistant", icon: Bot, hint: "Chat with your workplace assistant" },
] as const;

function Dashboard() {
  const { tasks, activity } = useAppStore();

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.status === "completed").length;
    const inProgress = tasks.filter((t) => t.status === "in-progress").length;
    const pending = tasks.filter((t) => t.status === "not-started").length;
    const score = tasks.length ? Math.round(((completed + inProgress * 0.5) / tasks.length) * 100) : 0;
    return { total: tasks.length, completed, inProgress, pending, score };
  }, [tasks]);

  const upcoming = useMemo(
    () =>
      tasks
        .filter((t) => t.status !== "completed")
        .sort((a, b) => (a.deadline ?? "9999").localeCompare(b.deadline ?? "9999"))
        .slice(0, 4),
    [tasks],
  );

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl bg-hero-gradient p-7 shadow-[var(--shadow-float)] sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative max-w-2xl">
          <Badge className="mb-5 gap-1.5 border-white/25 bg-white/15 text-primary-foreground hover:bg-white/20">
            <Sparkles className="h-3.5 w-3.5" /> Powered by AI
          </Badge>
          <h1 className="text-3xl font-bold text-primary-foreground sm:text-[42px] sm:leading-[1.08]">
            {greeting} 👋
          </h1>
          <p className="mt-3 text-base text-primary-foreground/80 sm:text-lg">
            Let&apos;s make today productive. Plan your work, research faster and get AI support — entirely in your
            browser.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-primary-foreground/90">
            <CalendarDays className="h-3.5 w-3.5" /> {today}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-xl bg-accent-gradient shadow-[var(--shadow-float)]">
              <Link to="/planner">
                Plan my day <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-xl border-white/25 bg-white/10 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground"
            >
              <Link to="/assistant">Open AI Chat</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="surface-card p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Today&apos;s Tasks</p>
              <p className="text-2xl font-bold">{stats.total} Total</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { label: "Completed", value: stats.completed },
              { label: "In Progress", value: stats.inProgress },
              { label: "Pending", value: stats.pending },
            ].map((s) => (
              <div key={s.label} className="rounded-lg bg-secondary/70 px-2 py-2">
                <p className="text-lg font-semibold">{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-success/15">
              <Gauge className="h-5 w-5 text-success" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Productivity Score</p>
              <p className="text-2xl font-bold">{stats.score}%</p>
            </div>
          </div>
          <Progress value={stats.score} className="mt-5 h-2" />
          <p className="mt-3 text-xs text-muted-foreground">
            Based on completed and in-progress work in this session.
          </p>
        </div>

        <div className="surface-card p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Upcoming</p>
          </div>
          <ul className="mt-4 space-y-2.5">
            {upcoming.length === 0 ? (
              <li className="text-sm text-muted-foreground">Nothing scheduled — you&apos;re clear.</li>
            ) : (
              upcoming.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-2">
                  <span className="min-w-0 truncate text-sm">{t.title}</span>
                  <PriorityBadge priority={t.priority} />
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="surface-card p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">AI Activity</p>
          </div>
          <ul className="mt-4 space-y-3">
            {activity.slice(0, 3).map((a) => (
              <li key={a.id}>
                <p className="truncate text-sm font-medium">{a.label}</p>
                <p className="truncate text-xs text-muted-foreground">{a.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Quick actions</h2>
        <p className="mt-1 text-sm text-muted-foreground">Pick a tool to get started.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map(({ label, to, icon: Icon, hint }) => (
            <Link
              key={label}
              to={to}
              className="surface-card group p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent-gradient">
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <p className="mt-4 font-semibold">{label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open tool <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <ResponsibleAiNotice />
    </div>
  );
}
