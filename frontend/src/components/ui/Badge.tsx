import type { ReactNode } from 'react';
import type { TaskStatus, TaskPriority } from '@/types';

const statusConfig: Record<TaskStatus, { label: string; classes: string }> = {
  TODO: {
    label: 'Todo',
    classes: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    classes: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
  },
  DONE: {
    label: 'Done',
    classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  },
};

const priorityConfig: Record<TaskPriority, { label: string; classes: string }> = {
  LOW: {
    label: 'Low',
    classes: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  },
  MEDIUM: {
    label: 'Medium',
    classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  },
  HIGH: {
    label: 'High',
    classes: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const cfg = priorityConfig[priority];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

export function Pill({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}
