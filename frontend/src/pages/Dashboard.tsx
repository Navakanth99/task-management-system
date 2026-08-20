import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ListTodo,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowRight,
  Plus,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchAnalytics } from "@/services/analyticsService";
import { fetchTasks } from "@/services/taskService";
import type { AnalyticsResponse, Task } from "@/types";
import { StatCardSkeleton } from "@/components/ui/Skeleton";
import { TaskRowSkeleton } from "@/components/ui/Skeleton";
import { ErrorState, EmptyState } from "@/components/ui/States";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function formatDueDate(due: string | null): string {
  if (!due) return "—";
  const d = new Date(due + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [recent, setRecent] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const [a, r] = await Promise.all([
        fetchAnalytics(),
        fetchTasks({
          page: 1,
          limit: 5,
          sortBy: "createdAt",
          sortOrder: "desc",
        }),
      ]);

      setAnalytics(a);
      setRecent(r.tasks);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = [
    {
      label: "Total Tasks",
      value: analytics?.totalTasks ?? 0,
      icon: ListTodo,
      color: "text-brand-600 dark:text-brand-400",
    },
    {
      label: "Completed",
      value: analytics?.completedTasks ?? 0,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Pending",
      value: analytics?.pendingTasks ?? 0,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Completion",
      value: `${analytics?.completionPercentage ?? 0}%`,
      icon: TrendingUp,
      color: "text-purple-600 dark:text-purple-400",
    },
  ];

  const userName = user?.name ?? "there";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {greeting()}, {userName.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Here's an overview of your tasks.
        </p>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {s.label}
                  </p>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {s.value}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Recent tasks */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Recent Tasks
          </h2>
          <Link
            to="/tasks"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="card overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <TaskRowSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState message="Unable to load your tasks." onRetry={load} />
        ) : recent.length === 0 ? (
          <EmptyState
            title="No tasks yet"
            message="Create your first task to get started."
            icon={<ListTodo className="h-6 w-6 text-gray-400" />}
            action={{
              label: "+ Create Task",
              onClick: () => (window.location.href = "/tasks"),
            }}
          />
        ) : (
          <div className="card overflow-hidden">
            {/* Desktop table */}
            <table className="hidden w-full md:table">
              <thead>
                <tr className="border-b bg-gray-50 dark:bg-gray-900/50">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-800">
                {recent.map((task) => (
                  <tr
                    key={task._id}
                    className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400 max-w-xs">
                          {task.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="px-6 py-4">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {formatDueDate(task.dueDate ?? null)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Mobile cards */}
            <div className="divide-y md:hidden dark:divide-gray-800">
              {recent.map((task) => (
                <div key={task._id} className="p-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                      {task.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    <StatusBadge status={task.status} />
                    <PriorityBadge priority={task.priority} />
                    <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                      {formatDueDate(task.due_date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
