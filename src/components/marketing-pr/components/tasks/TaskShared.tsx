import type { ReactNode } from 'react';
import { Clock, Target, SearchCheck, FileCheck2, CheckCircle2 } from 'lucide-react';
import type { BadgeVariant } from '@/components/marketing-pr/components/ui/Badge';
import type { Role, Task, TaskCategory, TaskRequestStatus, TaskStatus, TaskTeam } from '@/components/marketing-pr/types';

export const TEAMS: TaskTeam[] = [
  'Digital Marketing Executive',
  'Content & Brand Team',
  'Events & Outreach Coordinator',
];

export const TASK_STATUSES: TaskStatus[] = [
  'Created',
  'Assigned',
  'In Progress',
  'Submitted',
  'Under Review',
  'Changes Required',
  'Completed',
  'Overdue',
];

export const TASK_CATEGORIES: TaskCategory[] = [
  'Website', 'Social Media', 'SEO', 'Ad Campaigns',
  'Prospectus', 'Brochures', 'Newsletters',
  'Education Fairs', 'School Partnerships', 'Open Days',
];

export const TEAM_CATEGORIES: Record<string, TaskCategory[]> = {
  'Digital Marketing Executive': ['Website', 'Social Media', 'SEO', 'Ad Campaigns'],
  'Content & Brand Team': ['Prospectus', 'Brochures', 'Newsletters'],
  'Content / Brand Team': ['Prospectus', 'Brochures', 'Newsletters'],
  'Events & Outreach Coordinator': ['Education Fairs', 'School Partnerships', 'Open Days'],
};

export function normalizeTaskTeam(team: TaskTeam): TaskTeam {
  return team === 'Content / Brand Team' ? 'Content & Brand Team' : team;
}

export function getTaskCategory(task: Task): TaskCategory {
  if (task.category) return task.category;
  const text = `${task.title} ${task.description}`.toLowerCase();
  const team = normalizeTaskTeam(task.assignedTeam);
  if (team === 'Digital Marketing Executive') {
    if (/seo|keyword|search visibility/.test(text)) return 'SEO';
    if (/website|webpage|page update|site content/.test(text)) return 'Website';
    if (/social media|instagram|facebook|linkedin|post/.test(text)) return 'Social Media';
    return 'Ad Campaigns';
  }
  if (team === 'Content & Brand Team') {
    if (/prospectus/.test(text)) return 'Prospectus';
    if (/newsletter/.test(text)) return 'Newsletters';
    return 'Brochures';
  }
  if (/fair/.test(text)) return 'Education Fairs';
  if (/school|partnership/.test(text)) return 'School Partnerships';
  return 'Open Days';
}

export function taskWorkflowStatus(status: TaskStatus): TaskStatus {
  if (status === 'Submitted for Review' || status === 'Under Review') return 'Submitted';
  if (status === 'Changes Requested') return 'Changes Required';
  if (status === 'New') return 'Created';
  return status;
}

export function requestStatusFromTask(status: TaskStatus): TaskRequestStatus {
  const normalized = taskWorkflowStatus(status);
  if (normalized === 'Submitted') return 'Submitted';
  if (normalized === 'Changes Required') return 'Changes Required';
  if (normalized === 'Completed') return 'Completed';
  if (normalized === 'In Progress') return 'In Progress';
  return 'Accepted';
}

export function taskDisplayStatus(task: { status: TaskStatus; dueDate: string }): TaskStatus {
  if (task.status === 'Completed') return 'Completed';
  const today = nowStamp().slice(0, 10);
  if (task.dueDate && task.dueDate < today) return 'Overdue';
  return taskWorkflowStatus(task.status);
}

export const TEAM_ROLE: Partial<Record<TaskTeam, Role>> = {
  'Digital Marketing Executive': 'digital',
  'Content & Brand Team': 'content',
  'Content / Brand Team': 'content',
  'Events & Outreach Coordinator': 'events',
};

export function taskStatusVariant(status: TaskStatus): BadgeVariant {
  switch (status) {
    case 'Assigned':
    case 'Created':
    case 'New':
      return 'amber';
    case 'In Progress':
      return 'blue';
    case 'Submitted for Review':
    case 'Submitted':
    case 'Under Review':
      return 'indigo';
    case 'Changes Requested':
    case 'Changes Required':
      return 'red';
    case 'Completed':
      return 'green';
    case 'Overdue':
      return 'red';
    default:
      return 'slate';
  }
}

export function nowStamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const STEP_ICONS: Record<TaskStatus, ReactNode> = {
  Created: <Clock size={13} />,
  New: <Clock size={13} />,
  'Assigned': <Clock size={13} />,
  'In Progress': <Target size={13} />,
  'Submitted for Review': <SearchCheck size={13} />,
  Submitted: <SearchCheck size={13} />,
  'Under Review': <SearchCheck size={13} />,
  'Changes Requested': <FileCheck2 size={13} />,
  'Changes Required': <FileCheck2 size={13} />,
  'Completed': <CheckCircle2 size={13} />,
  Overdue: <Clock size={13} />,
};

const STEP_LABELS: Record<TaskStatus, string> = {
  Created: 'Created',
  New: 'New',
  'Assigned': 'Assigned',
  'In Progress': 'In Progress',
  'Submitted for Review': 'Submitted',
  Submitted: 'Submitted',
  'Under Review': 'Under Review',
  'Changes Requested': 'Changes Required',
  'Changes Required': 'Changes Required',
  'Completed': 'Completed',
  Overdue: 'Overdue',
};

export function TaskWorkflowStepper({ status }: { status: TaskStatus }) {
  const steps: TaskStatus[] = ['Created', 'Assigned', 'In Progress', 'Submitted', 'Changes Required', 'Completed'];
  const normalized = taskWorkflowStatus(status);
  const currentIndex = steps.indexOf(normalized);
  return (
    <div className="flex items-center flex-wrap gap-y-2">
      {steps.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isChanges = step === 'Changes Required' && isCurrent;
        const cls = isChanges
          ? 'bg-red-50 text-red-600 ring-1 ring-red-200'
          : isCurrent
            ? step === 'Completed'
              ? 'bg-emerald-600 text-white'
              : 'bg-blue-600 text-white'
            : isDone
              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
              : 'bg-slate-100 text-slate-400';
        return (
          <div key={step} className="flex items-center">
            {i > 0 && (
              <div className={`h-0.5 w-4 sm:w-6 flex-shrink-0 ${i <= currentIndex ? 'bg-emerald-400' : 'bg-slate-200'}`} />
            )}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${cls}`}>
              {STEP_ICONS[step]}
              {STEP_LABELS[step]}
            </div>
          </div>
        );
      })}
    </div>
  );
}