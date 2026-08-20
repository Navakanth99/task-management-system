import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  ListTodo,
} from "lucide-react";
import {
  fetchTasks,
  deleteTask,
  updateTaskStatus,
} from "@/services/taskService";
import type { Task, TaskStatus, TaskPriority, SortField } from "@/types";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { TaskTableSkeleton } from "@/components/ui/Skeleton";
import { ErrorState, EmptyState } from "@/components/ui/States";
import { TaskFormModal } from "@/components/tasks/TaskFormModal";

const PAGE_SIZE = 10;

const statusFilters: { value: TaskStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Status" },
  { value: "TODO", label: "Todo" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
];

const priorityFilters: { value: TaskPriority | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Priority" },
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

const sortOptions: {
  value: string;
  label: string;
  field: SortField;
  order: "asc" | "desc";
}[] = [
  {
    value: "due_asc",
    label: "Due Date: Earliest",
    field: "dueDate",
    order: "asc",
  },
  {
    value: "due_desc",
    label: "Due Date: Latest",
    field: "dueDate",
    order: "desc",
  },
  {
    value: "prio_desc",
    label: "Priority: High to Low",
    field: "priority",
    order: "desc",
  },
  {
    value: "prio_asc",
    label: "Priority: Low to High",
    field: "priority",
    order: "asc",
  },
  { value: "newest", label: "Newest", field: "createdAt", order: "desc" },
  { value: "oldest", label: "Oldest", field: "createdAt", order: "asc" },
];

const formatDueDate = (date: string | null | undefined) => {
  if (!date) {
    return "No due date";
  }

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return "No due date";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function isOverdue(due: string | null, status: TaskStatus): boolean {
  if (!due || status === "DONE") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(due + "T00:00:00") < today;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "ALL">(
    "ALL",
  );
  const [sortValue, setSortValue] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const sortOption =
    sortOptions.find((o) => o.value === sortValue) ?? sortOptions[4];

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetchTasks({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        status: statusFilter === "ALL" ? undefined : statusFilter,

        priority: priorityFilter === "ALL" ? undefined : priorityFilter,
        sortBy: sortOption.field,
        sortOrder: sortOption.order,
      });
      setTasks(res.tasks);
      setTotal(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    search,
    statusFilter,
    priorityFilter,
    sortOption.field,
    sortOption.order,
  ]);

  useEffect(() => {
    load();
  }, [load]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setPage(1), 0);
    return () => clearTimeout(t);
  }, [search, statusFilter, priorityFilter, sortValue]);

  const handleCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteTask(id);
      await load();
    } catch {
      // keep row; error is transient
    } finally {
      setDeletingId(null);
    }
  };

  const handleMarkDone = async (task: Task) => {
    const next: TaskStatus = task.status === "DONE" ? "TODO" : "DONE";
    try {
      await updateTaskStatus(task._id, next);
      await load();
    } catch {
      // transient
    }
  };

  const hasActiveFilters =
    search || statusFilter !== "ALL" || priorityFilter !== "ALL";

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setSortValue("newest");
    setPage(1);
  };

  const showingFrom = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tasks
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and track your work.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="btn-primary self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Create Task
        </button>
      </div>

      {/* Filters bar */}
      <div className="card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks by title..."
              className="input pl-9"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as TaskStatus | "ALL")
              }
              className="input lg:w-40"
            >
              {statusFilters.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value as TaskPriority | "ALL")
              }
              className="input lg:w-40"
            >
              {priorityFilters.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <select
              value={sortValue}
              onChange={(e) => setSortValue(e.target.value)}
              className="input col-span-2 sm:col-span-1 lg:w-48"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          {hasActiveFilters && (
            <button onClick={resetFilters} className="btn-ghost shrink-0">
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <TaskTableSkeleton rows={5} />
      ) : error ? (
        <ErrorState message="Unable to load your tasks." onRetry={load} />
      ) : tasks.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            title="No tasks match your search"
            message="Try changing your filters or clearing them."
            icon={<Search className="h-6 w-6 text-gray-400" />}
            action={{ label: "Clear Filters", onClick: resetFilters }}
          />
        ) : (
          <EmptyState
            title="No tasks found"
            message="Create your first task to get started."
            icon={<ListTodo className="h-6 w-6 text-gray-400" />}
            action={{ label: "+ Create Task", onClick: handleCreate }}
          />
        )
      ) : (
        <>
          {/* Desktop table */}
          <div className="card hidden overflow-hidden md:block">
            <table className="w-full">
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
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-800">
                {tasks.map((task) => (
                  <tr
                    key={task._id}
                    className="group transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-6 py-4">
                      <p
                        className={`text-sm font-medium ${task.status === "DONE" ? "text-gray-400 line-through dark:text-gray-500" : "text-gray-900 dark:text-gray-100"}`}
                      >
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
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm ${isOverdue(task.dueDate, task.status) ? "font-medium text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-300"}`}
                      >
                        {formatDueDate(task.dueDate)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleMarkDone(task)}
                          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30"
                          title={
                            task.status === "DONE"
                              ? "Mark as Todo"
                              : "Mark as Done"
                          }
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(task)}
                          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          disabled={deletingId === task._id}
                          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-900/30"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {tasks.map((task) => (
              <div key={task._id} className="card p-4">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`text-sm font-medium ${task.status === "DONE" ? "text-gray-400 line-through dark:text-gray-500" : "text-gray-900 dark:text-gray-100"}`}
                  >
                    {task.title}
                  </p>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => handleMarkDone(task)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(task)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      disabled={deletingId === task._id}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-900/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {task.description && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {task.description}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-2">
                  <StatusBadge status={task.status} />
                  <PriorityBadge priority={task.priority} />
                  <span
                    className={`ml-auto text-xs ${isOverdue(task.dueDate, task.status) ? "font-medium text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}
                  >
                    {formatDueDate(task.dueDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {showingFrom}–{showingTo} of {total}{" "}
              {total === 1 ? "task" : "tasks"}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn-secondary px-3 py-1.5"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="px-3 text-sm text-gray-600 dark:text-gray-300">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="btn-secondary px-3 py-1.5"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}

      <TaskFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={load}
        task={editingTask}
      />
    </div>
  );
}
