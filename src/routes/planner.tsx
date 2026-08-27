import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Coffee, Loader2, Pencil, Plus, RefreshCw, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EmptyState, PageHeader, PriorityBadge, ResponsibleAiNotice } from "@/components/common";
import { useAppStore } from "@/lib/app-store";
import { generateSchedule, type ScheduleBlock } from "@/lib/ai-service";
import type { Priority } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — FlowDesk AI" },
      {
        name: "description",
        content: "Add tasks with priority, deadline and duration, then generate a daily or weekly schedule instantly.",
      },
      { property: "og:title", content: "AI Task Planner — FlowDesk AI" },
      { property: "og:description", content: "Generate a logical daily or weekly plan from your task list." },
    ],
  }),
  component: Planner,
});

const emptyForm = { title: "", description: "", priority: "medium" as Priority, deadline: "", duration: "60" };

function Planner() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask, prefs, logActivity } = useAppStore();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<ScheduleBlock[] | null>(null);
  const [loading, setLoading] = useState<"day" | "week" | null>(null);

  const submit = () => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "Task name is required.";
    const dur = Number(form.duration);
    if (!dur || dur < 5) next.duration = "Enter at least 5 minutes.";
    setErrors(next);
    if (Object.keys(next).length) return;

    if (editingId) {
      updateTask(editingId, {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        priority: form.priority,
        deadline: form.deadline || undefined,
        duration: dur,
      });
      toast.success("Task updated");
      setEditingId(null);
    } else {
      addTask({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        priority: form.priority,
        status: "not-started",
        deadline: form.deadline || undefined,
        duration: dur,
      });
      toast.success("Task added to this session");
    }
    setForm({ ...emptyForm, priority: prefs.defaultPriority });
  };

  const run = async (horizon: "day" | "week") => {
    if (tasks.filter((t) => t.status !== "completed").length === 0) {
      toast.error("Add at least one open task before generating a plan.");
      return;
    }
    setLoading(horizon);
    try {
      const blocks = await generateSchedule(tasks, {
        horizon,
        workStart: prefs.workStart,
        workEnd: prefs.workEnd,
      });
      setSchedule(blocks);
      logActivity(horizon === "day" ? "Daily plan generated" : "Weekly plan generated", `${blocks.length} time blocks`);
      toast.success(`${horizon === "day" ? "Daily" : "Weekly"} plan ready`);
    } catch {
      toast.error("Could not generate the plan. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const days = schedule ? [...new Set(schedule.map((b) => b.day))] : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Task Planner"
        description="Capture what needs doing, then let the assistant sequence it by priority, deadline and effort."
        actions={
          <>
            <Button onClick={() => run("day")} disabled={loading !== null} className="rounded-xl bg-accent-gradient">
              {loading === "day" ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1.5 h-4 w-4" />}
              Generate Daily Plan
            </Button>
            <Button onClick={() => run("week")} disabled={loading !== null} variant="outline" className="rounded-xl">
              {loading === "week" ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <CalendarClock className="mr-1.5 h-4 w-4" />}
              Generate Weekly Plan
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <div className="surface-card h-fit p-5">
          <h2 className="text-base font-semibold">{editingId ? "Edit task" : "Add a task"}</h2>
          <p className="mt-1 text-xs text-muted-foreground">No account needed — tasks live in this session only.</p>

          <div className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Task name</Label>
              <Input
                id="title"
                value={form.title}
                placeholder="e.g. Draft the Q3 delivery report"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              {errors.title ? <p className="text-xs text-destructive">{errors.title}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                rows={3}
                value={form.description}
                placeholder="Optional context, dependencies or acceptance criteria…"
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as Priority })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="duration">Estimated duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min={5}
                step={5}
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              />
              {errors.duration ? <p className="text-xs text-destructive">{errors.duration}</p> : null}
            </div>

            <div className="flex gap-2">
              <Button onClick={submit} className="flex-1 rounded-xl">
                <Plus className="mr-1.5 h-4 w-4" /> {editingId ? "Save changes" : "Add task"}
              </Button>
              {editingId ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                >
                  Cancel
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-card p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold">Tasks in this plan</h2>
              <span className="text-xs text-muted-foreground">{tasks.length} total</span>
            </div>

            <ul className="mt-4 divide-y divide-border">
              {tasks.map((task) => (
                <li key={task.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 py-3">
                  <Checkbox
                    checked={task.status === "completed"}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="mt-1"
                    aria-label={`Complete ${task.title}`}
                  />
                  <div className="min-w-0">
                    <p className={cn("truncate text-sm font-medium", task.status === "completed" && "text-muted-foreground line-through")}>
                      {task.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {task.duration} min{task.deadline ? ` · due ${new Date(task.deadline).toLocaleDateString()}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Select value={task.priority} onValueChange={(v) => updateTask(task.id, { priority: v as Priority })}>
                      <SelectTrigger className="h-8 w-[104px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Edit task"
                      onClick={() => {
                        setEditingId(task.id);
                        setForm({
                          title: task.title,
                          description: task.description ?? "",
                          priority: task.priority,
                          deadline: task.deadline ?? "",
                          duration: String(task.duration),
                        });
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" aria-label="Delete task">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this task?</AlertDialogTitle>
                          <AlertDialogDescription>
                            &ldquo;{task.title}&rdquo; will be removed from this session. This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              deleteTask(task.id);
                              toast.success("Task deleted");
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </li>
              ))}
            </ul>

            {tasks.length === 0 ? (
              <EmptyState
                icon={Plus}
                title="No tasks yet"
                description="Add your first task on the left and the assistant will build a schedule around it."
              />
            ) : null}
          </div>

          <div className="surface-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Generated schedule</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Working hours {prefs.workStart}–{prefs.workEnd} · adjust them in Settings.
                </p>
              </div>
              {schedule ? (
                <Button variant="outline" size="sm" onClick={() => run("day")} disabled={loading !== null} className="rounded-lg">
                  <RefreshCw className={cn("mr-1.5 h-3.5 w-3.5", loading && "animate-spin")} /> Regenerate
                </Button>
              ) : null}
            </div>

            {loading ? (
              <div className="mt-6 space-y-3">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
                ))}
              </div>
            ) : !schedule ? (
              <EmptyState
                icon={Sparkles}
                title="No schedule generated yet"
                description="Generate a daily or weekly plan and your tasks will be sequenced into a timeline."
              />
            ) : schedule.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                title="Everything is complete"
                description="There are no open tasks left to schedule. Add a new task to plan again."
              />
            ) : (
              <div className="mt-5 space-y-7">
                {days.map((day) => (
                  <div key={day}>
                    <p className="text-sm font-semibold">{day}</p>
                    <ol className="mt-3 space-y-0">
                      {schedule
                        .filter((b) => b.day === day)
                        .map((block) => (
                          <li key={block.id} className="grid grid-cols-[76px_minmax(0,1fr)] gap-3 sm:grid-cols-[110px_minmax(0,1fr)]">
                            <div className="pt-3 text-xs font-medium text-muted-foreground sm:text-sm">
                              {block.start}
                              <span className="hidden sm:inline"> – {block.end}</span>
                            </div>
                            <div className="relative border-l border-border pb-3 pl-5">
                              <span
                                className={cn(
                                  "absolute -left-[5px] top-4 h-2.5 w-2.5 rounded-full",
                                  block.kind === "break" ? "bg-muted-foreground/50" : "bg-primary",
                                )}
                              />
                              <div className="rounded-xl border border-border bg-soft-gradient p-3.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  {block.kind === "break" ? <Coffee className="h-3.5 w-3.5 text-muted-foreground" /> : null}
                                  <p className="text-sm font-semibold">{block.title}</p>
                                  {block.priority ? <PriorityBadge priority={block.priority} /> : null}
                                  <span className="text-[11px] text-muted-foreground sm:hidden">
                                    until {block.end}
                                  </span>
                                </div>
                                {block.detail ? (
                                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{block.detail}</p>
                                ) : null}
                              </div>
                            </div>
                          </li>
                        ))}
                    </ol>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ResponsibleAiNotice />
    </div>
  );
}
