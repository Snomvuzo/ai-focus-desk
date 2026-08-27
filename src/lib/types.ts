export type Priority = "high" | "medium" | "low";
export type TaskStatus = "not-started" | "in-progress" | "completed";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  deadline?: string;
  /** estimated duration in minutes */
  duration: number;
  createdAt: string;
}

export interface SavedResearch {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  recommendations: string[];
  considerations: string[];
  tags: string[];
  savedAt: string;
  source: string;
}

export interface ActivityItem {
  id: string;
  label: string;
  detail: string;
  at: string;
}

export const priorityLabel: Record<Priority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const statusLabel: Record<TaskStatus, string> = {
  "not-started": "Not Started",
  "in-progress": "In Progress",
  completed: "Completed",
};
