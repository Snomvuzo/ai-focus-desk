import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import type { ActivityItem, Priority, SavedResearch, Task, TaskStatus } from "./types";
import type { AiPreferences, ResponseLength, ResponseStyle } from "./ai-service";

export type ThemeMode = "light" | "dark" | "system";

export interface Preferences extends AiPreferences {
  theme: ThemeMode;
  workStart: string;
  workEnd: string;
  defaultPriority: Priority;
}

const uid = () => Math.random().toString(36).slice(2, 10);

const iso = (daysFromNow: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
};

const seedTasks: Task[] = [
  {
    id: uid(),
    title: "Review project requirements",
    description: "Go through the updated scope document and flag open questions.",
    priority: "high",
    status: "in-progress",
    deadline: iso(0),
    duration: 60,
    createdAt: new Date().toISOString(),
  },
  {
    id: uid(),
    title: "Prepare client presentation",
    description: "Draft the ten-slide narrative for Thursday's review.",
    priority: "high",
    status: "not-started",
    deadline: iso(2),
    duration: 90,
    createdAt: new Date().toISOString(),
  },
  {
    id: uid(),
    title: "Team sync meeting",
    description: "Weekly delivery check-in.",
    priority: "medium",
    status: "not-started",
    deadline: iso(1),
    duration: 30,
    createdAt: new Date().toISOString(),
  },
  {
    id: uid(),
    title: "Update the delivery roadmap",
    priority: "medium",
    status: "in-progress",
    deadline: iso(3),
    duration: 45,
    createdAt: new Date().toISOString(),
  },
  {
    id: uid(),
    title: "Refactor reporting module",
    description: "Reduce duplicated logic in the weekly report builder.",
    priority: "low",
    status: "not-started",
    deadline: iso(6),
    duration: 120,
    createdAt: new Date().toISOString(),
  },
  {
    id: uid(),
    title: "Clear inbox backlog",
    priority: "low",
    status: "not-started",
    duration: 30,
    createdAt: new Date().toISOString(),
  },
  {
    id: uid(),
    title: "Write sprint retrospective notes",
    priority: "medium",
    status: "completed",
    duration: 30,
    createdAt: new Date().toISOString(),
  },
  {
    id: uid(),
    title: "Approve design handoff",
    priority: "high",
    status: "completed",
    duration: 20,
    createdAt: new Date().toISOString(),
  },
];

interface Store {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;

  research: SavedResearch[];
  saveResearch: (item: Omit<SavedResearch, "id" | "savedAt">) => void;
  deleteResearch: (id: string) => void;

  activity: ActivityItem[];
  logActivity: (label: string, detail: string) => void;

  prefs: Preferences;
  setPrefs: (patch: Partial<Preferences>) => void;
}

const AppStoreContext = createContext<Store | null>(null);

const defaultPrefs: Preferences = {
  theme: "light",
  length: "balanced",
  style: "professional",
  behaviour: "Act as a pragmatic workplace assistant. Prefer structure, short paragraphs and concrete next steps.",
  workStart: "09:00",
  workEnd: "17:00",
  defaultPriority: "medium",
};

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [research, setResearch] = useState<SavedResearch[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([
    { id: uid(), label: "Workspace ready", detail: "Demo tasks loaded into session memory", at: new Date().toISOString() },
  ]);
  const [prefs, setPrefsState] = useState<Preferences>(defaultPrefs);

  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const dark =
        prefs.theme === "dark" ||
        (prefs.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.classList.toggle("dark", dark);
    };
    apply();
    if (prefs.theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [prefs.theme]);

  const logActivity = useCallback((label: string, detail: string) => {
    setActivity((prev) => [{ id: uid(), label, detail, at: new Date().toISOString() }, ...prev].slice(0, 12));
  }, []);

  const value = useMemo<Store>(
    () => ({
      tasks,
      addTask: (task) => setTasks((prev) => [{ ...task, id: uid(), createdAt: new Date().toISOString() }, ...prev]),
      updateTask: (id, patch) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t))),
      deleteTask: (id) => setTasks((prev) => prev.filter((t) => t.id !== id)),
      toggleTask: (id) =>
        setTasks((prev) =>
          prev.map((t) =>
            t.id === id
              ? { ...t, status: (t.status === "completed" ? "not-started" : "completed") as TaskStatus }
              : t,
          ),
        ),
      research,
      saveResearch: (item) =>
        setResearch((prev) => [{ ...item, id: uid(), savedAt: new Date().toISOString() }, ...prev]),
      deleteResearch: (id) => setResearch((prev) => prev.filter((r) => r.id !== id)),
      activity,
      logActivity,
      prefs,
      setPrefs: (patch) => setPrefsState((prev) => ({ ...prev, ...patch })),
    }),
    [tasks, research, activity, prefs, logActivity],
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used inside AppStoreProvider");
  return ctx;
}

export type { ResponseLength, ResponseStyle };
