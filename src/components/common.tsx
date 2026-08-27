import { AlertTriangle, type LucideIcon } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Priority, TaskStatus } from "@/lib/types";
import { priorityLabel, statusLabel } from "@/lib/types";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 grid grid-cols-[minmax(0,1fr)] gap-4 sm:flex sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold sm:text-[28px]">{title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent font-medium",
        priority === "high" && "bg-destructive/10 text-destructive",
        priority === "medium" && "bg-warning/15 text-warning-foreground dark:text-warning",
        priority === "low" && "bg-primary/10 text-primary",
      )}
    >
      {priorityLabel[priority]}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent font-medium",
        status === "completed" && "bg-success/15 text-success",
        status === "in-progress" && "bg-primary/10 text-primary",
        status === "not-started" && "bg-muted text-muted-foreground",
      )}
    >
      {statusLabel[status]}
    </Badge>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-soft-gradient px-6 py-14 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function AiMarkdown({ content }: { content: string }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed [&_a]:text-primary [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_h3]:text-base [&_h3]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_ol_li]:list-decimal [&_strong]:font-semibold [&_table]:w-full [&_table]:text-left [&_td]:border-t [&_td]:py-1.5 [&_td]:pr-4 [&_th]:pb-1.5 [&_th]:pr-4 [&_th]:text-xs [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-muted-foreground">
      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
    </div>
  );
}

export function ResponsibleAiNotice({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-warning/30 bg-warning/10 p-4", className)}>
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <div className="min-w-0">
          <p className="text-sm font-semibold">Responsible AI</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            AI-generated responses may contain inaccuracies or outdated information. Review and verify important
            information before making professional, financial, legal or business decisions. Avoid entering confidential
            or sensitive company information. This application does not store your information on a server.
          </p>
        </div>
      </div>
    </div>
  );
}

export function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 150, 300].map((d) => (
        <span
          key={d}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/70"
          style={{ animationDelay: `${d}ms` }}
        />
      ))}
    </span>
  );
}
